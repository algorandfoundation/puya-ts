import type { PType } from '../ptypes'
import { TuplePType } from '../ptypes'
import { InstanceExpressionBuilder } from './index'
import { invariant } from '../../util'
import type { Expression } from '../../awst/nodes'

export class TupleExpressionBuilder extends InstanceExpressionBuilder<TuplePType> {
  constructor(expression: Expression, ptype: PType) {
    invariant(ptype instanceof TuplePType, 'TupleExpressionBuilder must be built with ptype of type TuplePType')
    super(expression, ptype)
  }

  iterate(): Expression {
    return this.resolve()
  }
}
