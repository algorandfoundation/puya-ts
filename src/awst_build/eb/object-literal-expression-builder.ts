import { Expression, LValue } from '../../awst/nodes'
import { PType } from '../ptypes'
import { InstanceBuilder, InstanceExpressionBuilder, LiteralExpressionBuilder, NodeBuilder } from './index'
import { SourceLocation } from '../../awst/source-location'
import { codeInvariant, invariant } from '../../util'
import { ObjectPType } from '../ptypes/ptype-classes'
import { nodeFactory } from '../../awst/node-factory'
import { CodeError } from '../../errors'
import { typeRegistry } from '../type-registry'
import { requestExpressionOfType, requireExpressionOfType, requireInstanceBuilder } from './util'

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
  ) {
    super(sourceLocation)
    this._ptype = ptype
  }

  resolve(): Expression {
    // Resolve object to a tuple using its own inferred types
    return this.toTuple(this.ptype, this.sourceLocation)
  }
  resolveLValue(): LValue {
    throw new CodeError('Object literal is not a valid assignment target', { sourceLocation: this.sourceLocation })
  }
  memberAccess(name: string, sourceLocation: SourceLocation): InstanceBuilder {
    for (const part of this.parts.toReversed()) {
      if (part.type === 'properties') {
        if (Object.hasOwn(part.properties, name)) {
          return part.properties[name]
        }
      } else {
        if (part.obj.hasProperty(name)) {
          return requireInstanceBuilder(part.obj.memberAccess(name, sourceLocation), sourceLocation)
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
        .map(([p, propPType]) => requireExpressionOfType(this.memberAccess(p, sourceLocation), propPType, sourceLocation)),
      sourceLocation,
      wtype: ptype.wtype,
    })
  }

  resolvableToPType(ptype: PType, sourceLocation: SourceLocation): boolean {
    if (!(ptype instanceof ObjectPType)) return false
    for (const [prop, propPType] of ptype.orderedProperties()) {
      if (!this.hasProperty(prop)) return false
      const propValue = requestExpressionOfType(this.memberAccess(prop, sourceLocation), propPType, sourceLocation)
      if (propValue === undefined) return false
    }
    return true
  }
  resolveToPType(ptype: PType, sourceLocation: SourceLocation): InstanceBuilder {
    codeInvariant(ptype instanceof ObjectPType, `Object literal cannot be resolved to type ${ptype}`, sourceLocation)
    return new ObjectExpressionBuilder(this.toTuple(ptype, sourceLocation), ptype)
  }
}

export class ObjectExpressionBuilder extends InstanceExpressionBuilder {
  readonly _ptype: ObjectPType
  get ptype(): ObjectPType {
    return this._ptype
  }
  constructor(expr: Expression, ptype: PType) {
    super(expr)
    invariant(ptype instanceof ObjectPType, `ObjectExpressionBuilder must be instantiated with ptype of ObjectPType`)
    this._ptype = ptype
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    const propertyIndex = this.ptype.orderedProperties().findIndex(([prop]) => prop === name)
    if (propertyIndex === -1) {
      return super.memberAccess(name, sourceLocation)
    }
    const propertyPtype = this.ptype.getPropertyType(name)
    return typeRegistry.getInstanceEb(
      nodeFactory.tupleItemExpression({
        index: BigInt(propertyIndex),
        sourceLocation,
        wtype: propertyPtype.wtypeOrThrow,
        base: this._expr,
      }),
      propertyPtype,
    )
  }

  hasProperty(name: string): boolean {
    return this.ptype.orderedProperties().some(([prop]) => prop === name)
  }
}
