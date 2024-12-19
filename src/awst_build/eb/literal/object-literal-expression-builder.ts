import { nodeFactory } from '../../../awst/node-factory'
import type { Expression, LValue } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { CodeError } from '../../../errors'
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
    return this.toTuple(this.ptype)
  }
  resolveLValue(): LValue {
    return nodeFactory.tupleExpression({
      items: this.ptype.orderedProperties().map(([p, propPType]) => this.memberAccess(p, this.sourceLocation).resolveLValue()),
      sourceLocation: this.sourceLocation,
      wtype: this.ptype.wtype,
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

  private toTuple(ptype: ObjectPType): Expression {
    let base: InstanceBuilder
    if (this.ptype.equals(ptype)) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      base = this
    } else {
      // Resolve this object to a tuple using declared order but using the target property types.
      // This will resolve numeric literals to algo-ts types if available
      const tempType = new ObjectPType({
        isAnonymous: true,
        properties: Object.fromEntries(this.ptype.orderedProperties().map(([p]) => [p, ptype.getPropertyType(p)] as const)),
      })

      base = new ObjectExpressionBuilder(
        nodeFactory.tupleExpression({
          items: tempType
            .orderedProperties()
            .map(([p, propType]) => requireExpressionOfType(this.memberAccess(p, this.sourceLocation), propType)),
          sourceLocation: this.sourceLocation,
          wtype: tempType.wtype,
        }),
        tempType,
      ).singleEvaluation()
    }
    // Reorder properties to the target type
    return nodeFactory.tupleExpression({
      items: ptype
        .orderedProperties()
        .map(([p, propPType]) => requireExpressionOfType(base.memberAccess(p, this.sourceLocation), propPType)),
      sourceLocation: this.sourceLocation,
      wtype: ptype.wtype,
    })
  }

  resolvableToPType(ptype: PTypeOrClass): ptype is ObjectPType {
    if (!(ptype instanceof ObjectPType)) return false
    for (const [prop, propPType] of ptype.orderedProperties()) {
      if (!this.hasProperty(prop)) return false
      const propValue = requestExpressionOfType(this.memberAccess(prop, this.sourceLocation), propPType)
      if (propValue === undefined) return false
    }
    return true
  }

  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    if (!this.resolvableToPType(ptype))
      throw new CodeError(`${this.typeDescription} cannot be resolved to ${ptype}`, { sourceLocation: this.sourceLocation })
    return new ObjectExpressionBuilder(this.toTuple(ptype), ptype)
  }
}
