import type { Expression, LValue } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { CodeError } from '../../errors'
import { invariant } from '../../util'
import { LogicSigPType, type PType } from '../ptypes'
import { InstanceBuilder, type NodeBuilder } from './index'

export class LogicSigClassBuilder extends InstanceBuilder {
  resolve(): Expression {
    throw new CodeError('LogicSig class cannot be used as a value')
  }
  resolveLValue(): LValue {
    throw new CodeError('LogicSig class cannot be used as a value')
  }
  readonly ptype: LogicSigPType
  constructor(sourceLocation: SourceLocation, ptype: PType) {
    super(sourceLocation)
    invariant(ptype instanceof LogicSigPType, 'ptype must be LogicSigPType')
    this.ptype = ptype
  }

  newCall(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    throw new CodeError('LogicSig class cannot be constructed manually')
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    throw new CodeError('LogicSig class cannot be called manually')
  }
}
