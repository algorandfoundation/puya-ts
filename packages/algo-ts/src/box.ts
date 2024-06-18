import { bytes, uint64 } from './primitives'

type Box<TValue> = {
  readonly key: bytes
  value: TValue

  readonly exists: boolean
  get(options: { default: TValue }): TValue
  maybe(): readonly [TValue, boolean]
  readonly length: uint64
}

type BoxMap<TKey, TValue> = {
  readonly keyPrefix: bytes
  get(key: TKey, options: { default: TValue }): TValue
  set(key: TKey, value: TValue): void
  has(key: TKey): boolean
  maybe(key: TKey): readonly [TValue, boolean]
  length(key: TKey): uint64
}

type BoxRef = {
  readonly key: bytes

  readonly exists: boolean
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

export function Box<TValue>(options: { key: bytes }): Box<TValue> {
  throw new Error('Not implemented')
}

export function BoxMap<TKey, TValue>(options: { keyPrefix: bytes }): BoxMap<TKey, TValue> {
  throw new Error('Not implemented')
}

export function BoxRef(options: { key: bytes }): BoxRef {
  throw new Error('Not implemented')
}
