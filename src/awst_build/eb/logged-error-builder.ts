import type ts from 'typescript'
import { intrinsicFactory } from '../../awst/intrinsic-factory'
import type { SourceLocation } from '../../awst/source-location'
import { logger } from '../../logger'
import type { PType } from '../ptypes'
import { stringPType } from '../ptypes'
import type { InstanceBuilder, NodeBuilder } from './index'
import { FunctionBuilder } from './index'
import { requireInstanceBuilder, requireStringConstant } from './util'
import { parseFunctionArgs } from './util/arg-parsing'
import { VoidExpressionBuilder } from './void-expression-builder'

const VALID_PREFIXES = new Set(['ERR', 'AER'])

function resolveErrorMessage(code: InstanceBuilder, message: InstanceBuilder | undefined, prefix: InstanceBuilder | undefined): string {
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
 * Possible patterns are:
 * - `undefined`: No argument was given.
 * - {}: Empty options.
 * - { message: string }: Message was provided.
 * - { prefix: string }: Prefix was provided.
 * - { message: string, prefix: string }: Both message and prefix were provided.
 */
function resolveMessageAndPrefix(options: InstanceBuilder | undefined): {
  message: InstanceBuilder | undefined
  prefix: InstanceBuilder | undefined
} {
  function get(field: string) {
    return options?.hasProperty(field) ? requireInstanceBuilder(options.memberAccess(field, options.sourceLocation)) : undefined
  }

  const message = get('message')
  const prefix = get('prefix')
  return { message: message, prefix: prefix }
}

export class LoggedAssertFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation<ts.CallExpression>): NodeBuilder {
    const {
      args: [condition, code, maybeOptions],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: 'loggedAssert',
      argSpec: (a) => [a.passthrough(), a.required(stringPType), a.optional()],
    })

    const { message, prefix } = resolveMessageAndPrefix(maybeOptions)
    const errorMessage = resolveErrorMessage(code, message, prefix)

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
      args: [code, maybeOptions],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: 'loggedErr',
      argSpec: (a) => [a.required(stringPType), a.optional()],
    })

    const { message, prefix } = resolveMessageAndPrefix(maybeOptions)
    const errorMessage = resolveErrorMessage(code, message, prefix)

    return new VoidExpressionBuilder(
      intrinsicFactory.err({
        sourceLocation,
        comment: errorMessage,
        logError: true,
      }),
    )
  }
}
