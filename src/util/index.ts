import { CodeError } from '../errors'
import { SourceLocation } from '../awst/source-location'
import { TextDecoder } from 'node:util'
import { Buffer } from 'node:buffer'
import { DeliberateAny } from '../typescript-helpers'
import path from 'node:path'
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
export const intersectsFlags = <T extends number>(value: T, flags: T): boolean => Boolean(value & flags)

export function* enumerate<T>(iterable: Iterable<T>): IterableIterator<readonly [number, T]> {
  let i = 0
  for (const item of iterable) {
    yield [i, item]
    i++
  }
}

export function toSubScript(num: number) {
  const subNumbers = ['\u2080', '\u2081', '\u2082', '\u2083', '\u2084', '\u2085', '\u2086', '\u2087', '\u2088', '\u2089']
  return num
    .toFixed(0)
    .split('')
    .map((x) => subNumbers[parseInt(x)])
    .join('')
}

export function instanceOfAny<T extends Array<{ new (...args: DeliberateAny[]): DeliberateAny }>>(
  x: unknown,
  ...types: T
): x is InstanceType<T[number]> {
  return types.some((t) => x instanceof t)
}

/**
 * Normalise a file path to only include relevant segments.
 *
 *  - Anything in /node_modules/ is truncated to <package-name>/path.ext
 *  - Anything in workingDirectory is truncated relative to the workingDirectory
 *  - Forward slashes are used to segment paths
 * @param filePath
 * @param workingDirectory
 */
export function normalisePath(filePath: string, workingDirectory: string): string {
  const nodeModuleName = /node_modules\/(.*)$/.exec(filePath)

  if (nodeModuleName) {
    return nodeModuleName[1]
  }
  const cwd = path.normalize(`${workingDirectory}/`)
  const normalizedPath = path.normalize(filePath)
  const moduleName = normalizedPath.startsWith(cwd) ? normalizedPath.slice(cwd.length) : normalizedPath
  return moduleName.replaceAll('\\', '/')
}

type SortDir = 'asc' | 'desc'
export const sortBy =
  <T, TKey>(keySelector: (item: T) => TKey, dir: SortDir = 'asc') =>
  (a: T, b: T) => {
    const keyA = keySelector(a)
    const keyB = keySelector(b)
    return (dir === 'desc' ? -1 : 1) * (keyA < keyB ? -1 : keyA > keyB ? 1 : 0)
  }
