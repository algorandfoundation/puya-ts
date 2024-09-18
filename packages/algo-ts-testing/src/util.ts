import { internal } from '@algorandfoundation/algo-ts'
import { randomBytes } from 'crypto'
import { BITS_IN_BYTE, MAX_UINT512, MAX_UINT8, UINT512_SIZE } from './constants'
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

export const asBigInt = (v: internal.primitives.StubUint64Compat): bigint => asUint64Cls(v).asBigInt()

export const asNumber = (v: internal.primitives.StubUint64Compat): number => asUint64Cls(v).asNumber()

export function extractGenericTypeArgs(t: string): string[] {
  const match = t.match(/<(.*)>/)
  if (!match) return []
  return match[1].split(',').map((x) => x.trim())
}

export const asUint64Cls = (val: internal.primitives.StubUint64Compat) => internal.primitives.Uint64Cls.fromCompat(val)

export const asBigUintCls = (val: internal.primitives.StubBigUintCompat) => internal.primitives.BigUintCls.fromCompat(val)

export const asBytesCls = (val: internal.primitives.StubBytesCompat) => internal.primitives.BytesCls.fromCompat(val)

export const asUint64 = (val: internal.primitives.StubUint64Compat) => asUint64Cls(val).asAlgoTs()

export const asBigUint = (val: internal.primitives.StubBigUintCompat) => asBigUintCls(val).asAlgoTs()

export const asBytes = (val: internal.primitives.StubBytesCompat) => asBytesCls(val).asAlgoTs()

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

export const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getRandomBigInt = (min: number | bigint, max: number | bigint): bigint => {
  const bigIntMin = BigInt(min)
  const bigIntMax = BigInt(max)
  const randomValue = [...Array(UINT512_SIZE / BITS_IN_BYTE).keys()]
    .map(() => getRandomNumber(0, MAX_UINT8))
    .reduce((acc, x) => acc * 256n + BigInt(x), 0n)
  return (randomValue % (bigIntMax - bigIntMin)) + bigIntMin
}

export const getRandomBytes = (length: number): internal.primitives.BytesCls => asBytesCls(new Uint8Array(randomBytes(length)))

const NoValue = Symbol('no-value')
type LazyInstance<T> = () => T
export const Lazy = <T>(factory: () => T): LazyInstance<T> => {
  let val: T | typeof NoValue = NoValue

  return () => {
    if (val === NoValue) {
      val = factory()
    }
    return val
  }
}

const ObjectReferenceSymbol = Symbol('ObjectReference')
const objectRefIter = iterBigInt(1001n, MAX_UINT512)
export const getObjectReference = (obj: DeliberateAny): bigint => {
  const tryGetReference = (obj: DeliberateAny): bigint | undefined => {
    const s = Object.getOwnPropertySymbols(obj).find((s) => s.toString() === ObjectReferenceSymbol.toString())
    return s ? obj[s] : ObjectReferenceSymbol in obj ? obj[ObjectReferenceSymbol] : undefined
  }
  const existingRef = tryGetReference(obj)
  if (existingRef !== undefined) {
    return existingRef
  }
  const ref = objectRefIter.next().value
  Object.defineProperty(obj, ObjectReferenceSymbol, {
    value: ref,
    enumerable: false,
    writable: false,
  })

  return ref
}
