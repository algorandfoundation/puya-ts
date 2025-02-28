import type { Expression, LValue } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { CodeError } from '../../errors'
import { invariant } from '../../util'
import { logicSigOptionsDecorator, LogicSigPType, numberPType, type PType, stringPType } from '../ptypes'
import { DecoratorDataBuilder, FunctionBuilder, InstanceBuilder, type NodeBuilder } from './index'
import { requireStringConstant } from './util'
import { parseFunctionArgs } from './util/arg-parsing'
import { requireAvmVersion } from './util/avm-version'
import { processScratchRanges } from './util/scratch-slots'

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

export class LogicSigOptionsDecoratorBuilder extends FunctionBuilder {
  readonly ptype = logicSigOptionsDecorator

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [{ avmVersion, name, scratchSlots }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: this.typeDescription,
      argSpec: (a) => [
        a.obj({
          avmVersion: a.optional(numberPType),
          name: a.optional(stringPType),
          scratchSlots: a.optional(),
        }),
      ],
    })

    return new DecoratorDataBuilder(sourceLocation, {
      type: 'logicsig',
      avmVersion: avmVersion ? requireAvmVersion(avmVersion) : undefined,
      name: name ? requireStringConstant(name).value : undefined,
      sourceLocation,
      scratchSlots: scratchSlots && processScratchRanges(scratchSlots),
    })
  }
}
