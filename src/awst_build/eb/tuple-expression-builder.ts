import type { PType } from '../ptypes'
import { TuplePType } from '../ptypes'
import type { InstanceBuilder, NodeBuilder } from './index'
import { InstanceExpressionBuilder } from './index'
import { invariant } from '../../util'
import type { Expression } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { instanceEb } from '../type-registry'
import { nodeFactory } from '../../awst/node-factory'
import { requireIntegerConstant } from './util'

export class TupleExpressionBuilder extends InstanceExpressionBuilder<TuplePType> {
  constructor(expression: Expression, ptype: PType) {
    invariant(ptype instanceof TuplePType, 'TupleExpressionBuilder must be built with ptype of type TuplePType')
    super(expression, ptype)
  }

  iterate(): Expression {
    return this.resolve()
  }

  indexAccess(index: InstanceBuilder, sourceLocation: SourceLocation): NodeBuilder {
    const indexNum = requireIntegerConstant(index, sourceLocation).value
    const itemType = this.ptype.items[Number(indexNum)]

    return instanceEb(
      nodeFactory.tupleItemExpression({
        index: indexNum,
        sourceLocation,
        base: this._expr,
        wtype: itemType.wtypeOrThrow,
      }),
      itemType,
    )
  }
}
