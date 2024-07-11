import { awst } from '../../awst'
import { InstanceExpressionBuilder } from './index'
import * as ptypes from '../ptypes'

export class BoolExpressionBuilder extends InstanceExpressionBuilder {
  get ptype(): ptypes.PType {
    return ptypes.boolPType
  }

  boolEval(): awst.Expression {
    return this._expr
  }
}
