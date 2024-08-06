import type { biguint, BigUintCompat, bytes, BytesCompat, uint64, Uint64Compat } from '../index'
import { DeliberateAny } from '../typescript-helpers'
import { bigIntToUint8Array, uint8ArrayToBigInt, uint8ArrayToUtf8, utf8ToUint8Array } from './encoding-util'
import { avmError, AvmError, internalError } from './errors'
import { nameOfType } from './name-of-type'

export type StubBigUintCompat = BigUintCompat | BigUintCls
export type StubBytesCompat = BytesCompat | BytesCls
export type StubUint64Compat = Uint64Compat | Uint64Cls

export function toExternalValue(val: uint64): bigint
export function toExternalValue(val: biguint): bigint
export function toExternalValue(val: bytes): Uint8Array
export function toExternalValue(val: string): string
export function toExternalValue(val: uint64 | biguint | bytes | string) {
  const instance = val as unknown
  if (BytesCls.isClassOf(instance)) return (instance as BytesCls).asUint8Array()
  if (Uint64Cls.isClassOf(instance)) return (instance as Uint64Cls).asBigInt()
  if (BigUintCls.isClassOf(instance)) return (instance as BigUintCls).asBigInt()
  if (typeof val === 'string') return val
}
export const toBytes = (val: unknown): bytes => {
  if (AlgoTsPrimitiveCls.isClassOf(val)) return val.toBytes().asAlgoTs()

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

export const isBytes = (v: unknown): v is StubBytesCompat => {
  if (typeof v === 'string') return true
  if (BytesCls.isClassOf(v)) return true
  return v instanceof Uint8Array
}

export const isUint64 = (v: unknown): v is StubUint64Compat => {
  if (typeof v == 'boolean') return true
  if (typeof v == 'number') return true
  if (typeof v == 'bigint') return true
  return Uint64Cls.isClassOf(v)
}

export const isBigUint = (v: unknown): v is biguint => {
  return BigUintCls.isClassOf(v)
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
  private readonly _type: string = AlgoTsPrimitiveCls.name

  constructor(t: string) {
    this._type = `${AlgoTsPrimitiveCls.name}.${t}`
  }

  static isClassOf(x: unknown): x is AlgoTsPrimitiveCls {
    return x instanceof Object && '_type' in x && (x as { _type: string })['_type'].startsWith(AlgoTsPrimitiveCls.name)
  }
  abstract valueOf(): bigint | string | boolean
  abstract toBytes(): BytesCls
}

export class Uint64Cls extends AlgoTsPrimitiveCls {
  public readonly value: bigint
  constructor(value: bigint | number | string) {
    super(Uint64Cls.name)
    this.value = BigInt(value)
    checkUint64(this.value)
  }
  static isClassOf(x: unknown): x is Uint64Cls {
    return x instanceof Object && '_type' in x && (x as { _type: string })['_type'].endsWith(Uint64Cls.name)
  }
  static fromCompat(v: StubUint64Compat): Uint64Cls {
    if (typeof v == 'boolean') return new Uint64Cls(v ? 1n : 0n)
    if (typeof v == 'number') return new Uint64Cls(BigInt(v))
    if (typeof v == 'bigint') return new Uint64Cls(v)
    if (Uint64Cls.isClassOf(v)) return v
    internalError(`Cannot convert ${v} to uint64`)
  }

  static getNumber(v: StubUint64Compat): number {
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
    super(BigUintCls.name)
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
  static isClassOf(x: unknown): x is BigUintCls {
    return x instanceof Object && '_type' in x && (x as { _type: string })['_type'].endsWith(BigUintCls.name)
  }
  static fromCompat(v: StubBigUintCompat): BigUintCls {
    if (typeof v == 'boolean') return new BigUintCls(v ? 1n : 0n)
    if (typeof v == 'number') return new BigUintCls(BigInt(v))
    if (typeof v == 'bigint') return new BigUintCls(v)
    if (BigUintCls.isClassOf(v)) return v
    internalError(`Cannot convert ${nameOfType(v)} to BigUint`)
  }
}

export class BytesCls extends AlgoTsPrimitiveCls {
  #v: Uint8Array
  constructor(v: Uint8Array) {
    super(BytesCls.name)
    this.#v = v
  }

  get length() {
    return new Uint64Cls(this.#v.length)
  }

  toBytes(): BytesCls {
    return this
  }
  at(i: StubUint64Compat): BytesCls {
    const start = Uint64Cls.isClassOf(i) ? i.asNumber() : Uint64Cls.fromCompat(i).asNumber()
    return new BytesCls(this.#v.slice(start, start + 1))
  }

  slice(start: StubUint64Compat, end: StubUint64Compat): BytesCls {
    const startNumber = Uint64Cls.isClassOf(start) ? start.asNumber() : start
    const endNumber = Uint64Cls.isClassOf(end) ? end.asNumber() : end
    const sliced = arrayUtil.arraySlice(this.#v, startNumber, endNumber)
    return new BytesCls(sliced)
  }

  concat(other: StubBytesCompat): BytesCls {
    const otherArray = BytesCls.fromCompat(other).asUint8Array()
    const mergedArray = new Uint8Array(this.#v.length + otherArray.length)
    mergedArray.set(this.#v)
    mergedArray.set(otherArray, this.#v.length)
    return new BytesCls(mergedArray)
  }

  valueOf(): string {
    return uint8ArrayToUtf8(this.#v)
  }

  static isClassOf(x: unknown): x is BytesCls {
    return x instanceof Object && '_type' in x && (x as { _type: string })['_type'].endsWith(BytesCls.name)
  }

  static fromCompat(v: StubBytesCompat | undefined): BytesCls {
    if (v === undefined) return new BytesCls(new Uint8Array())
    if (typeof v === 'string') return new BytesCls(utf8ToUint8Array(v))
    if (BytesCls.isClassOf(v)) return v
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

  toUint64(): Uint64Cls {
    return new Uint64Cls(uint8ArrayToBigInt(this.#v))
  }
  toBigUint(): BigUintCls {
    return new BigUintCls(uint8ArrayToBigInt(this.#v))
  }
  toString(): string {
    return this.valueOf()
  }

  asAlgoTs(): bytes {
    return this as unknown as bytes
  }

  asUint8Array(): Uint8Array {
    return this.#v
  }
}

export const arrayUtil = new (class {
  arrayAt<T>(arrayLike: T[], index: StubUint64Compat): T {
    return arrayLike.at(Uint64Cls.fromCompat(index).asNumber()) ?? avmError('Index out of bounds')
  }
  arraySlice(arrayLike: Uint8Array, start: StubUint64Compat, end: StubUint64Compat): Uint8Array
  arraySlice<T>(arrayLike: T[], start: StubUint64Compat, end: StubUint64Compat): T[]
  arraySlice<T>(arrayLike: T[] | Uint8Array, start: StubUint64Compat, end: StubUint64Compat) {
    return arrayLike.slice(Uint64Cls.getNumber(start), Uint64Cls.getNumber(end)) as DeliberateAny
  }
})()
