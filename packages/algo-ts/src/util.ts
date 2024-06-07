import { BigUintCompat, BytesCompat, Uint64Compat } from './primitives'
import { ctxMgr } from './execution-context'

export function log(...args: Array<Uint64Compat | BytesCompat | BigUintCompat>): void {
  ctxMgr.instance.log(...args)
}

export function assert(condition: unknown, message?: string): asserts condition {
  return ctxMgr.instance.assert(condition, message)
}
export function err(message?: string): never {
  return ctxMgr.instance.err(message)
}
