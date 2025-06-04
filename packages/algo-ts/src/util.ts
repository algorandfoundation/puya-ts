import { NoImplementation } from './internal/errors'
import { biguint, BigUintCompat, BytesBacked, BytesCompat, StringCompat, uint64, Uint64Compat } from './primitives'

/**
 * Write one or more values to the transaction log.
 *
 * Each value is converted to bytes and concatenated
 * @param args The values to write
 */
export function log(...args: Array<Uint64Compat | BytesCompat | BigUintCompat | StringCompat | BytesBacked>): void {
  throw new NoImplementation()
}

/**
 * Asserts that `condition` is truthy, otherwise error and halt execution.
 * @param condition An expression that can be evaluated as truthy of falsy
 * @param message The message to show if `condition` is falsy and an error is raised.
 */
export function assert(condition: unknown, message?: string): asserts condition {
  throw new NoImplementation()
}

/**
 * Raise an error and halt execution
 * @param message The message to accompany the error
 */
export function err(message?: string): never {
  throw new NoImplementation()
}

/**
 * Defines possible comparison expressions for numeric types
 */
type NumericComparison<T> =
  | T
  | {
      /**
       * Is the subject less than the specified value
       */
      lessThan: T
    }
  | {
      /**
       * Is the subject greater than the specified value
       */
      greaterThan: T
    }
  | {
      /**
       * Is the subject greater than or equal to the specified value
       */
      greaterThanEq: T
    }
  | {
      /**
       * Is the subject less than or equal to the specified value
       */
      lessThanEq: T
    }
  | {
      /**
       * Is the subject between the specified values (inclusive)
       */
      between: [T, T]
    }
  | {
      /**
       * Is the subject not equal to the specified value
       */
      not: T
    }

/**
 * Defines possible comparison expressions for non-numeric types
 */
type NonNumericComparison<T> =
  | T
  | {
      /**
       * Is the subject not equal to the specified value
       */
      not: T
    }

/**
 * Returns compatible comparison expressions for a type `T`
 * @typeParam T The type requiring comparison
 */
type ComparisonFor<T> = T extends uint64 | biguint ? NumericComparison<T> : NonNumericComparison<T>

/**
 * A set of tests to apply to the match subject
 * @typeParam T The type of the test subject
 */
type MatchTest<T> = {
  [key in keyof T]?: ComparisonFor<T[key]>
}

/**
 * Applies all tests in `test` against `subject` and returns a boolean indicating if they all pass
 * @param subject An object or tuple to be tested
 * @param test An object containing one or more tests to be applied to the subject
 * @typeParam T The type of the subject
 * @returns True if all tests pass, otherwise false
 */
export function match<T>(subject: T, test: MatchTest<T>): boolean {
  throw new NoImplementation()
}

/**
 *
 * Applies all tests in `test` against `subject` and asserts they all pass
 * @param subject An object or tuple to be tested
 * @param test An object containing one or more tests to be applied to the subject
 * @param message An optional message to show if the assertion fails
 * @typeParam T The type of the subject
 */
export function assertMatch<T>(subject: T, test: MatchTest<T>, message?: string): boolean {
  throw new NoImplementation()
}

/**
 * Defines the source of fees for the OpUp utility
 */
export enum OpUpFeeSource {
  /**
   * Only the excess fee (credit) on the outer group should be used (itxn.fee = 0)
   */
  GroupCredit = 0,
  /**
   * The app's account will cover all fees (itxn.fee = Global.minTxFee)
   */
  AppAccount = 1,
  /**
   * First the excess will be used, then remaining fees taken from the app account
   */
  Any = 2,
}

/**
 * Ensure the available op code budget is greater than or equal to requiredBudget.
 *
 * This is done by adding AppCall itxns to the group to increase the available budget. These itxns must be paid for
 * by the caller or the application.
 * @param requiredBudget The total required budget
 * @param feeSource Which source to withdraw txn fees from.
 */
export function ensureBudget(requiredBudget: uint64, feeSource: OpUpFeeSource = OpUpFeeSource.GroupCredit) {
  throw new NoImplementation()
}

/**
 * Generates an iterable sequence from 0...stop inclusive
 * @param stop The stop number of the sequence
 */
export function urange(stop: Uint64Compat): IterableIterator<uint64>
/**
 * Generates an iterable sequence from start...stop inclusive
 * @param start The start number of the sequence
 * @param stop The stop number of the sequence
 */
export function urange(start: Uint64Compat, stop: Uint64Compat): IterableIterator<uint64>
/**
 * Generates an iterable sequence from start...stop inclusive with increments of size step
 * @param start The start number of the sequence
 * @param stop The stop number of the sequence
 * @param step The step size of the sequence
 */
export function urange(start: Uint64Compat, stop: Uint64Compat, step: Uint64Compat): IterableIterator<uint64>
export function urange(a: Uint64Compat, b?: Uint64Compat, c?: Uint64Compat): IterableIterator<uint64> {
  throw new NoImplementation()
}

/**
 * Defines a numeric range including all numbers between from and to
 */
export type NumberRange = { from: number; to: number }

/**
 * Creates a deep copy of the specified value
 * @param value The value to clone
 */
export function clone<T>(value: T): T {
  throw new NoImplementation()
}
