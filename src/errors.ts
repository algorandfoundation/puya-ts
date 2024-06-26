import { SourceLocation } from './awst/source-location'

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

export class CodeError extends PuyaError {
  static unexpectedUnhandledArgs({ sourceLocation }: { sourceLocation: SourceLocation }) {
    return new CodeError('Unexpected/unhandled args', {
      sourceLocation,
    })
  }
  static invalidAssignmentTarget({ sourceLocation, name }: { sourceLocation: SourceLocation; name: string }) {
    return new CodeError(`${name} is not a valid assignment target`, {
      sourceLocation,
    })
  }
}
export class TodoError extends PuyaError {}
export class InternalError extends PuyaError {}
export class NotSupported extends CodeError {
  constructor(featureName: string, options?: PuyaErrorOptions) {
    super(`${featureName} are not supported`, options)
  }
}

export const throwError = (error: Error): never => {
  throw error
}
