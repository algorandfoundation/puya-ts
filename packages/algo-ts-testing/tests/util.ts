import { biguint, Bytes, bytes, internal, uint64 } from '@algorandfoundation/algo-ts'
import { createHash } from 'crypto'

export const padUint8Array = (arr: Uint8Array, padSize: number): Uint8Array => {
  const paddedUint8Array = new Uint8Array(arr.length + padSize).fill(0)
  arr.forEach((v, i) => paddedUint8Array[padSize + i] = v)
  return paddedUint8Array
}

export const asUint8Array = (value: internal.primitives.StubBytesCompat): Uint8Array => internal.primitives.BytesCls.fromCompat(value).asUint8Array()

export const asUint64Cls = (val: uint64) => val as unknown as internal.primitives.Uint64Cls

export const asBigUintCls = (val: biguint) => val as unknown as internal.primitives.BigUintCls

export const asBytesCls = (val: bytes) => val as unknown as internal.primitives.BytesCls

export const base64Encode = (value: Uint8Array | string): bytes => Bytes(Buffer.from(value).toString('base64'))

export const base64UrlEncode = (value: Uint8Array | string): bytes => Bytes(Buffer.from(value).toString('base64url'))

export const getSha256Hash = (value: Uint8Array): Uint8Array => new Uint8Array(createHash('sha256').update(value).digest())

export const getPaddedUint8Array = (padSize: number, value: internal.primitives.StubBytesCompat): Uint8Array => {
  const uint8ArrayValue = asUint8Array(value)
  const result = new Uint8Array(padSize + uint8ArrayValue.length)
  result.set([...Array(padSize).fill(0x00), ...uint8ArrayValue])
  return result
}
