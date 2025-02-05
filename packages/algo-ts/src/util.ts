import { NoImplementation } from './internal/errors'
import { biguint, BigUintCompat, BytesBacked, BytesCompat, StringCompat, uint64, Uint64Compat } from './primitives'

export function log(...args: Array<Uint64Compat | BytesCompat | BigUintCompat | StringCompat | BytesBacked>): void {
  throw new NoImplementation()
}

export function assert(condition: unknown, message?: string): asserts condition {
  throw new NoImplementation()
}

export function err(message?: string): never {
  throw new NoImplementation()
}

type NumericComparison<T> = T | { lessThan: T } | { greaterThan: T } | { greaterThanEq: T } | { lessThanEq: T } | { between: [T, T] }

type ComparisonFor<T> = T extends uint64 | biguint ? NumericComparison<T> : T

type MatchTest<T> = {
  [key in keyof T]?: ComparisonFor<T[key]>
}

export function match<T>(subject: T, test: MatchTest<T>): boolean {
  throw new NoImplementation()
}
export function assertMatch<T>(subject: T, test: MatchTest<T>, message?: string): boolean {
  throw new NoImplementation()
}

export enum OpUpFeeSource {
  GroupCredit = 0,
  AppAccount = 1,
  Any = 2,
}

export function ensureBudget(budget: uint64, feeSource: OpUpFeeSource = OpUpFeeSource.GroupCredit) {
  throw new NoImplementation()
}

export function urange(stop: Uint64Compat): IterableIterator<uint64>
export function urange(start: Uint64Compat, stop: Uint64Compat): IterableIterator<uint64>
export function urange(start: Uint64Compat, stop: Uint64Compat, step: Uint64Compat): IterableIterator<uint64>
export function urange(a: Uint64Compat, b?: Uint64Compat, c?: Uint64Compat): IterableIterator<uint64> {
  throw new NoImplementation()
}

/**
 * Defines a numeric range including all numbers between from and to
 */
export type NumberRange = { from: number; to: number }
