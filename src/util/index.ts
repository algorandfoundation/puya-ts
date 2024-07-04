import { CodeError } from '../errors'
import { SourceLocation } from '../awst/source-location'
import { TextDecoder } from 'node:util'
import { Buffer } from 'node:buffer'
export { base32ToUint8Array, uint8ArrayToBase32 } from './base-32'
class InvariantError extends Error {}
export function invariant(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new InvariantError(message)
  }
}

export function codeInvariant(condition: unknown, message: string, sourceLocation?: SourceLocation): asserts condition {
  if (!condition) {
    throw new CodeError(message, {
      sourceLocation,
    })
  }
}

export const convertEnum = <TEnumIn, TEnumOut, TKeys extends string>(
  value: TEnumIn,
  fromEnum: Record<TKeys, TEnumIn>,
  toEnum: Record<TKeys, TEnumOut>,
): TEnumOut => {
  const keyOfValue = Object.entries(fromEnum).find(([, v]) => v === value)?.[0]
  if (!keyOfValue) {
    // missing value
    throw new Error(`key missing: ${value}`)
  }
  return toEnum[keyOfValue as keyof typeof toEnum]
}

export const tryConvertEnum = <TEnumIn, TEnumOut, TKeys extends string>(
  value: TEnumIn,
  fromEnum: Record<TKeys, TEnumIn>,
  toEnum: Record<string, TEnumOut>,
): TEnumOut | undefined => {
  const keyOfValue = Object.entries(fromEnum).find(([, v]) => v === value)?.[0]
  if (!keyOfValue) {
    return undefined
  }
  return toEnum[keyOfValue as keyof typeof toEnum]
}

export const expandMaybeArray = <T>(maybeArray: T | T[]): T[] => {
  return Array.isArray(maybeArray) ? maybeArray : [maybeArray]
}

export const hexToUint8Array = (value: string): Uint8Array => {
  invariant(value.length % 2 === 0, 'Hex string must have even number of characters')
  return new Uint8Array(new Array(value.length / 2).fill(0).map((_, i) => parseInt(value.slice(i * 2, i * 2 + 1), 16)))
}
export const base64ToUint8Array = (value: string): Uint8Array => {
  return new Uint8Array(Buffer.from(value, 'base64'))
}

export const utf8ToUint8Array = (value: string): Uint8Array => {
  const encoder = new TextEncoder()
  return encoder.encode(value)
}

export const uint8ArrayToUtf8 = (value: Uint8Array): string => {
  const decoder = new TextDecoder()
  return decoder.decode(value)
}

export const hasFlags = <T extends number>(value: T, flags: T): boolean => (value & flags) === flags
export const hasAnyFlag = <T extends number>(value: T, flags: T): boolean => Boolean(value & flags)

export function* enumerate<T>(iterable: Iterable<T>): IterableIterator<readonly [number, T]> {
  let i = 0
  for (const item of iterable) {
    yield [i, item]
    i++
  }
}
