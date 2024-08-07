import type { Expression, LValue } from '../../awst/nodes'
import type { PType } from '../ptypes'
import { anyPType } from '../ptypes'
import { InstanceBuilder } from './index'
import { CodeError } from '../../errors'

export class OmittedExpressionBuilder extends InstanceBuilder {
  get ptype(): PType {
    return anyPType
  }
  resolve(): Expression {
    throw new CodeError('Omitted expression cannot be resolved', { sourceLocation: this.sourceLocation })
  }
  resolveLValue(): LValue {
    throw new CodeError('Omitted expression is not a valid lvalue', { sourceLocation: this.sourceLocation })
  }
}
