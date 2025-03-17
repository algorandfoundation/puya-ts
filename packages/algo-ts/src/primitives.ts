import { NoImplementation } from './internal/errors'

/**
 * An alias for types which can be converted to a uint64
 */
export type Uint64Compat = uint64 | bigint | boolean | number
/**
 * An alias for types which can be converted to a biguint
 */
export type BigUintCompat = bigint | bytes | number | boolean
/**
 * An alias for types which can be converted to a string
 */
export type StringCompat = string
/**
 * An alias for types which can be converted to a bytes sequence
 */
export type BytesCompat = bytes | string

/**
 * An unsigned integer of exactly 64 bits
 */
export type uint64 = {
  /**
   * @hidden
   */
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
  /**
   * @hidden
   */
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

/**
 * A sequence of zero or more bytes (ie. byte[])
 */
export type bytes = {
  /**
   * Retrieve the length of the byte sequence
   */
  readonly length: uint64

  /**
   * Retrieve the byte at the index i
   * @param i The index to read. Can be negative to read from the end
   * @returns The byte found at the index, or an empty bytes value
   */
  at(i: Uint64Compat): bytes

  /**
   * Concatenate this bytes value with another bytes value
   * @param other The other bytes value
   * @returns The concatenation result
   */
  concat(other: BytesCompat): bytes

  /**
   * Perform a bitwise AND operation with this bytes value and another bytes value.
   *
   * The shorter of the two values will be zero-left extended to the larger length.
   * @param other The other bytes value
   * @returns The bitwise operation result
   */
  bitwiseAnd(other: BytesCompat): bytes

  /**
   * Perform a bitwise OR operation with this bytes value and another bytes value
   *
   * The shorter of the two values will be zero-left extended to the larger length.
   * @param other The other bytes value
   * @returns The bitwise operation result
   */
  bitwiseOr(other: BytesCompat): bytes

  /**
   * Perform a bitwise XOR operation with this bytes value and another bytes value.
   *
   * The shorter of the two values will be zero-left extended to the larger length.
   * @param other The other bytes value
   * @returns The bitwise operation result
   */
  bitwiseXor(other: BytesCompat): bytes

  /**
   * Perform a bitwise INVERT operation with this bytes value
   * @returns The bitwise operation result
   */
  bitwiseInvert(): bytes

  /**
   * Compares this bytes value with another.
   * @param other The other bytes value
   * @returns True if both values represent the same byte sequence
   */
  equals(other: BytesCompat): boolean

  /**
   * Returns a copy of this bytes sequence
   */
  slice(): bytes
  /**
   * Returns a slice of this bytes sequence from the specified start to the end
   * @param start The index to start slicing from. Can be negative to count from the end.
   */
  slice(start: Uint64Compat): bytes
  /**
   * Returns a slice of this bytes sequence from the specified start to the specified end
   * @param start The index to start slicing from. Can be negative to count from the end.
   * @param end The index to end the slice. Can be negative to count from the end.
   */
  slice(start: Uint64Compat, end: Uint64Compat): bytes
  /**
   * @hidden
   */
  slice(start?: Uint64Compat, end?: Uint64Compat): bytes

  /**
   * Interpret this byte sequence as a utf-8 string
   */
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
 * @param hex A literal string of hexadecimal characters
 */
Bytes.fromHex = (hex: string): bytes => {
  throw new NoImplementation()
}
/**
 * Create a new bytes value from a base 64 encoded string
 * @param b64 A literal string of b64 encoded characters
 */
Bytes.fromBase64 = (b64: string): bytes => {
  throw new NoImplementation()
}

/**
 * Create a new bytes value from a base 32 encoded string
 * @param b32 A literal string of b32 encoded characters
 */
Bytes.fromBase32 = (b32: string): bytes => {
  throw new NoImplementation()
}

/**
 * An interface for types which are backed by the AVM bytes type
 */
export interface BytesBacked {
  /**
   * Retrieve the underlying bytes representing this value
   */
  get bytes(): bytes
}
