import { biguint, BigUintCompat, BytesCompat, StringCompat, uint64, Uint64Compat } from './primitives'
import { ctxMgr } from './execution-context'

export function log(...args: Array<Uint64Compat | BytesCompat | BigUintCompat | StringCompat>): void {
  ctxMgr.instance.log(...args)
}

export function assert(condition: unknown, message?: string): asserts condition {
  return ctxMgr.instance.assert(condition, message)
}
export function err(message?: string): never {
  return ctxMgr.instance.err(message)
}

type NumericComparison<T> = T | { lessThan: T } | { greaterThan: T } | { greaterThanEq: T } | { lessThanEq: T } | { between: [T, T] }

type ComparisonFor<T> = T extends uint64 | biguint ? NumericComparison<T> : T

type MatchTest<T> = {
  [key in keyof T]?: ComparisonFor<T[key]>
}

export function match<T>(subject: T, test: MatchTest<T>): boolean {
  return true
}
export function assertMatch<T>(subject: T, test: MatchTest<T>, message?: string): boolean {
  return true
}

export enum OpUpFeeSource {
  GroupCredit = 0,
  AppAccount = 1,
  Any = 2,
}

export function ensureBudget(budget: uint64, feeSource: OpUpFeeSource = OpUpFeeSource.GroupCredit) {
  throw new Error('Not implemented')
}

export function urange(stop: Uint64Compat): IterableIterator<uint64>
export function urange(start: Uint64Compat, stop: Uint64Compat): IterableIterator<uint64>
export function urange(start: Uint64Compat, stop: Uint64Compat, step: Uint64Compat): IterableIterator<uint64>
export function urange(a: Uint64Compat, b?: Uint64Compat, c?: Uint64Compat): IterableIterator<uint64> {
  throw new Error('Not implemented')
}
