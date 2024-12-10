import type { Expression, LValue } from '../../awst/nodes'
import { CodeError } from '../../errors'
import { invariant } from '../../util'
import type { PType } from '../ptypes'
import { InstanceType, neverPType } from '../ptypes'
import { InstanceExpressionBuilder } from './index'

export class NeverExpressionBuilder extends InstanceExpressionBuilder<InstanceType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof InstanceType && ptype.equals(neverPType), 'ptype must be neverPType')
    super(expr, neverPType)
  }

  resolve(): Expression {
    throw new CodeError('Cannot resolve expression of type never', { sourceLocation: this.sourceLocation })
  }

  resolveLValue(): LValue {
    throw new CodeError('Expression of type never is not a valid assignment target', { sourceLocation: this.sourceLocation })
  }
}
