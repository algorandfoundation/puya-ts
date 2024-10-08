import type { Expression, LValue } from '../../awst/nodes'
import { CodeError } from '../../errors'
import { invariant } from '../../util'
import type { PType } from '../ptypes'
import { ArrayPType } from '../ptypes'
import { InstanceExpressionBuilder } from './index'

export class NativeArrayExpressionBuilder extends InstanceExpressionBuilder<ArrayPType> {
  resolveLValue(): LValue {
    throw new CodeError(this.ptype.typeMessage, { sourceLocation: this.sourceLocation })
  }

  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof ArrayPType, 'ptype must be instance of ArrayPType')
    super(expr, ptype)
  }
}
