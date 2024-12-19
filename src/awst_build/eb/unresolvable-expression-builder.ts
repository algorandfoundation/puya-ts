import type { Expression, LValue } from '../../awst/nodes'
import { CodeError } from '../../errors'
import type { PType } from '../ptypes'
import { InstanceExpressionBuilder } from './index'

export class UnresolvableExpressionBuilder extends InstanceExpressionBuilder<PType> {
  resolve(): Expression {
    throw new CodeError(`Cannot resolve expression of type ${this.typeDescription}`, { sourceLocation: this.sourceLocation })
  }

  resolveLValue(): LValue {
    throw new CodeError(`Expression of type ${this.typeDescription} is not a valid assignment target`, {
      sourceLocation: this.sourceLocation,
    })
  }
}
