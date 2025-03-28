import type { SourceLocation } from './awst/source-location'
import type { PType, PTypeOrClass } from './awst_build/ptypes'

type PuyaErrorOptions = {
  cause?: Error
  sourceLocation?: SourceLocation
}

export class PuyaError extends Error {
  readonly sourceLocation: SourceLocation | undefined
  constructor(message?: string, options?: PuyaErrorOptions) {
    super(message, options)
    this.sourceLocation = options?.sourceLocation
  }
}

/**
 * Any error that is 'caused' by a user of Puya
 */
export abstract class UserError extends PuyaError {}

/**
 * Thrown when the user's code is invalid, or not supported
 */
export class CodeError extends UserError {
  static unexpectedUnhandledArgs({ sourceLocation }: { sourceLocation: SourceLocation }) {
    return new CodeError('Unexpected/unhandled args', {
      sourceLocation,
    })
  }
  static unexpectedTypeArgs({ sourceLocation }: { sourceLocation: SourceLocation }) {
    return new CodeError('Function does not accept type arguments', {
      sourceLocation,
    })
  }
  static expectedCompileTimeConstant({ sourceLocation }: { sourceLocation: SourceLocation }) {
    return new CodeError('Expected compile time constant', {
      sourceLocation,
    })
  }
  static invalidAssignmentTarget({ sourceLocation, name }: { sourceLocation: SourceLocation; name: string }) {
    return new CodeError(`${name} is not a valid assignment target`, {
      sourceLocation,
    })
  }
  static cannotResolveToType({
    sourceType,
    targetType,
    sourceLocation,
  }: {
    sourceLocation: SourceLocation
    sourceType: PType
    targetType: PTypeOrClass
  }) {
    const targetName = targetType instanceof Function ? targetType.name : targetType.fullName
    return new CodeError(`Cannot resolve ${sourceType} to ${targetName}`, { sourceLocation })
  }
}

/**
 * Thrown when the compiler ends up in an unrecoverable state
 */
export class InternalError extends PuyaError {
  static shouldBeUnreachable() {
    return new InternalError('Code should be unreachable')
  }
}
export class NotSupported extends CodeError {
  constructor(featureName: string, options?: PuyaErrorOptions) {
    super(`Not Supported: ${featureName}`, options)
  }
}

/**
 * Thrown when the user's environment is not set up correctly
 */
export class EnvironmentError extends UserError {}

export const throwError = (error: Error): never => {
  throw error
}
export const wrapInCodeError = <T>(func: () => T, sourceLocation: SourceLocation) => {
  try {
    return func()
  } catch (e) {
    if (e instanceof Error) {
      throw new CodeError(e.message, { sourceLocation, cause: e })
    } else {
      throw new CodeError(String(e), { sourceLocation })
    }
  }
}

export class NotSupportedForEach extends CodeError {
  constructor(options?: PuyaErrorOptions) {
    super(`Not Supported: forEach, with code actions`, options)
  }
}
