import { nodeFactory } from '../../../awst/node-factory'
import type { Expression, LValue } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { CodeError } from '../../../errors'
import { codeInvariant } from '../../../util'
import type { PTypeOrClass } from '../../ptypes'
import {
  ArrayLiteralPType,
  ArrayPType,
  isArrayType,
  isTupleLike,
  MutableTuplePType,
  ReadonlyArrayPType,
  ReadonlyTuplePType,
} from '../../ptypes'
import { instanceEb } from '../../type-registry'
import { newArray, newTuple } from '../array-like/util'
import type { NodeBuilder } from '../index'
import { InstanceBuilder } from '../index'
import type { StaticallyIterable } from '../traits/static-iterator'
import { StaticIterator } from '../traits/static-iterator'
import { requireIntegerConstant } from '../util'
import { arrayLength } from '../util/array/length'

export class ArrayLiteralExpressionBuilder extends InstanceBuilder implements StaticallyIterable {
  readonly isConstant = false

  readonly ptype: ArrayLiteralPType

  /**
   *
   * @param sourceLocation
   * @param items
   * @param isSingleEval Is this builder the result of calling `.singleEvaluation()` and thus further calls should just return this builder
   */
  constructor(
    sourceLocation: SourceLocation,
    private readonly items: InstanceBuilder[],
    private readonly isSingleEval = false,
  ) {
    super(sourceLocation)
    this.ptype = new ArrayLiteralPType({ items: items.map((i) => i.ptype) })
  }

  resolve(): Expression {
    const arrayType = this.ptype.getArrayType()

    return nodeFactory.newArray({
      sourceLocation: this.sourceLocation,
      values: this.items.map((i) => i.resolve()),
      wtype: arrayType.wtype,
    })
  }

  resolveLValue(): LValue {
    throw new CodeError('Array literal is not a valid assignment target', { sourceLocation: this.sourceLocation })
  }

  singleEvaluation(): InstanceBuilder {
    if (this.isSingleEval) return this
    if (this.items.length === 0) return this
    const tuple = nodeFactory.singleEvaluation({
      source: nodeFactory.tupleExpression({
        items: this.items.map((i) => i.resolve()),
        sourceLocation: this.sourceLocation,
      }),
    })
    return new ArrayLiteralExpressionBuilder(
      this.sourceLocation,
      this.ptype.items.map((itemType, index) =>
        instanceEb(
          nodeFactory.tupleItemExpression({
            base: tuple,
            index: BigInt(index),
            sourceLocation: this.items[index].sourceLocation,
          }),
          itemType,
        ),
      ),
      true,
    )
  }

  indexAccess(index: InstanceBuilder | bigint, sourceLocation: SourceLocation): NodeBuilder {
    const indexNum = Number(typeof index === 'bigint' ? index : requireIntegerConstant(index).value)
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
    if (isArrayType(ptype)) {
      return instanceEb(newArray(ptype, this), ptype)
    }
    if (isTupleLike(ptype)) {
      return instanceEb(newTuple(ptype, this), ptype)
    }
    return super.resolveToPType(ptype)
  }

  resolvableToPType(ptype: PTypeOrClass): boolean {
    if (ptype.equals(this.ptype)) return true
    if (ptype instanceof ReadonlyTuplePType || ptype instanceof MutableTuplePType) {
      return ptype.items.every((itemType, index) => this.items[index].resolvableToPType(itemType))
    }
    if (ptype instanceof ArrayLiteralPType && ptype.items.length === this.items.length) {
      return this.items.every((item, index) => item.resolvableToPType(ptype.items[index]))
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
