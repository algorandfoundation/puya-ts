import { InstanceExpressionBuilder } from './index'
import type { PType } from '../ptypes'
import { ArrayPType } from '../ptypes'
import type { Expression, LValue } from '../../awst/nodes'
import { invariant } from '../../util'
import { CodeError } from '../../errors'

export class NativeArrayExpressionBuilder extends InstanceExpressionBuilder<ArrayPType> {
  resolveLValue(): LValue {
    throw new CodeError(ArrayPType.typeError, { sourceLocation: this.sourceLocation })
  }

  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof ArrayPType, 'ptype must be instance of ArrayPType')
    super(expr, ptype)
  }
}
