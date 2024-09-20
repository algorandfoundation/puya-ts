import { nodeFactory } from '../../../awst/node-factory'
import type { Expression, LValue } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { CodeError } from '../../../errors'
import { codeInvariant } from '../../../util'
import type { PTypeOrClass } from '../../ptypes'
import { ObjectPType } from '../../ptypes'
import type { InstanceBuilder } from '../index'
import { LiteralExpressionBuilder } from '../literal-expression-builder'
import { requestExpressionOfType, requireExpressionOfType, requireInstanceBuilder } from '../util'
import { ObjectExpressionBuilder } from './object-expression-builder'

export type ObjectLiteralParts =
  | {
      type: 'properties'
      properties: Record<string, InstanceBuilder>
    }
  | {
      type: 'spread-object'
      obj: InstanceBuilder
    }

export class ObjectLiteralExpressionBuilder extends LiteralExpressionBuilder {
  readonly _ptype: ObjectPType
  get ptype(): ObjectPType {
    return this._ptype
  }

  constructor(
    sourceLocation: SourceLocation,
    ptype: ObjectPType,
    private readonly parts: ObjectLiteralParts[],
    private readonly generateDiscardedVarName: () => string,
  ) {
    super(sourceLocation)
    this._ptype = ptype
  }

  resolve(): Expression {
    // Resolve object to a tuple using its own inferred types
    return this.toTuple(this.ptype, this.sourceLocation)
  }
  resolveLValue(): LValue {
    return nodeFactory.tupleExpression({
      items: this.ptype.orderedProperties().map(([p, propPType]) => this.memberAccess(p, this.sourceLocation).resolveLValue()),
      sourceLocation: this.sourceLocation,
    })
  }
  memberAccess(name: string, sourceLocation: SourceLocation): InstanceBuilder {
    for (const part of this.parts.toReversed()) {
      if (part.type === 'properties') {
        if (Object.hasOwn(part.properties, name)) {
          return part.properties[name]
        }
      } else {
        if (part.obj.hasProperty(name)) {
          return requireInstanceBuilder(part.obj.memberAccess(name, sourceLocation))
        }
      }
    }
    throw new CodeError(`${name} does not exist on ${this.typeDescription}`, { sourceLocation })
  }

  hasProperty(name: string): boolean {
    return this.parts.some((part) => (part.type === 'properties' ? Object.hasOwn(part.properties, name) : part.obj.hasProperty(name)))
  }

  private toTuple(ptype: ObjectPType, sourceLocation: SourceLocation): Expression {
    return nodeFactory.tupleExpression({
      items: ptype
        .orderedProperties()
        .map(([p, propPType]) => requireExpressionOfType(this.memberAccess(p, this.sourceLocation), propPType)),
      sourceLocation: this.sourceLocation,
    })
  }

  resolvableToPType(ptype: PTypeOrClass): boolean {
    if (!(ptype instanceof ObjectPType)) return false
    for (const [prop, propPType] of ptype.orderedProperties()) {
      if (!this.hasProperty(prop)) return false
      const propValue = requestExpressionOfType(this.memberAccess(prop, this.sourceLocation), propPType)
      if (propValue === undefined) return false
    }
    return true
  }

  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    codeInvariant(ptype instanceof ObjectPType, `Object literal cannot be resolved to type ${ptype}`, this.sourceLocation)
    return new ObjectExpressionBuilder(this.toTuple(ptype, this.sourceLocation), ptype)
  }

  assign(other: InstanceBuilder, sourceLocation: SourceLocation): InstanceBuilder {
    const sourceType = other.ptype
    codeInvariant(sourceType instanceof ObjectPType, 'Assignment source must be an object type')
    const source = other.resolve()

    const targets: LValue[] = []
    for (const [sourceProp, sourcePropType] of sourceType.orderedProperties()) {
      if (this.hasProperty(sourceProp)) {
        targets.push(this.memberAccess(sourceProp, sourceLocation).resolveLValue())
      } else {
        targets.push(
          nodeFactory.varExpression({ name: this.generateDiscardedVarName(), sourceLocation, wtype: sourcePropType.wtypeOrThrow }),
        )
      }
    }
    return new ObjectExpressionBuilder(
      nodeFactory.assignmentExpression({
        target: nodeFactory.tupleExpression({ items: targets, sourceLocation }),
        value: source,
        sourceLocation,
      }),
      sourceType,
    )
  }
}
