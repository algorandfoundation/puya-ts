import { nodeFactory } from '../../awst/node-factory'
import type { Expression } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { codeInvariant, invariant, zipStrict } from '../../util'
import type { PType, PTypeOrClass } from '../ptypes'
import { ArrayPType, MutableTuplePType, ReadonlyTuplePType, uint64PType } from '../ptypes'
import { instanceEb } from '../type-registry'
import type { InstanceBuilder, NodeBuilder } from './index'
import { InstanceExpressionBuilder } from './index'
import type { StaticallyIterable } from './traits/static-iterator'
import { StaticIterator } from './traits/static-iterator'
import { requireIntegerConstant } from './util'

export class MutableTupleExpressionBuilder extends InstanceExpressionBuilder<MutableTuplePType> implements StaticallyIterable {
  constructor(expression: Expression, ptype: PType) {
    invariant(ptype instanceof MutableTuplePType, 'MutableTupleExpressionBuilder must be built with ptype of type MutableTuplePType')
    super(expression, ptype)
  }

  iterate(): Expression {
    return this.resolve()
  }

  resolvableToPType(ptype: PTypeOrClass): boolean {
    if (ptype instanceof ArrayPType) {
      return this[StaticIterator]().every((item) => item.resolvableToPType(ptype.elementType))
    }
    if (ptype instanceof ReadonlyTuplePType) {
      return zipStrict(this[StaticIterator](), ptype.items).every(([item, itemType]) => item.resolvableToPType(itemType))
    }
    return super.resolvableToPType(ptype)
  }

  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    if (ptype instanceof ArrayPType && this.ptype.items.every((i) => i.equals(ptype.elementType))) {
      return instanceEb(
        nodeFactory.newArray({
          values: this[StaticIterator]().map((i) => i.resolve()),
          wtype: ptype.wtype,
          sourceLocation: this.sourceLocation,
        }),
        ptype,
      )
    }
    if (ptype instanceof ReadonlyTuplePType) {
      return instanceEb(
        nodeFactory.tupleExpression({
          items: zipStrict(this[StaticIterator](), ptype.items).map(([item, itemType]) => item.resolveToPType(itemType).resolve()),
          sourceLocation: this.sourceLocation,
        }),
        ptype,
      )
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

  indexAccess(index: InstanceBuilder, sourceLocation: SourceLocation): NodeBuilder {
    const indexNum = requireIntegerConstant(index).value
    const itemType = this.ptype.items[Number(indexNum)]
    codeInvariant(
      indexNum < this.ptype.items.length && indexNum >= 0,
      "Index arg must be a numeric literal between 0 and the tuple's length",
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
    return this.ptype.items.map((itemType, index) =>
      instanceEb(
        nodeFactory.tupleItemExpression({
          index: BigInt(index),
          sourceLocation: this.sourceLocation,
          base: this._expr,
        }),
        itemType,
      ),
    )
  }
}
