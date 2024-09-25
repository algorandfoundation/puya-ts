import { internal } from '@algorandfoundation/algo-ts'
import { createHash } from 'crypto'

export const padUint8Array = (arr: Uint8Array, padSize: number): Uint8Array => {
  const paddedUint8Array = new Uint8Array(arr.length + padSize).fill(0)
  arr.forEach((v, i) => (paddedUint8Array[padSize + i] = v))
  return paddedUint8Array
}

export const asUint8Array = (value: internal.primitives.StubBytesCompat): Uint8Array =>
  internal.primitives.BytesCls.fromCompat(value).asUint8Array()

export const getSha256Hash = (value: Uint8Array): Uint8Array => new Uint8Array(createHash('sha256').update(value).digest())

const NoValue = Symbol('no-value')
type LazyInstance<T> = () => T
export const Lazy = <T>(factory: () => T): LazyInstance<T> => {
  let val: T | typeof NoValue = NoValue

  return () => {
    if (val === NoValue) {
      val = factory()
    }
    return val
  }
}
