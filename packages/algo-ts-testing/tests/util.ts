import { BigUint, bytes, internal, Uint64 } from '@algorandfoundation/algo-ts'

export const padUint8Array = (arr: Uint8Array, padSize: number): Uint8Array => {
  const paddedUint8Array = new Uint8Array(arr.length + padSize).fill(0)
  arr.forEach((v, i) => paddedUint8Array[padSize + i] = v)
  return paddedUint8Array
}

export const asUint8Array = (value: bytes): Uint8Array => {
  return (value as unknown as internal.primitives.BytesCls).asUint8Array()
}

export const asUint64 = (val: bigint | number) => (typeof val === 'bigint') ? Uint64(val) : Uint64(val)

export const asBigUint = (val: bigint | number) => (typeof val === 'bigint') ? BigUint(val) : BigUint(val)
