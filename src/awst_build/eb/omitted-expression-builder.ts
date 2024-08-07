import type { Expression, LValue } from '../../awst/nodes'
import type { PType } from '../ptypes'
import { anyPType } from '../ptypes'
import { InstanceBuilder } from './index'
import { CodeError, InternalError } from '../../errors'
import { nodeFactory } from '../../awst/node-factory'
import type { SourceLocation } from '../../awst/source-location'
import { instanceEb } from '../type-registry'

export class OmittedExpressionBuilder extends InstanceBuilder {
  #uniqueName: string
  constructor(uniqueName: string, sourceLocation: SourceLocation) {
    super(sourceLocation)
    this.#uniqueName = uniqueName
  }
  get ptype(): PType {
    return anyPType
  }
  resolve(): Expression {
    throw new CodeError('Omitted expression cannot be resolved', { sourceLocation: this.sourceLocation })
  }
  resolveLValue(): LValue {
    throw new InternalError('Omitted expression cannot be resolved to an lvalue without narrowing its type')
  }

  resolvableToPType(ptype: PType, sourceLocation: SourceLocation): boolean {
    return true
  }

  resolveToPType(ptype: PType, sourceLocation: SourceLocation): InstanceBuilder {
    return instanceEb(
      nodeFactory.varExpression({
        sourceLocation: this.sourceLocation,
        name: this.#uniqueName,
        wtype: ptype.wtypeOrThrow,
      }),
      ptype,
    )
  }
}
