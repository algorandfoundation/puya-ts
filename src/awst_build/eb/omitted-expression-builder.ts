import type { Expression, LValue } from '../../awst/nodes'
import type { PType } from '../ptypes'
import { anyPType } from '../ptypes'
import { InstanceBuilder } from './index'
import { CodeError, InternalError } from '../../errors'
import type { SourceLocation } from '../../awst/source-location'

export class OmittedExpressionBuilder extends InstanceBuilder {
  get ptype(): PType {
    return anyPType
  }
  resolve(): Expression {
    throw new CodeError('Omitted expression cannot be resolved', { sourceLocation: this.sourceLocation })
  }
  resolveLValue(): LValue {
    throw new InternalError('Omitted expression cannot be resolved to an lvalue', { sourceLocation: this.sourceLocation })
  }

  resolvableToPType(ptype: PType, sourceLocation: SourceLocation): boolean {
    throw new InternalError('Omitted expression cannot be resolved to any type', { sourceLocation: this.sourceLocation })
  }
}
