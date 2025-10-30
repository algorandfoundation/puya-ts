import type { Expression, LValue } from '../../awst/nodes'
import { CodeError, InternalError } from '../../errors'
import type { PType, PTypeOrClass } from '../ptypes'
import { anyPType } from '../ptypes'
import { InstanceBuilder } from './index'

export class OmittedExpressionBuilder extends InstanceBuilder {
  readonly isConstant = false

  get ptype(): PType {
    return anyPType
  }
  resolve(): Expression {
    throw new CodeError('Omitted expression cannot be resolved', { sourceLocation: this.sourceLocation })
  }
  resolveLValue(): LValue {
    throw new InternalError('Omitted expression cannot be resolved to an lvalue', { sourceLocation: this.sourceLocation })
  }

  resolvableToPType(ptype: PTypeOrClass): boolean {
    throw new InternalError('Omitted expression cannot be resolved to any type', { sourceLocation: this.sourceLocation })
  }
}
