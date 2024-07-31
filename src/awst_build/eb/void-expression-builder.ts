import { InstanceExpressionBuilder } from './index'
import { voidPType } from '../ptypes'
import { Expression, LValue } from '../../awst/nodes'
import { CodeError } from '../../errors'
import { InstanceType } from '../ptypes/ptype-classes'

export class VoidExpressionBuilder extends InstanceExpressionBuilder<InstanceType> {
  constructor(expr: Expression) {
    super(expr, voidPType)
  }
  resolveLValue(): LValue {
    throw new CodeError(`${this.typeDescription} is not a valid assignment target`)
  }
}
