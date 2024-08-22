import { biguint, BigUint, Bytes, bytes, internal, uint64, Uint64 } from '@algorandfoundation/algo-ts'

export const padUint8Array = (arr: Uint8Array, padSize: number): Uint8Array => {
  const paddedUint8Array = new Uint8Array(arr.length + padSize).fill(0)
  arr.forEach((v, i) => paddedUint8Array[padSize + i] = v)
  return paddedUint8Array
}

export const asUint8Array = (value: bytes): Uint8Array => {
  return asBytesCls(value).asUint8Array()
}

export const asUint64 = (val: bigint | number) => (typeof val === 'bigint' ? Uint64(val) : Uint64(val))

export const asUint64Cls = (val: uint64) => val as unknown as internal.primitives.Uint64Cls

export const asBigUint = (val: bigint | number) => (typeof val === 'bigint' ? BigUint(val) : BigUint(val))

export const asBigUintCls = (val: biguint) => val as unknown as internal.primitives.BigUintCls

export const asBytesCls = (val: bytes) => val as unknown as internal.primitives.BytesCls

export const base64Encode = (value: Uint8Array | string): bytes => Bytes(Buffer.from(value).toString('base64'))

export const base64UrlEncode = (value: Uint8Array | string): bytes => Bytes(Buffer.from(value).toString('base64url'))
