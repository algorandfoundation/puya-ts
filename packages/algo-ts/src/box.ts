import { bytes, uint64 } from './primitives'

export type Box<TValue> = {
  readonly key: bytes
  value: TValue

  readonly exists: boolean
  get(options: { default: TValue }): TValue
  delete(): boolean
  maybe(): readonly [TValue, boolean]
  readonly length: uint64
}

export type BoxMap<TKey, TValue> = {
  readonly keyPrefix: bytes
  get(key: TKey): TValue
  get(key: TKey, options: { default: TValue }): TValue
  set(key: TKey, value: TValue): void
  delete(key: TKey): boolean
  has(key: TKey): boolean
  maybe(key: TKey): readonly [TValue, boolean]
  length(key: TKey): uint64
}

export type BoxRef = {
  readonly key: bytes

  readonly exists: boolean
  value: bytes
  get(options: { default: bytes }): bytes
  put(value: bytes): bytes
  splice(start: uint64, end: uint64, value: bytes): void
  replace(start: uint64, value: bytes): void
  extract(start: uint64, length: uint64): bytes
  delete(): boolean
  create(options: { size: uint64 }): boolean
  resize(newSize: uint64): void
  maybe(): readonly [bytes, boolean]
  readonly length: uint64
}

export function Box<TValue>(options: { key: bytes | string }): Box<TValue> {
  throw new Error('Not implemented')
}

export function BoxMap<TKey, TValue>(options: { keyPrefix: bytes | string }): BoxMap<TKey, TValue> {
  throw new Error('Not implemented')
}

export function BoxRef(options: { key: bytes | string }): BoxRef {
  throw new Error('Not implemented')
}
