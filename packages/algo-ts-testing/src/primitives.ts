import { BigUintCompat, bytes, BytesCompat, uint64, biguint, Uint64Compat, StringCompat, str, internal } from '@algorandfoundation/algo-ts'
import { AvmError, internalError } from './errors'
import { nameOfType } from './util'
import { bigIntToUint8Array, uint8ArrayToBigInt, uint8ArrayToHex, uint8ArrayToUtf8, utf8ToUint8Array } from './encoding-util'

export function btoi(bytes: BytesCompat): uint64 {
  return BytesCls.fromCompat(bytes).toUint64().asAlgoTs()
}
export function itob(value: Uint64Compat): bytes {
  return Uint64Cls.fromCompat(value).toBytes().asAlgoTs()
}

export function toExternalValue(val: uint64): bigint
export function toExternalValue(val: biguint): bigint
export function toExternalValue(val: bytes): Uint8Array
export function toExternalValue(val: str): string
export function toExternalValue(val: uint64 | biguint | bytes | str) {
  const cls = val as unknown
  if (cls instanceof BytesCls) return cls.asUint8Array()
  if (cls instanceof Uint64Cls) return cls.asBigInt()
  if (cls instanceof BigUintCls) return cls.asBigInt()
  if (cls instanceof StrCls) return cls.asString()
}
export const toBytes = (val: unknown): bytes => {
  if (val instanceof AlgoTsPrimitiveCls) return val.toBytes().asAlgoTs()

  switch (typeof val) {
    case 'string':
      return StrCls.fromCompat(val).toBytes().asAlgoTs()
    case 'bigint':
      return BigUintCls.fromCompat(val).toBytes().asAlgoTs()
    case 'number':
      return Uint64Cls.fromCompat(val).toBytes().asAlgoTs()
    default:
      internalError(`Unsupported arg type ${nameOfType(val)}`)
  }
}

export const isBytes = (v: unknown): v is BytesCompat => {
  if (typeof v === 'string') return true
  if (v instanceof BytesCls) return true
  return v instanceof Uint8Array
}

export const isUint64 = (v: unknown): v is Uint64Compat => {
  if (typeof v == 'boolean') return true
  if (typeof v == 'number') return true
  if (typeof v == 'bigint') return true
  return v instanceof Uint64Cls
}

export const isBigUint = (v: unknown): v is biguint => {
  return v instanceof BigUintCls
}

export const checkUint64 = (v: bigint): bigint => {
  const u64 = BigInt.asUintN(64, v)
  if (u64 !== v) throw new AvmError(`Uint64 over or underflow`)
  return u64
}

export const checkBigUint = (v: bigint): bigint => {
  const uBig = BigInt.asUintN(64 * 8, v)
  if (uBig !== v) throw new AvmError(`BigUint over or underflow`)
  return uBig
}

export abstract class AlgoTsPrimitiveCls {
  abstract valueOf(): bigint | string | boolean

  abstract toBytes(): BytesCls
}

export class Uint64Cls extends AlgoTsPrimitiveCls {
  public readonly value: bigint
  constructor(value: bigint | number | string) {
    super()
    this.value = BigInt(value)
    checkUint64(this.value)
  }

  static fromCompat(v: Uint64Compat): Uint64Cls {
    if (typeof v == 'boolean') return new Uint64Cls(v ? 1n : 0n)
    if (typeof v == 'number') return new Uint64Cls(BigInt(v))
    if (typeof v == 'bigint') return new Uint64Cls(v)
    internalError(`Cannot convert ${v} to uint64`)
  }

  static getNumber(v: Uint64Compat): number {
    return Uint64Cls.fromCompat(v).asNumber()
  }

  valueOf(): bigint {
    return this.value
  }

  toBytes(): BytesCls {
    return new BytesCls(bigIntToUint8Array(this.value, 8))
  }

  asAlgoTs(): uint64 {
    return this as unknown as uint64
  }

  asBigInt(): bigint {
    return this.value
  }
  asNumber(): number {
    if (this.value > Number.MAX_SAFE_INTEGER) {
      throw new AvmError('value cannot be safely converted to a number')
    }
    return Number(this.value)
  }
}

export class BigUintCls extends AlgoTsPrimitiveCls {
  constructor(public readonly value: bigint) {
    super()
    checkBigUint(value)
  }
  valueOf(): bigint {
    return this.value
  }

  toBytes(): BytesCls {
    return new BytesCls(bigIntToUint8Array(this.value))
  }

  asAlgoTs(): biguint {
    return this as unknown as biguint
  }

  asBigInt(): bigint {
    return this.value
  }
  asNumber(): number {
    if (this.value > Number.MAX_SAFE_INTEGER) {
      throw new AvmError('value cannot be safely converted to a number')
    }
    return Number(this.value)
  }

  static fromCompat(v: BigUintCompat | BytesCls): BigUintCls {
    if (typeof v == 'boolean') return new BigUintCls(v ? 1n : 0n)
    if (typeof v == 'number') return new BigUintCls(BigInt(v))
    if (typeof v == 'bigint') return new BigUintCls(v)
    if (v instanceof BytesCls) return v.toBigUint()
    internalError(`Cannot convert ${nameOfType(v)} to BigUint`)
  }
}

export class BytesCls extends AlgoTsPrimitiveCls {
  #v: Uint8Array
  value: string
  constructor(v: Uint8Array) {
    super()
    this.#v = v
    this.value = uint8ArrayToHex(v)
  }

  get length() {
    return new Uint64Cls(this.#v.length)
  }

  toBytes(): BytesCls {
    return this
  }
  at(i: Uint64Compat): BytesCls {
    const start = Uint64Cls.fromCompat(i).asNumber()
    return new BytesCls(this.#v.slice(start, start + 1))
  }

  slice(start: Uint64Compat, end: Uint64Compat): BytesCls {
    const sliced = internal.ctxMgr.instance.arraySlice(this.#v, start, end)
    return new BytesCls(sliced)
  }

  concat(other: BytesCompat | BytesCls): BytesCls {
    const otherArray = BytesCls.fromCompat(other).asUint8Array()
    const mergedArray = new Uint8Array(this.#v.length + otherArray.length)
    mergedArray.set(this.#v)
    mergedArray.set(otherArray, this.#v.length)
    return new BytesCls(mergedArray)
  }

  valueOf(): string {
    return this.value
  }

  static fromCompat(v: BytesCompat | BytesCls): BytesCls {
    if (typeof v === 'string') return new BytesCls(utf8ToUint8Array(v))
    if (v instanceof BytesCls) return v
    if (v instanceof Uint8Array) return new BytesCls(v)
    internalError(`Cannot convert ${nameOfType(v)} to bytes`)
  }

  toUint64(): Uint64Cls {
    return new Uint64Cls(uint8ArrayToBigInt(this.#v))
  }
  toBigUint(): BigUintCls {
    return new BigUintCls(uint8ArrayToBigInt(this.#v))
  }

  asAlgoTs(): bytes {
    return this as unknown as bytes
  }

  asUint8Array(): Uint8Array {
    return this.#v
  }
}
export class StrCls extends AlgoTsPrimitiveCls {
  #v: string
  public value: string
  constructor(v: string) {
    super()
    this.#v = v
    this.value = v
  }

  concat(other: StringCompat | StrCls) {
    return new StrCls(this.#v + StrCls.fromCompat(other).#v)
  }

  asString() {
    return this.#v
  }

  valueOf(): string {
    return this.#v
  }

  toBytes(): BytesCls {
    return new BytesCls(utf8ToUint8Array(this.#v))
  }

  static fromCompat(v: StringCompat | BytesCls | StrCls): StrCls {
    if (v instanceof StrCls) return v
    if (typeof v === 'string') return new StrCls(v)
    if (v instanceof BytesCls) return new StrCls(uint8ArrayToUtf8(v.asUint8Array()))
    internalError(`Cannot convert ${nameOfType(v)} to str`)
  }

  asAlgoTs(): str {
    return this as unknown as str
  }
}
