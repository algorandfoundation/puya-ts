import { intrinsicFactory } from '../../awst/intrinsic-factory'
import { StringConstant } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { CodeError } from '../../errors'
import { invariant } from '../../util'
import type { PType } from '../ptypes'
import { stringPType } from '../ptypes'
import type { NodeBuilder } from './index'
import { FunctionBuilder } from './index'
import { requireConstantOfType, requireStringConstant } from './util'
import { parseFunctionArgs } from './util/arg-parsing'
import { VoidExpressionBuilder } from './void-expression-builder'

export class AssertFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
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
      intrinsicFactory.assert({
        sourceLocation,
        condition: condition.boolEval(sourceLocation),
        comment: messageStr,
      }),
    )
  }
}

export class ErrFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [message],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      argSpec: (a) => [a.optional(stringPType)],
      funcName: 'err',
    })

    return new VoidExpressionBuilder(
      intrinsicFactory.err({
        sourceLocation,
        comment: message ? requireStringConstant(message).value : null,
      }),
    )
  }
}
