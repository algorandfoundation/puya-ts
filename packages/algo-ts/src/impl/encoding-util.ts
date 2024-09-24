import { TextDecoder } from 'node:util'
import { AvmError } from './errors'

export const uint8ArrayToBigInt = (v: Uint8Array): bigint => {
  // Assume big-endian
  return Array.from(v)
    .toReversed()
    .map((byte_value, i): bigint => BigInt(byte_value) << BigInt(i * 8))
    .reduce((a, b) => a + b, 0n)
}

export const bigIntToUint8Array = (val: bigint, fixedSize: number | 'dynamic' = 'dynamic'): Uint8Array => {
  if (val === 0n && fixedSize === 'dynamic') {
    return new Uint8Array(0)
  }
  const maxBytes = fixedSize === 'dynamic' ? undefined : fixedSize

  let hex = val.toString(16)

  // Pad the hex with zeros so it matches the size in bytes
  if (fixedSize !== 'dynamic' && hex.length !== fixedSize * 2) {
    hex = hex.padStart(fixedSize * 2, '0')
  } else if (hex.length % 2 == 1) {
    // Pad to 'whole' byte
    hex = `0${hex}`
  }
  if (maxBytes && hex.length > maxBytes * 2) {
    throw new AvmError(`Cannot encode ${val} as ${maxBytes} bytes as it would overflow`)
  }
  const byteArray = new Uint8Array(hex.length / 2)
  for (let i = 0, j = 0; i < hex.length / 2; i++, j += 2) {
    byteArray[i] = parseInt(hex.slice(j, j + 2), 16)
  }
  return byteArray
}

export const utf8ToUint8Array = (value: string): Uint8Array => {
  const encoder = new TextEncoder()
  return encoder.encode(value)
}

export const uint8ArrayToUtf8 = (value: Uint8Array): string => {
  const decoder = new TextDecoder()
  return decoder.decode(value)
}

export const uint8ArrayToHex = (value: Uint8Array): string => Buffer.from(value).toString('hex')

export const uint8ArrayToBase64 = (value: Uint8Array): string => Buffer.from(value).toString('base64')

export const uint8ArrayToBase64Url = (value: Uint8Array): string => Buffer.from(value).toString('base64url')

export { uint8ArrayToBase32 } from './base-32'
