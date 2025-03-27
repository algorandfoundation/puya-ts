import { Buffer } from 'node:buffer'
import fs from 'node:fs'
import { TextDecoder } from 'node:util'
import upath from 'upath'
import type { SourceLocation } from '../awst/source-location'
import { Constants } from '../constants'
import { CodeError, InternalError } from '../errors'
import type { DeliberateAny } from '../typescript-helpers'

export { base32ToUint8Array, uint8ArrayToBase32 } from './base-32'

class InvariantError extends InternalError {}

/**
 * Checks an invariant condition hold true. If this check fails it indicates the compiler is in an unstable state. For invariants related to
 * user code, use codeInvariant below.
 *
 * @param condition
 * @param message
 * @param sourceLocation
 */
export function invariant(condition: unknown, message: string, sourceLocation?: SourceLocation): asserts condition {
  if (!condition) {
    throw new InvariantError(message, { sourceLocation })
  }
}

/**
 * Checks an invariant related to user code holds true. If this check fails it indicates the user code is not valid. For invariants the user
 * has no control over, use invariant above.
 * @param condition
 * @param message
 * @param sourceLocation
 */
export function codeInvariant(condition: unknown, message: string, sourceLocation?: SourceLocation): asserts condition {
  if (!condition) {
    throw new CodeError(message, {
      sourceLocation,
    })
  }
}

export const enumFromValue = <TValue, TEnum extends TValue>(
  value: TValue,
  enumType: Record<string, TEnum | string>,
  message: string = 'Invalid enum value: ',
) => {
  if (Object.values(enumType).some((v) => v === value)) {
    return value as TEnum
  }
  throw new Error(`${message} ${value}`)
}

export const enumKeyFromValue = <TValue, TEnum extends TValue>(
  value: TValue,
  enumType: Record<string, TEnum>,
  message: string = 'Invalid enum value: ',
) => {
  const key = Object.entries(enumType).find(([_, v]) => v === value)?.[0]
  if (key) {
    return key
  }
  throw new Error(`${message} ${value}`)
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

export const uint8ArrayToBase64 = (value: Uint8Array): string => Buffer.from(value).toString('base64')

export const hexToUint8Array = (value: string): Uint8Array => {
  invariant(value.length % 2 === 0, 'Hex string must have even number of characters')
  return Uint8Array.from(Buffer.from(value, 'hex'))
}

export const base64ToUint8Array = (value: string): Uint8Array => {
  return Uint8Array.from(Buffer.from(value, 'base64'))
}

export const utf8ToUint8Array = (value: string): Uint8Array => {
  const encoder = new TextEncoder()
  return encoder.encode(value)
}

export const uint8ArrayToBigInt = (v: Uint8Array): bigint => {
  // Assume big-endian
  return Array.from(v)
    .toReversed()
    .map((byte_value, i): bigint => BigInt(byte_value) << BigInt(i * 8))
    .reduce((a, b) => a + b, 0n)
}

export const uint8ArrayToHex = (value: Uint8Array): string => Buffer.from(value).toString('hex')

export const uint8ArrayToUtf8 = (value: Uint8Array): string => {
  const decoder = new TextDecoder()
  return decoder.decode(value)
}

export const bigIntToUint8Array = (val: bigint, fixedSize: number | 'dynamic' = 'dynamic'): Uint8Array => {
  if (val === 0n && fixedSize === 'dynamic') {
    return new Uint8Array(0)
  }
  const maxBytes = fixedSize === 'dynamic' ? 4096 : fixedSize

  let hex = val.toString(16)

  // Pad the hex with zeros so it matches the size in bytes
  if (fixedSize !== 'dynamic' && hex.length !== fixedSize * 2) {
    hex = hex.padStart(fixedSize * 2, '0')
  } else if (hex.length % 2 === 1) {
    // Pad to 'whole' byte
    hex = `0${hex}`
  }
  if (hex.length > maxBytes * 2) {
    throw new InternalError(`Cannot encode ${val} as ${maxBytes} bytes as it would overflow`)
  }
  const byteArray = new Uint8Array(hex.length / 2)
  for (let i = 0, j = 0; i < hex.length / 2; i++, j += 2) {
    byteArray[i] = parseInt(hex.slice(j, j + 2), 16)
  }
  return byteArray
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
  const isWindows = process.platform === 'win32'
  const localPackageName = /packages\/algo-ts\/dist\/(.*)$/.exec(filePath)
  if (localPackageName) {
    return `${Constants.algoTsPackage}/${localPackageName[1]}`
  }
  const nodeModuleName = /.*\/node_modules\/(.*)$/.exec(filePath)
  if (nodeModuleName) {
    return nodeModuleName[1]
  }

  const cwd = upath.normalize(`${workingDirectory}/`)
  const normalizedPath = upath.normalize(filePath)
  const moduleName = startsWith(normalizedPath, cwd, isWindows) ? normalizedPath.slice(cwd.length) : normalizedPath
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
/**
 * Can be used to filter a collection to a set of distinct items as determined by a specified key.
 * @param keySelector A lambda which when given an item, returns the items unique identifier
 *
 * Usage:
 *
 * ```
 * const distinctItems = nonDistinctItems.filter(distinct(x => x.uniqueId))
 * ```
 */
export const distinct = <T>(keySelector?: (item: T) => unknown) => {
  const ks = keySelector || ((x: T) => x)
  const set = new Set()
  return (item: T) => {
    if (set.has(ks(item))) {
      return false
    }

    set.add(ks(item))
    return true
  }
}

export const distinctByEquality = <T>(areEqual: (a: T, b: T) => boolean) => {
  const set: T[] = []
  return (item: T) => {
    if (set.some((s) => areEqual(s, item))) return false
    set.push(item)
    return true
  }
}

export function mkDirIfNotExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export const zipStrict = <T1, T2>(array1: T1[], array2: T2[]): [T1, T2][] => {
  invariant(array1.length === array2.length, 'Array lengths must match')
  return array1.map((t1, idx) => [t1, array2[idx]])
}

export function isIn<TSubject, TItem extends TSubject>(subject: TSubject, items: readonly TItem[]): subject is TItem {
  return items.some((i) => i === subject)
}

export function joinUint8Arrays(...arrays: Uint8Array[]): Uint8Array {
  const length = arrays.reduce((acc, cur) => acc + cur.length, 0)
  const result = new Uint8Array(length)
  let offset = 0
  for (const a of arrays) {
    result.set(a, offset)
    offset += a.length
  }
  return result
}

export function startsWith(str: string, prefix: string, ignoreCase = false): boolean {
  if (ignoreCase) {
    return str.toLowerCase().startsWith(prefix.toLowerCase())
  }
  return str.startsWith(prefix)
}
