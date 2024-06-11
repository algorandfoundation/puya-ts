import { BigUintCompat, bytes, BytesCompat, uint64, biguint, Uint64Compat, StringCompat, str } from '@algorandfoundation/algo-ts'
import { AvmError, internalError } from './errors'
import { nameOfType } from './util'
import { bigIntToUint8Array, uint8ArrayToBigInt, utf8ToUint8Array } from './encoding-util'

export function btoi(bytes: BytesCompat): uint64 {
  return makeUint64(uint8ArrayToBigInt(makeUInt8Array(bytes).valueOf()))
}
export function itob(value: Uint64Compat): bytes {
  return makeBytes(bigIntToUint8Array(checkUint64(makeBigInt(value))))
}

export const encodeBytes = (val: unknown): bytes => {
  if (val instanceof Uint8Array) return makeBytes(val)
  if (val instanceof BytesCls) return val as unknown as bytes
  if (val instanceof Uint64Cls) return makeBytes(bigIntToUint8Array(val.valueOf(), 8))
  if (val instanceof BigUintCls) return makeBytes(bigIntToUint8Array(val.valueOf(), 'dynamic'))
  switch (typeof val) {
    case 'string':
      return makeBytes(val)
    case 'bigint':
      return makeBytes(bigIntToUint8Array(val, 8))
    case 'number':
      return makeBytes(bigIntToUint8Array(BigInt(val), 8))
    default:
      internalError(`Unsupported arg type ${nameOfType(val)}`)
  }
}

export const isBytes = (v: unknown): v is BytesCompat => {
  if (typeof v === 'string') return true
  if (v instanceof BytesCls) return true
  if (v instanceof Uint8Array) return true
  return false
}

export const isUint64 = (v: unknown): v is Uint64Compat => {
  if (typeof v == 'boolean') return true
  if (typeof v == 'number') return true
  if (typeof v == 'bigint') return true
  if (v instanceof Uint64Cls) return true
  return false
}

export const isBigUint = (v: unknown): v is biguint => {
  return v instanceof BigUintCls
}
export const makeStr = (v: StringCompat | StrCls): str => {
  if (typeof v === 'string') return new StrCls(v) as unknown as str
  if (v instanceof StrCls) return v as unknown as str

  internalError(`Cannot convert ${nameOfType(v)} to str`)
}
export const makeBytes = (v: BytesCompat | BytesCls): bytes => {
  if (typeof v === 'string') return new BytesCls(utf8ToUint8Array(v)) as unknown as bytes
  if (v instanceof BytesCls) return v as unknown as bytes
  if (v instanceof Uint8Array) return new BytesCls(v) as unknown as bytes
  internalError(`Cannot convert ${nameOfType(v)} to bytes`)
}
export const makeUInt8Array = (v: BytesCompat | BytesCls): Uint8Array => {
  if (typeof v === 'string') return utf8ToUint8Array(v)
  if (v instanceof BytesCls) return v.valueOf()
  if (v instanceof Uint8Array) return v
  internalError(`Cannot convert ${nameOfType(v)} to bytes`)
}

export const makeHex = (v: BytesCompat): string => {
  return Buffer.from(makeUInt8Array(v)).toString('hex')
}

export const checkUint64 = (v: bigint): bigint => {
  const u64 = BigInt.asUintN(64, v)
  if (u64 !== v) throw new AvmError(`Uint64 over or underflow`)
  return u64
}

export const checkBigUint = (v: bigint): biguint => {
  const uBig = BigInt.asUintN(64 * 8, v)
  if (uBig !== v) throw new AvmError(`BigUint over or underflow`)
  return uBig as biguint
}

export const makeUint64 = (v: Uint64Compat): uint64 => {
  if (typeof v == 'boolean') return new Uint64Cls(v ? 1n : 0n) as unknown as uint64
  if (typeof v == 'number') return new Uint64Cls(BigInt(v)) as unknown as uint64
  if (typeof v == 'bigint') return new Uint64Cls(v) as unknown as uint64
  internalError(`Cannot convert ${v} to uint64`)
}

export const makeBigUint = (v: BigUintCompat): biguint => {
  if (typeof v == 'boolean') return new BigUintCls(v ? 1n : 0n) as unknown as biguint
  if (typeof v == 'number') return new BigUintCls(BigInt(v)) as unknown as biguint
  if (typeof v == 'bigint') return new BigUintCls(v) as unknown as biguint
  const maybeCls: unknown = v
  if (maybeCls instanceof BytesCls) return new BigUintCls(uint8ArrayToBigInt(maybeCls.valueOf())) as unknown as biguint
  internalError(`Cannot convert ${nameOfType(v)} to BigUint`)
}

export const makeBigInt = (v: Uint64Compat | BigUintCompat | Uint64Cls | BigUintCls): bigint => {
  if (typeof v == 'boolean') return v ? 1n : 0n
  if (typeof v == 'number') return BigInt(v)
  if (typeof v == 'bigint') return v
  if (v instanceof Uint64Cls) return v.valueOf()
  if (v instanceof BigUintCls) return v.valueOf()
  internalError(`Cannot convert ${nameOfType(v)} to bigint`)
}
export const makeNumber = (v: unknown): number => {
  if (typeof v == 'boolean') return v ? 1 : 0
  if (typeof v == 'number') return v
  if (typeof v == 'bigint') return safeBigIntToNumber(v)
  if (v instanceof Uint64Cls) return safeBigIntToNumber(v.valueOf())
  internalError(`Cannot convert ${v} to number`)
}

function safeBigIntToNumber(value: bigint): number {
  if (value > Number.MAX_SAFE_INTEGER) {
    throw new AvmError('value cannot be safely converted to a number')
  }
  return Number(value)
}

export class Uint64Cls {
  constructor(public readonly value: bigint) {
    checkUint64(value)
  }

  valueOf(): bigint {
    return this.value
  }
}

export class BigUintCls {
  constructor(public readonly value: bigint) {
    checkBigUint(value)
  }
  valueOf(): bigint {
    return this.value
  }
}

export class BytesCls {
  #v: Uint8Array
  value: string
  constructor(v: Uint8Array) {
    this.#v = v
    this.value = makeHex(v)
  }

  get length() {
    return makeUint64(this.#v.length)
  }

  at(i: Uint64Compat): BytesCls {
    const start = makeNumber(i)
    return new BytesCls(this.#v.slice(start, start + 1))
  }

  slice(start: Uint64Compat, end: Uint64Compat): BytesCls {
    return new BytesCls(this.#v.slice(makeNumber(start), makeNumber(end)))
  }

  concat(other: BytesCompat): BytesCls {
    const otherArray = makeUInt8Array(other)
    const mergedArray = new Uint8Array(this.#v.length + otherArray.length)
    mergedArray.set(this.#v)
    mergedArray.set(otherArray, this.#v.length)
    return new BytesCls(mergedArray)
  }

  valueOf(): Uint8Array {
    return this.#v
  }
}
export class StrCls {
  #v: string
  public value: string
  constructor(v: string) {
    this.#v = v
    this.value = v
  }
}
