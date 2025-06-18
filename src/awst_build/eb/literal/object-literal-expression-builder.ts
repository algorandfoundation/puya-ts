import { nodeFactory } from '../../../awst/node-factory'
import type { Expression, LValue } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { CodeError } from '../../../errors'
import { instanceOfAny } from '../../../util'
import type { PTypeOrClass } from '../../ptypes'
import { ImmutableObjectPType, MutableObjectPType, ObjectLiteralPType } from '../../ptypes'
import { getPropertyType } from '../../ptypes/visitors/index-type-visitor'
import { spreadableProperties } from '../../ptypes/visitors/spreadable-properties'
import { instanceEb } from '../../type-registry'
import type { InstanceBuilder, NodeBuilder } from '../index'
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
  readonly isConstant = false

  readonly ptype: ObjectLiteralPType

  constructor(
    sourceLocation: SourceLocation,

    private readonly parts: ObjectLiteralParts[],
  ) {
    super(sourceLocation)
    this.ptype = new ObjectLiteralPType({
      properties: Object.fromEntries(
        this.parts.flatMap((p) =>
          p.type === 'properties'
            ? Object.entries(p.properties).map(([k, v]) => [k, v.ptype])
            : spreadableProperties(p.obj.ptype, p.obj.sourceLocation),
        ),
      ),
    })
  }

  resolve(): Expression {
    // Resolve object to a tuple using its own inferred types
    return this.toObjectType(this.ptype.toImmutable())
  }
  resolveLValue(): LValue {
    return nodeFactory.tupleExpression({
      items: this.ptype
        .orderedProperties()
        .map(([p, propPType]) => requireInstanceBuilder(this.memberAccess(p, this.sourceLocation)).resolveLValue()),
      sourceLocation: this.sourceLocation,
      wtype: this.ptype.toImmutable().wtype,
    })
  }
  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    for (const part of this.parts.toReversed()) {
      if (part.type === 'properties') {
        if (Object.hasOwn(part.properties, name)) {
          return part.properties[name]
        }
      } else {
        if (part.obj.hasProperty(name)) {
          return part.obj.memberAccess(name, sourceLocation)
        }
      }
    }
    throw new CodeError(`${name} does not exist on ${this.typeDescription}`, { sourceLocation })
  }

  hasProperty(name: string): boolean {
    return this.parts.some((part) => (part.type === 'properties' ? Object.hasOwn(part.properties, name) : part.obj.hasProperty(name)))
  }

  private toObjectType(ptype: ImmutableObjectPType | MutableObjectPType): Expression {
    let base: InstanceBuilder
    if (this.ptype.equals(ptype)) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      base = this
    } else {
      // Resolve this object to a tuple using declared order but using the target property types.
      // This will resolve numeric literals to algo-ts types if available
      const tempType = new ImmutableObjectPType({
        properties: Object.fromEntries(
          this.ptype.orderedProperties().map(([p]) => [p, getPropertyType(ptype, p, this.sourceLocation)] as const),
        ),
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
    if (ptype instanceof MutableObjectPType) {
      return nodeFactory.newStruct({
        wtype: ptype.wtype,
        sourceLocation: this.sourceLocation,
        values: new Map(
          ptype
            .orderedProperties()
            .map(([p, propPType]) => [p, requireExpressionOfType(base.memberAccess(p, this.sourceLocation), propPType)]),
        ),
      })
    } else {
      return nodeFactory.tupleExpression({
        items: ptype
          .orderedProperties()
          .map(([p, propPType]) => requireExpressionOfType(base.memberAccess(p, this.sourceLocation), propPType)),
        sourceLocation: this.sourceLocation,
        wtype: ptype.wtype,
      })
    }
  }

  resolvableToPType(ptype: PTypeOrClass): ptype is ImmutableObjectPType | MutableObjectPType {
    if (ptype.equals(this.ptype)) return true

    if (!instanceOfAny(ptype, ImmutableObjectPType, MutableObjectPType)) return false
    for (const [prop, propPType] of ptype.orderedProperties()) {
      if (!this.hasProperty(prop)) return false
      const propValue = requestExpressionOfType(this.memberAccess(prop, this.sourceLocation), propPType)
      if (propValue === undefined) return false
    }
    return true
  }

  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    if (ptype.equals(this.ptype)) return this

    if (!this.resolvableToPType(ptype))
      throw new CodeError(`${this.typeDescription} cannot be resolved to ${ptype}`, { sourceLocation: this.sourceLocation })
    return instanceEb(this.toObjectType(ptype), ptype)
  }
}
