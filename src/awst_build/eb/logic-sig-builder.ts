import type ts from 'typescript'
import type { Expression, LValue } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { CodeError } from '../../errors'
import { invariant } from '../../util'
import { boolPType, logicSigOptionsDecorator, LogicSigPType, numberPType, type PType, stringPType } from '../ptypes'
import { validateEncodingMap } from './arc4/util'
import { DecoratorDataBuilder, FunctionBuilder, InstanceBuilder, type NodeBuilder } from './index'
import { mapStringConstant, requireBooleanConstant, requireStringConstant } from './util'
import { parseFunctionArgs } from './util/arg-parsing'
import { requireAvmVersion } from './util/avm-version'
import { processScratchRanges } from './util/scratch-slots'

export class LogicSigClassBuilder extends InstanceBuilder {
  readonly isConstant = false

  resolve(): Expression {
    throw new CodeError('LogicSig class cannot be used as a value', { sourceLocation: this.sourceLocation })
  }
  resolveLValue(): LValue {
    throw new CodeError('LogicSig class cannot be used as a value', { sourceLocation: this.sourceLocation })
  }
  readonly ptype: LogicSigPType
  constructor(sourceLocation: SourceLocation, ptype: PType) {
    super(sourceLocation)
    invariant(ptype instanceof LogicSigPType, 'ptype must be LogicSigPType')
    this.ptype = ptype
  }

  newCall(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    throw new CodeError('LogicSig class cannot be constructed manually', { sourceLocation })
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
    throw new CodeError('LogicSig class cannot be called manually', { sourceLocation })
  }
}

export class LogicSigOptionsDecoratorBuilder extends FunctionBuilder {
  readonly ptype = logicSigOptionsDecorator

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
    const {
      args: [{ avmVersion, autosalt, name, scratchSlots, validateEncoding }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: this.typeDescription,
      argSpec: (a) => [
        a.obj({
          avmVersion: a.optional(numberPType),
          autosalt: a.optional(boolPType),
          name: a.optional(stringPType),
          scratchSlots: a.optional(),
          validateEncoding: a.optional(stringPType),
        }),
      ],
    })

    return new DecoratorDataBuilder(sourceLocation, {
      type: 'logicsig',
      avmVersion: avmVersion ? requireAvmVersion(avmVersion) : undefined,
      autosalt: autosalt ? requireBooleanConstant(autosalt).value : undefined,
      name: name ? requireStringConstant(name).value : undefined,
      sourceLocation,
      scratchSlots: scratchSlots && processScratchRanges(scratchSlots),
      validateEncoding: validateEncoding && mapStringConstant(validateEncodingMap, validateEncoding.resolve()),
    })
  }
}
