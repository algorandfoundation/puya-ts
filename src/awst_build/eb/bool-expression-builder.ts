import { awst, wtypes } from '../../awst'
import { ValueExpressionBuilder } from './index'
import { SourceLocation } from '../../awst/source-location'
import { nodeFactory } from '../../awst/node-factory'

export class BoolExpressionBuilder extends ValueExpressionBuilder {
  get wtype(): wtypes.WType {
    return wtypes.boolWType
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
