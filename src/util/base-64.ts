/*
Base 64 encode from/decode to Uint8Array.

We don't use Node's Uint8Array.from(Buffer.from(value, 'base64')) as it ignores invalid characters rather than erroring!

Adapted from https://github.com/mathiasbynens/base64/blob/master/src/base64.js
 */

import { throwError } from '../errors'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('')

const charToNum = new Map([...alphabet.entries()].map(([i, c]) => [c, i]))
const numToChar = new Map(alphabet.entries())

function getCharForNum(n: number): string {
  return numToChar.get(n) ?? throwError(new Error(`${n} is outside of the base 64 char range`))
}

export function base64ToUint8Array(input: string): Uint8Array {
  let length = input.length
  if (length % 4 === 0) {
    input = input.replace(/==?$/, '')
    length = input.length
  }
  if (length % 4 === 1) {
    throw new Error('Invalid length for base64 string.')
  }

  let bitCounter = 0
  let bitStorage = 0
  const output = new Uint8Array(Math.floor((length / 4) * 3))
  let outCounter = 0
  let position = -1
  while (++position < length) {
    const c = input.charAt(position)
    const buffer = charToNum.get(c) ?? throwError(new Error(`Invalid character ${c} at position ${position}`))
    bitStorage = bitCounter % 4 ? bitStorage * 64 + buffer : buffer
    // Unless this is the first of a group of 4 characters…
    if (bitCounter++ % 4) {
      // convert the first 8 bits to a single ASCII character.
      output[outCounter++] = 0xff & (bitStorage >> ((-2 * bitCounter) & 6))
    }
  }
  return output
}

export function uint8ArrayToBase64(input: Uint8Array) {
  const padding = input.length % 3
  let output = ''
  let position = -1
  let a
  let b
  let c
  let buffer
  // Make sure any padding is handled outside the loop.
  const length = input.length - padding

  while (++position < length) {
    // Read three bytes, i.e. 24 bits.
    a = input[position] << 16
    b = input[++position] << 8
    c = input[++position]
    buffer = a + b + c
    // Turn the 24 bits into four chunks of 6 bits each, and append the
    // matching character for each of them to the output.
    output +=
      getCharForNum((buffer >> 18) & 0x3f) +
      getCharForNum((buffer >> 12) & 0x3f) +
      getCharForNum((buffer >> 6) & 0x3f) +
      getCharForNum(buffer & 0x3f)
  }

  if (padding === 2) {
    a = input[position] << 8
    b = input[++position]
    buffer = a + b
    output += `${getCharForNum(buffer >> 10) + getCharForNum((buffer >> 4) & 0x3f) + getCharForNum((buffer << 2) & 0x3f)}=`
  } else if (padding === 1) {
    buffer = input[position]
    output += `${getCharForNum(buffer >> 2) + getCharForNum((buffer << 4) & 0x3f)}==`
  }

  return output
}
