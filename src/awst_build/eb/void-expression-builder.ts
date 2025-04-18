import type { Expression, LValue } from '../../awst/nodes'
import { CodeError } from '../../errors'
import type { InstanceType } from '../ptypes'
import { voidPType } from '../ptypes'
import { InstanceExpressionBuilder } from './index'

export class VoidExpressionBuilder extends InstanceExpressionBuilder<InstanceType> {
  constructor(expr: Expression) {
    super(expr, voidPType)
  }
  resolveLValue(): LValue {
    throw new CodeError(`${this.typeDescription} is not a valid assignment target`)
  }
}
