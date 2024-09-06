import { internal } from '@algorandfoundation/algo-ts'
import { DeliberateAny } from './typescript-helpers'

export const nameOfType = (x: unknown) => {
  if (typeof x === 'object') {
    if (x === null) return 'Null'
    if (x === undefined) return 'undefined'
    if ('constructor' in x) {
      return x.constructor.name
    }
  }
  return typeof x
}

export function* iterBigInt(start: bigint, end: bigint): Generator<bigint> {
  for (let i = start; i < end; i++) {
    yield BigInt(i)
  }
}

export function asBigInt(v: internal.primitives.StubUint64Compat): bigint {
  return internal.primitives.Uint64Cls.fromCompat(v).value
}

export function extractGenericTypeArgs(t: string): string[] {
  const match = t.match(/<(.*)>/)
  if (!match) return []
  return match[1].split(',').map((x) => x.trim())
}

export const asUint64Cls = (val: internal.primitives.StubUint64Compat) => internal.primitives.Uint64Cls.fromCompat(val)

export const asBigUintCls = (val: internal.primitives.StubBigUintCompat) => internal.primitives.BigUintCls.fromCompat(val)

export const asBytesCls = (val: internal.primitives.StubBytesCompat) => internal.primitives.BytesCls.fromCompat(val)

export const asMaybeUint64Cls = (val: DeliberateAny) => {
  try {
    return internal.primitives.Uint64Cls.fromCompat(val)
  } catch (e) {
    if (e instanceof internal.errors.InternalError) {
      // swallow error and return undefined
    } else {
      throw e
    }
  }
  return undefined
}

export const asMaybeBytesCls = (val: DeliberateAny) => {
  try {
    return internal.primitives.BytesCls.fromCompat(val)
  } catch (e) {
    if (e instanceof internal.errors.InternalError) {
      // swallow error and return undefined
    } else {
      throw e
    }
  }
  return undefined
}

export const binaryStringToBytes = (s: string): internal.primitives.BytesCls =>
  internal.primitives.BytesCls.fromCompat(new Uint8Array(s.match(/.{1,8}/g)!.map((x) => parseInt(x, 2))))
