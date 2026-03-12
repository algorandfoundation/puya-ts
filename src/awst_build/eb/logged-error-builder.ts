import type ts from 'typescript'
import { intrinsicFactory } from '../../awst/intrinsic-factory'
import type { SourceLocation } from '../../awst/source-location'
import { logger } from '../../logger'
import type { PType } from '../ptypes'
import { stringPType } from '../ptypes'
import type { InstanceBuilder, NodeBuilder } from './index'
import { FunctionBuilder } from './index'
import { requireStringConstant } from './util'
import { parseFunctionArgs } from './util/arg-parsing'
import { VoidExpressionBuilder } from './void-expression-builder'

const VALID_PREFIXES = new Set(['ERR', 'AER'])

function resolveErrorMessage(
  code: InstanceBuilder,
  message: InstanceBuilder | undefined,
  prefix: InstanceBuilder | undefined,
  sourceLocation: SourceLocation,
): string {
  const codeStr = requireStringConstant(code).value

  if (codeStr.includes(':')) {
    logger.error(code.sourceLocation, "error code must not contain domain separator ':'")
  }

  let messageStr: string | undefined
  if (message) {
    messageStr = requireStringConstant(message).value
    if (messageStr.includes(':')) {
      logger.error(message.sourceLocation, "error message must not contain domain separator ':'")
    }
  }

  let prefixStr = 'ERR'
  if (prefix) {
    prefixStr = requireStringConstant(prefix).value
    if (!VALID_PREFIXES.has(prefixStr)) {
      logger.error(prefix.sourceLocation, 'error prefix must be one of AER, ERR')
    }
  }

  return messageStr ? `${prefixStr}:${codeStr}:${messageStr}` : `${prefixStr}:${codeStr}`
}

/**
 * Handling of overloaded functions. The resulting patterns are:
 *   (code), when args is empty
 *   (code, message), when len(args) is 1 and it is a non-prefix value
 *   (code, prefix), when len(args) is 1 and the value is 'ERR' or 'AER'
 *   (code, message, prefix) when len(args) is 2
 */
function resolveMessageAndPrefix(
  args: ReadonlyArray<InstanceBuilder | undefined>,
): { message: InstanceBuilder | undefined; prefix: InstanceBuilder | undefined } {
  const [first, second] = args
  if (first && second) {
    return { message: first, prefix: second }
  }
  if (first) {
    const value = requireStringConstant(first).value
    if (VALID_PREFIXES.has(value)) {
      return { message: undefined, prefix: first }
    }
    return { message: first, prefix: undefined }
  }
  return { message: undefined, prefix: undefined }
}

export class LoggedAssertFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
    const {
      args: [condition, code, messageOrPrefix, maybePrefix],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: 'loggedAssert',
      argSpec: (a) => [a.passthrough(), a.required(stringPType), a.optional(stringPType), a.optional(stringPType)],
    })

    const { message, prefix } = resolveMessageAndPrefix([messageOrPrefix, maybePrefix])
    const errorMessage = resolveErrorMessage(code, message, prefix, sourceLocation)

    return new VoidExpressionBuilder(
      intrinsicFactory.assert({
        sourceLocation,
        condition: condition!.boolEval(sourceLocation),
        comment: errorMessage,
        logError: true,
      }),
    )
  }
}

export class LoggedErrFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
    const {
      args: [code, messageOrPrefix, maybePrefix],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: 'loggedErr',
      argSpec: (a) => [a.required(stringPType), a.optional(stringPType), a.optional(stringPType)],
    })

    const { message, prefix } = resolveMessageAndPrefix([messageOrPrefix, maybePrefix])
    const errorMessage = resolveErrorMessage(code, message, prefix, sourceLocation)

    return new VoidExpressionBuilder(
      intrinsicFactory.err({
        sourceLocation,
        comment: errorMessage,
        logError: true,
      }),
    )
  }
}
