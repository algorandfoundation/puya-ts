import { nodeFactory } from '../../../awst/node-factory'
import type { Expression, LValue } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { CodeError } from '../../../errors'
import type { PType, PTypeOrClass } from '../../ptypes'
import { ImmutableObjectPType, isObjectType, MutableObjectPType, ObjectLiteralPType } from '../../ptypes'
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

  static fromParts(sourceLocation: SourceLocation, parts: ObjectLiteralParts[]): ObjectLiteralExpressionBuilder {
    const types: Record<string, PType> = {}
    const propertyToItemMap: Record<string, number> = {}
    const items: InstanceBuilder[] = []
    for (const part of parts) {
      if (part.type === 'properties') {
        for (const [prop, propBuilder] of Object.entries(part.properties)) {
          types[prop] = propBuilder.ptype
          propertyToItemMap[prop] = items.length
          items.push(propBuilder)
        }
      } else {
        const obj = part.obj.singleEvaluation()
        for (const [prop, propType] of spreadableProperties(part.obj.ptype, part.obj.sourceLocation)) {
          types[prop] = propType
          propertyToItemMap[prop] = items.length
          items.push(requireInstanceBuilder(obj.memberAccess(prop, sourceLocation)))
        }
      }
    }
    return new ObjectLiteralExpressionBuilder(sourceLocation, new ObjectLiteralPType({ properties: types }), propertyToItemMap, items)
  }

  private constructor(
    sourceLocation: SourceLocation,
    public readonly ptype: ObjectLiteralPType,
    private readonly propertyToItemMap: Record<string, number>,
    private readonly items: InstanceBuilder[],
    private readonly isSingleEval = false,
  ) {
    super(sourceLocation)

    // this.ptype = new ObjectLiteralPType({
    //   properties: Object.fromEntries(
    //     this.parts.flatMap((p) =>
    //       p.type === 'properties'
    //         ? Object.entries(p.properties).map(([k, v]) => [k, v.ptype])
    //         : spreadableProperties(p.obj.ptype, p.obj.sourceLocation),
    //     ),
    //   ),
    // })
    // this.items = {}
    // for(const )
  }

  singleEvaluation(): InstanceBuilder {
    if (this.isSingleEval) return this
    const tuple = nodeFactory.singleEvaluation({
      source: nodeFactory.tupleExpression({
        items: this.items.map((item) => item.resolve()),
        sourceLocation: this.sourceLocation,
        wtype: this.ptype.wtype,
      }),
    })

    return new ObjectLiteralExpressionBuilder(
      this.sourceLocation,
      this.ptype,
      this.propertyToItemMap,
      this.items.map((item, index) =>
        instanceEb(
          nodeFactory.tupleItemExpression({
            base: tuple,
            index: BigInt(index),
            sourceLocation: item.sourceLocation,
          }),
          item.ptype,
        ),
      ),
      true,
    )
  }

  resolve(): Expression {
    // Resolve object to a tuple using its own inferred types
    return this.toObjectType(this.ptype.getImmutable())
  }
  resolveLValue(): LValue {
    return nodeFactory.tupleExpression({
      items: this.ptype
        .orderedProperties()
        .map(([p, propPType]) => requireInstanceBuilder(this.memberAccess(p, this.sourceLocation)).resolveLValue()),
      sourceLocation: this.sourceLocation,
      wtype: this.ptype.getImmutable().wtype,
    })
  }
  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    if (name in this.propertyToItemMap) {
      return this.items[this.propertyToItemMap[name]]
    }
    throw new CodeError(`${name} does not exist on ${this.typeDescription}`, { sourceLocation })
  }

  hasProperty(name: string): boolean {
    return name in this.propertyToItemMap
  }

  private toObjectType(ptype: ImmutableObjectPType | MutableObjectPType): Expression {
    let base: InstanceBuilder
    if (this.ptype.hasSameStructure(ptype) || this.isSingleEval) {
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

  resolvableToPType(ptype: PTypeOrClass): ptype is ImmutableObjectPType | MutableObjectPType | ObjectLiteralPType {
    if (ptype.equals(this.ptype)) return true

    if (!isObjectType(ptype)) return false
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
    if (ptype instanceof ObjectLiteralPType) {
      const indexToType = Object.fromEntries(Object.entries(this.propertyToItemMap).map(([prop, index]) => [index, ptype.properties[prop]]))
      return new ObjectLiteralExpressionBuilder(
        this.sourceLocation,
        ptype,
        this.propertyToItemMap,
        this.items.map((item, index) => (index in indexToType ? item.resolveToPType(indexToType[index]) : item)),
      )
    }
    return instanceEb(this.toObjectType(ptype), ptype)
  }
}
