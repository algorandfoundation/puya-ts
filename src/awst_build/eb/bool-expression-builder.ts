import { awst } from '../../awst'
import { InstanceExpressionBuilder } from './index'
import * as ptypes from '../ptypes'
import { SourceLocation } from '../../awst/source-location'
import { Expression } from '../../awst/nodes'
import { intrinsicFactory } from '../../awst/intrinsic-factory'

export class BoolExpressionBuilder extends InstanceExpressionBuilder {
  get ptype(): ptypes.PType {
    return ptypes.boolPType
  }

  boolEval(): awst.Expression {
    return this._expr
  }

  toBytes(sourceLocation: SourceLocation): Expression {
    return intrinsicFactory.itob({
      value: this._expr,
      sourceLocation,
    })
  }
}
