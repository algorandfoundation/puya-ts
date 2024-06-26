import { FunctionBuilder, InstanceBuilder } from './index'
import { SourceLocation } from '../../awst/source-location'
import { VoidExpressionBuilder } from './void-expression-builder'
import { nodeFactory } from '../../awst/node-factory'
import { wtypes } from '../../awst'
import { CodeError } from '../../errors'
import { requireStringLiteral } from './util'
import { PType } from '../ptypes'

export class AssertFunctionBuilder extends FunctionBuilder {
  call(args: Array<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const [condition, message, ...rest] = args
    if (rest.length !== 0) {
      throw CodeError.unexpectedUnhandledArgs({ sourceLocation })
    }

    if (condition === undefined) {
      throw new CodeError('Missing required argument: condition', { sourceLocation })
    }
    let messageStr: string | undefined
    if (message) {
      messageStr = requireStringLiteral(message, sourceLocation)
    }

    // TODO: This should use an AssertExpression node, but it doesn't exist right now - only AssertStatement, but we can't return a statement
    // from a builder
    return new VoidExpressionBuilder(
      nodeFactory.intrinsicCall({
        opCode: 'assert',
        sourceLocation: sourceLocation,
        stackArgs: [condition.boolEval(sourceLocation, false)],
        immediates: [],
        wtype: wtypes.voidWType,
        comment: messageStr,
      }),
    )
  }
}
