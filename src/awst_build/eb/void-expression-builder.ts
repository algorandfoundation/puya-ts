import { InstanceExpressionBuilder } from './index'
import { voidPType } from '../ptypes'
import { Expression, LValue } from '../../awst/nodes'
import { CodeError } from '../../errors'

export class VoidExpressionBuilder extends InstanceExpressionBuilder {
  resolve(): Expression {
    return this._expr
  }
  resolveLValue(): LValue {
    throw new CodeError(`${this.typeDescription} is not a valid assignment target`)
  }
  get ptype() {
    return voidPType
  }
}
