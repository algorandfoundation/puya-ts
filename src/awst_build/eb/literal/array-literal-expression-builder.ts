import { nodeFactory } from '../../../awst/node-factory'
import type { Expression, LValue } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { codeInvariant } from '../../../util'
import type { PTypeOrClass } from '../../ptypes'
import { ArrayLiteralPType, ArrayPType, MutableTuplePType, ReadonlyArrayPType, ReadonlyTuplePType } from '../../ptypes'
import { instanceEb } from '../../type-registry'
import type { NodeBuilder } from '../index'
import { InstanceBuilder } from '../index'
import type { StaticallyIterable } from '../traits/static-iterator'
import { StaticIterator } from '../traits/static-iterator'
import { requireIntegerConstant } from '../util'
import { arrayLength } from '../util/array/length'

export class ArrayLiteralExpressionBuilder extends InstanceBuilder implements StaticallyIterable {
  readonly isConstant = false

  readonly ptype: ArrayLiteralPType | ArrayPType | ReadonlyArrayPType
  constructor(
    sourceLocation: SourceLocation,
    private readonly items: InstanceBuilder[],
    ptype?: ArrayPType | ArrayLiteralPType | ReadonlyArrayPType,
  ) {
    super(sourceLocation)
    this.ptype = ptype ?? new ArrayLiteralPType({ items: items.map((i) => i.ptype) })
  }

  resolve(): Expression {
    const arrayType = this.ptype instanceof ArrayLiteralPType ? this.ptype.getArrayType() : this.ptype

    return nodeFactory.newArray({
      sourceLocation: this.sourceLocation,
      values: this.items.map((i) => i.resolve()),
      wtype: arrayType.wtype,
    })
  }

  resolveLValue(): LValue {
    return nodeFactory.tupleExpression({
      items: this.items.map((i) => i.resolveLValue()),
      sourceLocation: this.sourceLocation,
    })
  }

  singleEvaluation(): InstanceBuilder {
    return new ArrayLiteralExpressionBuilder(
      this.sourceLocation,
      this.items.map((i) => i.singleEvaluation()),
    )
  }

  indexAccess(index: InstanceBuilder, sourceLocation: SourceLocation): NodeBuilder {
    const indexNum = Number(requireIntegerConstant(index).value)
    codeInvariant(indexNum < this.items.length, `Index ${indexNum} out of bounds of array`, sourceLocation)
    return this.items[indexNum]
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'length':
        return arrayLength(this, sourceLocation)
    }
    return super.memberAccess(name, sourceLocation)
  }

  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    if (ptype instanceof ReadonlyTuplePType) {
      codeInvariant(
        ptype.items.length <= this.items.length,
        `Value of length ${this.items.length} cannot be resolved to type of length ${ptype.items.length}`,
      )
      const tupleExpr = nodeFactory.tupleExpression({
        items: ptype.items.map((itemType, index) => this.items[index].resolveToPType(itemType).resolve()),
        sourceLocation: this.sourceLocation,
      })
      return instanceEb(tupleExpr, ptype)
    }
    if (ptype instanceof MutableTuplePType) {
      codeInvariant(
        ptype.items.length <= this.items.length,
        `Value of length ${this.items.length} cannot be resolved to type of length ${ptype.items.length}`,
      )
      const tupleExpr = nodeFactory.tupleExpression({
        items: ptype.items.map((itemType, index) => this.items[index].resolveToPType(itemType).resolve()),
        sourceLocation: this.sourceLocation,
      })
      return instanceEb(nodeFactory.aRC4Encode({ value: tupleExpr, wtype: ptype.wtype, sourceLocation: this.sourceLocation }), ptype)
    }
    if (ptype instanceof ArrayPType || ptype instanceof ReadonlyArrayPType) {
      return new ArrayLiteralExpressionBuilder(
        this.sourceLocation,
        this.items.map((i) => i.resolveToPType(ptype.elementType)),
        ptype,
      )
    }
    return super.resolveToPType(ptype)
  }

  resolvableToPType(ptype: PTypeOrClass): boolean {
    if (ptype.equals(this.ptype)) return true
    if (ptype instanceof ReadonlyTuplePType || ptype instanceof MutableTuplePType) {
      return ptype.items.every((itemType, index) => this.items[index].resolvableToPType(itemType))
    }
    if (ptype instanceof ArrayPType || ptype instanceof ReadonlyArrayPType) {
      return this.items.every((i) => i.resolveToPType(ptype.elementType))
    }
    return false
  }

  [StaticIterator](): InstanceBuilder[] {
    return this.items
  }
}
