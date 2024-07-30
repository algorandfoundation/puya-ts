import { ctxMgr } from './execution-context'

export type Uint64Compat = uint64 | bigint | boolean | number
export type BigUintCompat = Uint64Compat | bigint | bytes | number
export type StringCompat = string
export type BytesCompat = bytes | string | Uint8Array

/**
 * An unsigned integer of exactly 64 bits
 */
export type uint64 = {
  __type?: 'uint64'
} & number

/**
 * Create a uint64 value
 * @param v The value to use
 */
export function Uint64(v: bigint): uint64
export function Uint64(v: number): uint64
export function Uint64(v: boolean): uint64
export function Uint64(v: Uint64Compat): uint64 {
  return ctxMgr.instance.makeUint64(v)
}

/**
 * An unsigned integer of up to 512 bits
 *
 * Stored as a big-endian variable byte array
 */
export type biguint = {
  __type?: 'biguint'
} & bigint

/**
 * Create a biguint value
 * @param v The value to use
 */
export function BigUint(v: bigint): biguint
export function BigUint(v: boolean): biguint
export function BigUint(v: number): biguint
export function BigUint(v: bytes): biguint
export function BigUint(v: BigUintCompat): biguint {
  return ctxMgr.instance.makeBigUint(v)
}

export type bytes = {
  readonly length: uint64

  at(i: Uint64Compat): bytes

  concat(other: BytesCompat): bytes

  bitwiseInvert(): bytes

  toString(): string
}

export function Bytes(value: TemplateStringsArray, ...replacements: BytesCompat[]): bytes
export function Bytes(value: BytesCompat): bytes
export function Bytes(): bytes
export function Bytes(value?: BytesCompat | TemplateStringsArray, ...replacements: BytesCompat[]): bytes {
  if (isTemplateStringsArray(value)) {
    return ctxMgr.instance.makeInterpolatedBytes(value, replacements)
  } else {
    return ctxMgr.instance.makeBytes(value)
  }
}

/**
 * Create a new bytes value from a hexadecimal encoded string
 * @param hex
 */
Bytes.fromHex = (hex: string): bytes => {
  throw new Error('TODO')
}
/**
 * Create a new bytes value from a base 64 encoded string
 * @param b64
 */
Bytes.fromBase64 = (b64: string): bytes => {
  throw new Error('TODO')
}

/**
 * Create a new bytes value from a base 32 encoded string
 * @param b32
 */
Bytes.fromBase32 = (b32: string): bytes => {
  throw new Error('TODO')
}

function isTemplateStringsArray(v: unknown): v is TemplateStringsArray {
  return Boolean(v) && Array.isArray(v) && typeof v[0] === 'string'
}

export interface BytesBacked {
  get bytes(): bytes
}
