import type { InstanceBuilder } from './index'
import { FunctionBuilder } from './index'
import type { SourceLocation } from '../../awst/source-location'
import { VoidExpressionBuilder } from './void-expression-builder'
import { nodeFactory } from '../../awst/node-factory'
import { wtypes } from '../../awst'
import { CodeError } from '../../errors'
import type { PType } from '../ptypes'
import { stringPType } from '../ptypes'
import { requireConstantOfType } from './util'
import { invariant } from '../../util'
import { StringConstant } from '../../awst/nodes'

export class AssertFunctionBuilder extends FunctionBuilder {
  call(args: Array<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const [condition, message, ...rest] = args
    if (rest.length !== 0) {
      throw CodeError.unexpectedUnhandledArgs({ sourceLocation })
    }

    if (condition === undefined) {
      throw new CodeError('Missing required argument: condition', { sourceLocation })
    }
    let messageStr: string | null = null
    if (message) {
      const messageConst = requireConstantOfType(message, stringPType)
      invariant(messageConst instanceof StringConstant, 'messageConst must be StringConst')
      messageStr = messageConst.value
    }

    return new VoidExpressionBuilder(
      nodeFactory.intrinsicCall({
        opCode: 'assert',
        sourceLocation: sourceLocation,
        stackArgs: [condition.boolEval(sourceLocation)],
        immediates: [],
        wtype: wtypes.voidWType,
        comment: messageStr,
      }),
    )
  }
}

export class ErrFunctionBuilder extends FunctionBuilder {
  call(args: Array<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const [message, ...rest] = args
    if (rest.length !== 0) {
      throw CodeError.unexpectedUnhandledArgs({ sourceLocation })
    }

    let messageStr: string | null = null
    if (message) {
      const messageConst = requireConstantOfType(message, stringPType)
      invariant(messageConst instanceof StringConstant, 'messageConst must be StringConst')
      messageStr = messageConst.value
    }
    return new VoidExpressionBuilder(
      nodeFactory.intrinsicCall({
        opCode: 'err',
        sourceLocation: sourceLocation,
        stackArgs: [],
        immediates: [],
        wtype: wtypes.voidWType,
        comment: messageStr,
      }),
    )
  }
}
