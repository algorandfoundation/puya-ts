import { NoImplementation } from './internal/errors'

export type Uint64Compat = uint64 | bigint | boolean | number
export type BigUintCompat = bigint | bytes | number | boolean
export type StringCompat = string
export type BytesCompat = bytes | string

/**
 * An unsigned integer of exactly 64 bits
 */
export type uint64 = {
  __type?: 'uint64'
} & number

/**
 * Create a uint64 with the default value of 0
 */
export function Uint64(): uint64
/**
 * Create a uint64 from a string literal
 */
export function Uint64(v: string): uint64
/**
 * Create a uint64 from a bigint literal
 */
export function Uint64(v: bigint): uint64
/**
 * Create a uint64 from a number literal
 */
export function Uint64(v: number): uint64
/**
 * Create a uint64 from a boolean value. True is 1, False is 0
 */
export function Uint64(v: boolean): uint64
export function Uint64(v?: Uint64Compat | string): uint64 {
  throw new NoImplementation()
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
 * Create a biguint from a bigint literal
 */
export function BigUint(v: bigint): biguint
/**
 * Create a biguint from a boolean value (true = 1, false = 0)
 */
export function BigUint(v: boolean): biguint
/**
 * Create a biguint from a uint64 value
 */
export function BigUint(v: uint64): biguint
/**
 * Create a biguint from a number literal
 */
export function BigUint(v: number): biguint
/**
 * Create a biguint from a byte array interpreted as a big-endian number
 */
export function BigUint(v: bytes): biguint
/**
 * Create a biguint from a string literal containing the decimal digits
 */
export function BigUint(v: string): biguint
/**
 * Create a biguint with the default value of 0
 */
export function BigUint(): biguint
export function BigUint(v?: BigUintCompat | string): biguint {
  throw new NoImplementation()
}

export type bytes = {
  readonly length: uint64

  at(i: Uint64Compat): bytes

  concat(other: BytesCompat): bytes

  bitwiseAnd(other: BytesCompat): bytes

  bitwiseOr(other: BytesCompat): bytes

  bitwiseXor(other: BytesCompat): bytes

  bitwiseInvert(): bytes

  equals(other: BytesCompat): boolean

  slice(): bytes
  slice(start: Uint64Compat): bytes
  slice(start: Uint64Compat, end: Uint64Compat): bytes
  slice(start?: Uint64Compat, end?: Uint64Compat): bytes

  toString(): string
}

/**
 * Create a byte array from a string interpolation template and compatible replacements
 * @param value
 * @param replacements
 */
export function Bytes(value: TemplateStringsArray, ...replacements: BytesCompat[]): bytes
/**
 * Create a byte array from a utf8 string
 */
export function Bytes(value: string): bytes
/**
 * No op, returns the provided byte array.
 */
export function Bytes(value: bytes): bytes
/**
 * Create a byte array from a biguint value encoded as a variable length big-endian number
 */
export function Bytes(value: biguint): bytes
/**
 * Create a byte array from a uint64 value encoded as a fixed length 64-bit number
 */
export function Bytes(value: uint64): bytes
/**
 * Create a byte array from an Iterable<uint64> where each item is interpreted as a single byte and must be between 0 and 255 inclusively
 */
export function Bytes(value: Iterable<uint64>): bytes
/**
 * Create an empty byte array
 */
export function Bytes(): bytes
export function Bytes(
  value?: BytesCompat | TemplateStringsArray | biguint | uint64 | Iterable<number>,
  ...replacements: BytesCompat[]
): bytes {
  throw new NoImplementation()
}

/**
 * Create a new bytes value from a hexadecimal encoded string
 * @param hex
 */
Bytes.fromHex = (hex: string): bytes => {
  throw new NoImplementation()
}
/**
 * Create a new bytes value from a base 64 encoded string
 * @param b64
 */
Bytes.fromBase64 = (b64: string): bytes => {
  throw new NoImplementation()
}

/**
 * Create a new bytes value from a base 32 encoded string
 * @param b32
 */
Bytes.fromBase32 = (b32: string): bytes => {
  throw new NoImplementation()
}

export interface BytesBacked {
  get bytes(): bytes
}
