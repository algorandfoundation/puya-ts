/**
 * Raised when an `err` op is encountered, or when the testing VM is asked to do something that would cause
 * the AVM to fail.
 */
export class AvmError extends Error {
  constructor(message: string) {
    super(message)
  }
}
export function avmError(message: string): never {
  throw new AvmError(message)
}

export function avmInvariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new AvmError(message)
  }
}
/**
 * Raised when an assertion fails
 */
export class AssertError extends AvmError {
  constructor(message: string) {
    super(message)
  }
}

/**
 * Raised when testing code errors
 */
export class InternalError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export function internalError(message: string): never {
  throw new InternalError(message)
}

/**
 * Raised when unsupported user code is encountered
 */
export class CodeError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
  }
}

export function codeError(message: string): never {
  throw new CodeError(message)
}

/**
 * This error can be used in stub implementations that are expected to be overridden
 * by the testing framework
 */
export class NoImplementation extends Error {
  constructor() {
    super('This method is intentionally not implemented')
  }
}
