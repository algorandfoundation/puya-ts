import { awst, wtypes } from '../../awst'
import { InstanceExpressionBuilder } from './index'
import { SourceLocation } from '../../awst/source-location'
import { nodeFactory } from '../../awst/node-factory'
import * as ptypes from '../ptypes'

export class BoolExpressionBuilder extends InstanceExpressionBuilder {
  get ptype(): ptypes.PType {
    return ptypes.boolPType
  }

  boolEval(sourceLocation: SourceLocation, negate: boolean): awst.Expression {
    if (negate) {
      return nodeFactory.not({
        expr: this._expr,
        sourceLocation,
        wtype: wtypes.boolWType,
      })
    }
    return this._expr
  }
}
