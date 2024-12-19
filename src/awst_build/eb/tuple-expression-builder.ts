import { nodeFactory } from '../../awst/node-factory'
import type { Expression } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { codeInvariant, invariant } from '../../util'
import type { PType } from '../ptypes'
import { TuplePType, uint64PType } from '../ptypes'
import { instanceEb } from '../type-registry'
import type { InstanceBuilder, NodeBuilder } from './index'
import { InstanceExpressionBuilder } from './index'
import { requireIntegerConstant } from './util'

export class TupleExpressionBuilder extends InstanceExpressionBuilder<TuplePType> {
  constructor(expression: Expression, ptype: PType) {
    invariant(ptype instanceof TuplePType, 'TupleExpressionBuilder must be built with ptype of type TuplePType')
    super(expression, ptype)
  }

  iterate(): Expression {
    return this.resolve()
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

  getItemBuilders(): InstanceBuilder[] {
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
