import type { biguint, BigUintCompat, bytes, BytesCompat, uint64, Uint64Compat } from '../index'
import { encodingUtil } from '../internal'
import { base32ToUint8Array } from './base-32'
import {
  base64ToUint8Array,
  bigIntToUint8Array,
  hexToUint8Array,
  uint8ArrayToBigInt,
  uint8ArrayToHex,
  uint8ArrayToUtf8,
  utf8ToUint8Array,
} from './encoding-util'
import { avmError, AvmError, avmInvariant, internalError } from './errors'
import { nameOfType } from './name-of-type'

const MAX_UINT8 = 2 ** 8 - 1
const MAX_BYTES_SIZE = 4096

export type StubBigUintCompat = BigUintCompat | BigUintCls | Uint64Cls
export type StubBytesCompat = BytesCompat | BytesCls
export type StubUint64Compat = Uint64Compat | Uint64Cls

export function toExternalValue(val: uint64): bigint
export function toExternalValue(val: biguint): bigint
export function toExternalValue(val: bytes): Uint8Array
export function toExternalValue(val: string): string
export function toExternalValue(val: uint64 | biguint | bytes | string) {
  const instance = val as unknown
  if (instance instanceof BytesCls) return instance.asUint8Array()
  if (instance instanceof Uint64Cls) return instance.asBigInt()
  if (instance instanceof BigUintCls) return instance.asBigInt()
  if (typeof val === 'string') return val
}
export const toBytes = (val: unknown): bytes => {
  if (val instanceof AlgoTsPrimitiveCls) return val.toBytes().asAlgoTs()

  switch (typeof val) {
    case 'string':
      return BytesCls.fromCompat(val).asAlgoTs()
    case 'bigint':
      return BigUintCls.fromCompat(val).toBytes().asAlgoTs()
    case 'number':
      return Uint64Cls.fromCompat(val).toBytes().asAlgoTs()
    default:
      internalError(`Unsupported arg type ${nameOfType(val)}`)
  }
}

/**
 * Convert a StubUint64Compat value into a 'number' if possible.
 * This value may be negative
 * @param v
 */
export const getNumber = (v: StubUint64Compat): number => {
  if (typeof v == 'boolean') return v ? 1 : 0
  if (typeof v == 'number') return v
  if (typeof v == 'bigint') {
    avmInvariant(
      v <= BigInt(Number.MAX_SAFE_INTEGER) && v >= BigInt(Number.MIN_SAFE_INTEGER),
      'value cannot be safely converted to a number',
    )
    return Number(v)
  }
  if (v instanceof Uint64Cls) return v.asNumber()
  internalError(`Cannot convert ${v} to number`)
}

export const getUint8Array = (v: StubBytesCompat): Uint8Array => {
  return BytesCls.fromCompat(v).asUint8Array()
}

export const isBytes = (v: unknown): v is StubBytesCompat => {
  if (typeof v === 'string') return true
  if (v instanceof BytesCls) return true
  return v instanceof Uint8Array
}

export const isUint64 = (v: unknown): v is StubUint64Compat => {
  if (typeof v == 'number') return true
  if (typeof v == 'bigint') return true
  return v instanceof Uint64Cls
}

export const checkUint64 = (v: bigint): bigint => {
  const u64 = BigInt.asUintN(64, v)
  if (u64 !== v) throw new AvmError(`Uint64 overflow or underflow`)
  return u64
}
export const checkBigUint = (v: bigint): bigint => {
  const uBig = BigInt.asUintN(64 * 8, v)
  if (uBig !== v) throw new AvmError(`BigUint overflow or underflow`)
  return uBig
}

export const checkBytes = (v: Uint8Array): Uint8Array => {
  if (v.length > MAX_BYTES_SIZE) throw new AvmError(`Bytes length ${v.length} exceeds maximum length ${MAX_BYTES_SIZE}`)
  return v
}

/**
 * Verifies that an object is an instance of a type based on its name rather than reference equality.
 *
 * This is useful in scenarios where a module loader has loaded a module twice and hence two instances of a
 * type do not have reference equality on their constructors.
 * @param subject The object to check
 * @param typeCtor The ctor of the type
 */
function isInstanceOfTypeByName(subject: unknown, typeCtor: { name: string }): boolean {
  if (subject === null || typeof subject !== 'object') return false

  let ctor = subject.constructor
  while (typeof ctor === 'function') {
    if (ctor.name === typeCtor.name) return true
    ctor = Object.getPrototypeOf(ctor)
  }
  return false
}

export abstract class AlgoTsPrimitiveCls {
  static [Symbol.hasInstance](x: unknown): x is AlgoTsPrimitiveCls {
    return isInstanceOfTypeByName(x, AlgoTsPrimitiveCls)
  }

  abstract valueOf(): bigint | string
  abstract toBytes(): BytesCls
}

export class Uint64Cls extends AlgoTsPrimitiveCls {
  readonly #value: bigint
  constructor(value: bigint | number | string) {
    super()
    this.#value = BigInt(value)
    checkUint64(this.#value)

    Object.defineProperty(this, 'uint64', {
      value: this.#value.toString(),
      writable: false,
      enumerable: true,
    })
  }
  static [Symbol.hasInstance](x: unknown): x is Uint64Cls {
    return isInstanceOfTypeByName(x, Uint64Cls)
  }
  static fromCompat(v: StubUint64Compat): Uint64Cls {
    if (typeof v == 'boolean') return new Uint64Cls(v ? 1n : 0n)
    if (typeof v == 'number') return new Uint64Cls(BigInt(v))
    if (typeof v == 'bigint') return new Uint64Cls(v)
    if (v instanceof Uint64Cls) return v
    internalError(`Cannot convert ${v} to uint64`)
  }

  valueOf(): bigint {
    return this.#value
  }

  toBytes(): BytesCls {
    return new BytesCls(bigIntToUint8Array(this.#value, 8))
  }

  asAlgoTs(): uint64 {
    return this as unknown as uint64
  }

  asBigInt(): bigint {
    return this.#value
  }
  asNumber(): number {
    if (this.#value > Number.MAX_SAFE_INTEGER) {
      throw new AvmError('value cannot be safely converted to a number')
    }
    return Number(this.#value)
  }
}

export class BigUintCls extends AlgoTsPrimitiveCls {
  readonly #value: bigint
  constructor(value: bigint) {
    super()
    this.#value = value
    Object.defineProperty(this, 'biguint', {
      value: value.toString(),
      writable: false,
      enumerable: true,
    })
  }
  valueOf(): bigint {
    return this.#value
  }

  toBytes(): BytesCls {
    return new BytesCls(bigIntToUint8Array(this.#value))
  }

  asAlgoTs(): biguint {
    return this as unknown as biguint
  }

  asBigInt(): bigint {
    return this.#value
  }
  asNumber(): number {
    if (this.#value > Number.MAX_SAFE_INTEGER) {
      throw new AvmError('value cannot be safely converted to a number')
    }
    return Number(this.#value)
  }
  static [Symbol.hasInstance](x: unknown): x is BigUintCls {
    return isInstanceOfTypeByName(x, BigUintCls)
  }
  static fromCompat(v: StubBigUintCompat): BigUintCls {
    if (typeof v == 'boolean') return new BigUintCls(v ? 1n : 0n)
    if (typeof v == 'number') return new BigUintCls(BigInt(v))
    if (typeof v == 'bigint') return new BigUintCls(v)
    if (v instanceof Uint64Cls) return new BigUintCls(v.valueOf())
    if (v instanceof BytesCls) return v.toBigUint()
    if (v instanceof BigUintCls) return v
    internalError(`Cannot convert ${nameOfType(v)} to BigUint`)
  }
}

export class BytesCls extends AlgoTsPrimitiveCls {
  readonly #v: Uint8Array
  constructor(v: Uint8Array) {
    super()
    this.#v = v
    checkBytes(this.#v)
    // Add an enumerable property for debugging code to show
    Object.defineProperty(this, 'bytes', {
      value: uint8ArrayToHex(this.#v),
      writable: false,
      enumerable: true,
    })
  }

  get length() {
    return new Uint64Cls(this.#v.length)
  }

  toBytes(): BytesCls {
    return this
  }

  at(i: StubUint64Compat): BytesCls {
    return new BytesCls(arrayUtil.arrayAt(this.#v, i))
  }

  slice(start: undefined | StubUint64Compat, end: undefined | StubUint64Compat): BytesCls {
    const sliced = arrayUtil.arraySlice(this.#v, start, end)
    return new BytesCls(sliced)
  }

  concat(other: StubBytesCompat): BytesCls {
    const otherArray = BytesCls.fromCompat(other).asUint8Array()
    const mergedArray = new Uint8Array(this.#v.length + otherArray.length)
    mergedArray.set(this.#v)
    mergedArray.set(otherArray, this.#v.length)
    return new BytesCls(mergedArray)
  }

  bitwiseAnd(other: StubBytesCompat): BytesCls {
    return this.bitwiseOp(other, (a, b) => a & b)
  }

  bitwiseOr(other: StubBytesCompat): BytesCls {
    return this.bitwiseOp(other, (a, b) => a | b)
  }

  bitwiseXor(other: StubBytesCompat): BytesCls {
    return this.bitwiseOp(other, (a, b) => a ^ b)
  }

  bitwiseInvert(): BytesCls {
    const result = new Uint8Array(this.#v.length)
    this.#v.forEach((v, i) => {
      result[i] = ~v & MAX_UINT8
    })
    return new BytesCls(result)
  }

  equals(other: StubBytesCompat): boolean {
    const otherArray = BytesCls.fromCompat(other).asUint8Array()
    if (this.#v.length !== otherArray.length) return false
    for (let i = 0; i < this.#v.length; i++) {
      if (this.#v[i] !== otherArray[i]) return false
    }
    return true
  }

  private bitwiseOp(other: StubBytesCompat, op: (a: number, b: number) => number): BytesCls {
    const otherArray = BytesCls.fromCompat(other).asUint8Array()
    const result = new Uint8Array(Math.max(this.#v.length, otherArray.length))
    for (let i = result.length - 1; i >= 0; i--) {
      const thisIndex = i - (result.length - this.#v.length)
      const otherIndex = i - (result.length - otherArray.length)
      result[i] = op(this.#v[thisIndex] ?? 0, otherArray[otherIndex] ?? 0)
    }
    return new BytesCls(result)
  }

  valueOf(): string {
    return uint8ArrayToHex(this.#v)
  }

  static [Symbol.hasInstance](x: unknown): x is BytesCls {
    return isInstanceOfTypeByName(x, BytesCls)
  }

  static fromCompat(v: StubBytesCompat | Uint8Array | undefined): BytesCls {
    if (v === undefined) return new BytesCls(new Uint8Array())
    if (typeof v === 'string') return new BytesCls(utf8ToUint8Array(v))
    if (typeof v == 'bigint') return new BytesCls(encodingUtil.bigIntToUint8Array(v))
    if (v instanceof BytesCls) return v
    if (v instanceof Uint8Array) return new BytesCls(v)
    internalError(`Cannot convert ${nameOfType(v)} to bytes`)
  }

  static fromInterpolation(template: TemplateStringsArray, replacements: StubBytesCompat[]) {
    return template
      .flatMap((templateText, index) => {
        const replacement = replacements[index]
        if (replacement) {
          return [BytesCls.fromCompat(templateText), BytesCls.fromCompat(replacement)]
        }
        return [BytesCls.fromCompat(templateText)]
      })
      .reduce((a, b) => a.concat(b))
  }

  static fromHex(hex: string): BytesCls {
    return new BytesCls(hexToUint8Array(hex))
  }

  static fromBase64(b64: string): BytesCls {
    return new BytesCls(base64ToUint8Array(b64))
  }

  static fromBase32(b32: string): BytesCls {
    return new BytesCls(base32ToUint8Array(b32))
  }

  toUint64(): Uint64Cls {
    return new Uint64Cls(uint8ArrayToBigInt(this.#v))
  }

  toBigUint(): BigUintCls {
    return new BigUintCls(uint8ArrayToBigInt(this.#v))
  }

  toString(): string {
    return uint8ArrayToUtf8(this.#v)
  }

  asAlgoTs(): bytes {
    return this as unknown as bytes
  }

  asUint8Array(): Uint8Array {
    return this.#v
  }
}

export const arrayUtil = new (class ArrayUtil {
  arrayAt(arrayLike: Uint8Array, index: StubUint64Compat): Uint8Array
  arrayAt<T>(arrayLike: T[], index: StubUint64Compat): T
  arrayAt<T>(arrayLike: T[] | Uint8Array, index: StubUint64Compat): T | Uint8Array
  arrayAt<T>(arrayLike: T[] | Uint8Array, index: StubUint64Compat): T | Uint8Array {
    const indexNum = getNumber(index)
    if (arrayLike instanceof Uint8Array) {
      const res = arrayLike.slice(indexNum, indexNum === -1 ? undefined : indexNum + 1)
      avmInvariant(res.length, 'Index out of bounds')
      return res
    }
    return arrayLike.at(indexNum) ?? avmError('Index out of bounds')
  }
  arraySlice(arrayLike: Uint8Array, start: undefined | StubUint64Compat, end: undefined | StubUint64Compat): Uint8Array
  arraySlice<T>(arrayLike: T[], start: undefined | StubUint64Compat, end: undefined | StubUint64Compat): T[]
  arraySlice<T>(arrayLike: T[] | Uint8Array, start: undefined | StubUint64Compat, end: undefined | StubUint64Compat): Uint8Array | T[]
  arraySlice<T>(arrayLike: T[] | Uint8Array, start: undefined | StubUint64Compat, end: undefined | StubUint64Compat) {
    const startNum = start === undefined ? undefined : getNumber(start)
    const endNum = end === undefined ? undefined : getNumber(end)
    if (arrayLike instanceof Uint8Array) {
      return arrayLike.slice(startNum, endNum)
    } else {
      return arrayLike.slice(startNum, endNum)
    }
  }
})()
