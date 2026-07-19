import { nodeFactory } from '../../../awst/node-factory'
import type { Expression, LValue } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { CodeError, InternalError } from '../../../errors'
import { invariant } from '../../../util'
import type { ImmutableObjectPType, MutableObjectPType, PTypeField, PTypeOrClass } from '../../ptypes'
import { isObjectType, ObjectLiteralPType } from '../../ptypes'
import { getIndexType } from '../../ptypes/visitors/index-type-visitor'
import { spreadableProperties } from '../../ptypes/visitors/spreadable-properties'
import { instanceEb } from '../../type-registry'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { LiteralExpressionBuilder } from '../literal-expression-builder'
import { ResolvedObjectLiteralExpressionBuilder } from '../objects/resolved-object-literal-expression-builder'
import { createObject } from '../objects/util'
import { requestExpressionOfType, requireExpressionOfType, requireInstanceBuilder } from '../util'

export type ObjectLiteralPart =
  | {
      type: 'properties'
      property: ObjectLiteralBinding
    }
  | {
      type: 'spread-object'
      obj: InstanceBuilder
      spreadLocation: SourceLocation
    }

export type ObjectLiteralBinding = { name: string; target: InstanceBuilder }

export class ObjectLiteralExpressionBuilder extends LiteralExpressionBuilder {
  readonly isConstant = false

  static fromParts(sourceLocation: SourceLocation, parts: ObjectLiteralPart[]): ObjectLiteralExpressionBuilder {
    // `bindings` preserves every contributing entry in source order, so that destructuring with
    // duplicate keys (e.g. `({ a: p, a: q } = obj)`) keeps both targets. `propertyToItemMap` maps
    // each source property name to its latest binding for object-literal "last write wins" semantics
    // (spread overrides, duplicate keys).
    const propertyToItemMap: Record<string, number> = {}
    const bindings: ObjectLiteralBinding[] = []
    for (const part of parts) {
      if (part.type === 'properties') {
        const { name, target } = part.property
        propertyToItemMap[name] = bindings.length
        bindings.push({ name, target })
      } else {
        const obj = part.obj.singleEvaluation()
        for (const [name] of spreadableProperties(part.obj.ptype, part.spreadLocation)) {
          propertyToItemMap[name] = bindings.length
          bindings.push({ name, target: requireInstanceBuilder(obj.memberAccess(name, part.spreadLocation)) })
        }
      }
    }

    const types: PTypeField[] = Object.entries(propertyToItemMap).map(([name, idx]) => ({
      name,
      ptype: bindings[idx].target.ptype,
      description: null,
    }))
    return new ObjectLiteralExpressionBuilder(sourceLocation, new ObjectLiteralPType({ properties: types }), propertyToItemMap, bindings)
  }

  private constructor(
    sourceLocation: SourceLocation,
    public readonly ptype: ObjectLiteralPType,
    private readonly propertyToItemMap: Record<string, number>,
    public readonly bindings: ReadonlyArray<ObjectLiteralBinding>,
    private readonly isSingleEval = false,
  ) {
    super(sourceLocation)
  }

  singleEvaluation(): InstanceBuilder {
    if (this.isSingleEval) return this
    invariant(
      this.bindings.length === Object.keys(this.propertyToItemMap).length,
      'singleEvaluation called with duplicate or spread-overridden bindings; route through resolveToPType first',
    )
    const tuple = nodeFactory.singleEvaluation({
      source: nodeFactory.tupleExpression({
        items: this.bindings.map((item) => item.target.resolve()),
        sourceLocation: this.sourceLocation,
        wtype: this.ptype.wtype,
      }),
    })

    return new ObjectLiteralExpressionBuilder(
      this.sourceLocation,
      this.ptype,
      this.propertyToItemMap,
      this.bindings.map((item, index) => ({
        name: item.name,
        target: instanceEb(
          nodeFactory.tupleItemExpression({
            base: tuple,
            index: BigInt(index),
            sourceLocation: item.target.sourceLocation,
          }),
          item.target.ptype,
        ),
      })),
      true,
    )
  }

  resolve(): Expression {
    throw new InternalError('Cannot resolve object literal', { sourceLocation: this.sourceLocation })
  }
  resolveLValue(): LValue {
    invariant(
      this.bindings.length === Object.keys(this.propertyToItemMap).length,
      'resolveLValue called with duplicate bindings; destructuring assignment must iterate bindings via buildAssignmentValues',
    )
    return nodeFactory.tupleExpression({
      items: this.bindings.map(({ target }) => target.resolveLValue()),
      sourceLocation: this.sourceLocation,
      wtype: this.ptype.getImmutable().wtype,
    })
  }
  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    if (name in this.propertyToItemMap) {
      return this.bindings[this.propertyToItemMap[name]].target
    }
    throw new CodeError(`${name} does not exist on ${this.typeDescription}`, { sourceLocation })
  }

  hasProperty(name: string): boolean {
    return name in this.propertyToItemMap
  }

  private toObjectType(ptype: ImmutableObjectPType | MutableObjectPType | ObjectLiteralPType): Expression {
    let base: InstanceBuilder
    if (this.isSingleEval || (this.ptype.hasSameStructure(ptype) && this.bindings.length === Object.keys(ptype.properties).length)) {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      base = this
    } else {
      // Resolve all items to a tuple but using the target ptype
      // This will resolve numeric literals to algo-ts types if available

      const itemToPropertyType = Object.fromEntries(
        Object.entries(this.propertyToItemMap).map(([propName, index]) => [index, getIndexType(ptype, propName, this.sourceLocation)]),
      )

      const tuple = nodeFactory.singleEvaluation({
        source: nodeFactory.tupleExpression({
          items: this.bindings.map((item, index) => requireExpressionOfType(item.target, itemToPropertyType[index] ?? item.target.ptype)),
          sourceLocation: this.sourceLocation,
        }),
      })
      const tempType = new ObjectLiteralPType({
        properties: ptype.properties,
      })

      base = new ResolvedObjectLiteralExpressionBuilder(
        nodeFactory.tupleExpression({
          items: ptype.properties.map(({ name }) => {
            const index = this.propertyToItemMap[name]
            return nodeFactory.tupleItemExpression({
              base: tuple,
              index: BigInt(index),
              sourceLocation: this.bindings[index].target.sourceLocation,
            })
          }),
          sourceLocation: this.sourceLocation,
          wtype: tempType.wtype,
        }),
        tempType,
      ).singleEvaluation()
    }
    return createObject(ptype, base)
  }

  resolvableToPType(ptype: PTypeOrClass): ptype is ImmutableObjectPType | MutableObjectPType | ObjectLiteralPType {
    if (ptype.equals(this.ptype)) return true

    if (!isObjectType(ptype)) return false
    for (const { name, ptype: propPType } of ptype.properties) {
      if (!this.hasProperty(name)) return false
      const propValue = requestExpressionOfType(this.memberAccess(name, this.sourceLocation), propPType)
      if (propValue === undefined) return false
    }
    return true
  }

  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    if (!this.resolvableToPType(ptype))
      throw new CodeError(`${this.typeDescription} cannot be resolved to ${ptype}`, { sourceLocation: this.sourceLocation })

    return instanceEb(this.toObjectType(ptype), ptype)
  }

  checkForUnclonedMutables(scenario: string): boolean {
    const usedIndexes = new Set(Object.values(this.propertyToItemMap))
    let contains = false
    for (const [idx, item] of this.bindings.entries()) {
      if (!usedIndexes.has(idx)) continue
      contains ||= item.target.checkForUnclonedMutables('being used in an object literal')
    }
    return contains
  }
}
