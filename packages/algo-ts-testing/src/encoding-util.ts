import { TextDecoder } from 'node:util'
import { AvmError } from './internal'

export const uint8ArrayToBigInt = (v: Uint8Array): bigint => {
  // Assume big-endian
  return Array.from(v)
    .toReversed()
    .map((byte_value, i): bigint => BigInt(byte_value) << BigInt(i * 8))
    .reduce((a, b) => a + b, 0n)
}

export const bigIntToUint8Array = (val: bigint, fixedSize: number | 'dynamic' = 'dynamic'): Uint8Array => {
  const maxBytes = fixedSize == 'dynamic' ? 64 : fixedSize

  let hex = val.toString(16)

  // Pad the hex with zeros so it matches the size in bytes
  if (fixedSize !== 'dynamic' && hex.length !== fixedSize * 2) {
    hex = hex.padStart(fixedSize * 2, '0')
  } else if (hex.length % 2 == 1) {
    // Pad to 'whole' byte
    hex = `0${hex}`
  }
  if (hex.length > maxBytes * 2) {
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

export const uint8ArrayToHex = (value: Uint8Array): string => {
  return Buffer.from(value).toString('hex')
}
