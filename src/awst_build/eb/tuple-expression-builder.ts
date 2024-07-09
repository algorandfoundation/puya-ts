import { PType, TuplePType } from '../ptypes'
import { InstanceExpressionBuilder } from './index'
import { invariant } from '../../util'
import { Expression } from '../../awst/nodes'

export class TupleExpressionBuilder extends InstanceExpressionBuilder {
  private _ptype: TuplePType
  constructor(expression: Expression, ptype: PType) {
    super(expression)
    invariant(ptype instanceof TuplePType, 'TupleExpressionBuilder must be built with ptype of type TuplePType')
    this._ptype = ptype
  }

  get ptype(): PType {
    return this._ptype
  }

  iterate(): Expression {
    return this.resolve()
  }
}
