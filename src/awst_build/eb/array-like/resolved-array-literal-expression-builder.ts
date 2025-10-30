import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { codeInvariant, invariant } from '../../../util'
import type { PType, PTypeOrClass } from '../../ptypes'
import { ArrayLiteralPType, isArrayType, isTupleLike, uint64PType } from '../../ptypes'
import { instanceEb } from '../../type-registry'
import type { InstanceBuilder, NodeBuilder } from '../index'
import { InstanceExpressionBuilder } from '../index'
import type { StaticallyIterable } from '../traits/static-iterator'
import { StaticIterator } from '../traits/static-iterator'
import { requestInstanceBuilder, requireIntegerConstant } from '../util'
import { newArray, newTuple } from './util'

export class ResolvedArrayLiteralExpressionBuilder extends InstanceExpressionBuilder<ArrayLiteralPType> implements StaticallyIterable {
  constructor(expression: Expression, ptype: PType) {
    invariant(
      ptype instanceof ArrayLiteralPType,
      'ResolvedArrayLiteralExpressionBuilder must be built with ptype of type ArrayLiteralPType',
    )
    super(expression, ptype)
  }

  iterate(): Expression {
    return this.resolve()
  }

  resolvableToPType(ptype: PTypeOrClass): boolean {
    if (isArrayType(ptype)) {
      return this[StaticIterator]().every((item) => item.resolvableToPType(ptype.elementType))
    }
    if (isTupleLike(ptype)) {
      return ptype.items.every((itemType, index) =>
        requestInstanceBuilder(this.indexAccess(BigInt(index), this.sourceLocation))?.resolvableToPType(itemType),
      )
    }
    return super.resolvableToPType(ptype)
  }

  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    if (isArrayType(ptype)) {
      return instanceEb(newArray(ptype, this.singleEvaluation()), ptype)
    }
    if (isTupleLike(ptype)) {
      return instanceEb(newTuple(ptype, this.singleEvaluation()), ptype)
    }
    return super.resolveToPType(ptype)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'length':
        return instanceEb(
          nodeFactory.uInt64Constant({
            value: BigInt(this.ptype.items.length),
            sourceLocation,
          }),
          uint64PType,
        )
    }
    return super.memberAccess(name, sourceLocation)
  }

  indexAccess(index: InstanceBuilder | bigint, sourceLocation: SourceLocation): NodeBuilder {
    const indexNum = typeof index === 'bigint' ? index : requireIntegerConstant(index).value
    const itemType = this.ptype.items[Number(indexNum)]
    codeInvariant(
      indexNum < this.ptype.items.length && indexNum >= 0,
      "Index arg must be a numeric literal between 0 and the array literal's length",
    )
    return instanceEb(
      nodeFactory.tupleItemExpression({
        index: indexNum,
        sourceLocation,
        base: this._expr,
      }),
      itemType,
    )
  }

  [StaticIterator](): InstanceBuilder[] {
    const base = this.singleEvaluation().resolve()
    return this.ptype.items.map((itemType, index) =>
      instanceEb(
        nodeFactory.tupleItemExpression({
          index: BigInt(index),
          sourceLocation: this.sourceLocation,
          base,
        }),
        itemType,
      ),
    )
  }
}
