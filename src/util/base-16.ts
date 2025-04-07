/*
 * Base 16 encode to/decode from Uint8Array type.
 *
 * We don't use Node's Uint8Array.from(Buffer.from(value, 'hex')) as it ignores invalid characters rather than erroring!
 */

const charToNum = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  A: 10,
  a: 10,
  B: 11,
  b: 11,
  C: 12,
  c: 12,
  D: 13,
  d: 13,
  E: 14,
  e: 14,
  F: 15,
  f: 15,
}
const numToChar: Record<number, string> = {
  0: '0',
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: 'A',
  11: 'B',
  12: 'C',
  13: 'D',
  14: 'E',
  15: 'F',
}

function getNum(c: string, pos: number): number {
  if (c in charToNum) {
    return charToNum[c as keyof typeof charToNum]
  }
  throw new Error(`Invalid character ${c} at position ${pos}`)
}

export function uint8ArrayToHex(input: Uint8Array): string {
  let result = ''
  for (const byte of input) {
    const l = numToChar[byte & 0x0f]
    const h = numToChar[(byte & 0xf0) >> 4]
    result += `${h}${l}`
  }
  return result
}

export function hexToUint8Array(input: string): Uint8Array {
  const len = input.length / 2
  if (len % 1 !== 0) {
    throw new Error('Invalid length for base16 string')
  }
  const res = new Uint8Array(len)
  let writeIndex = 0
  for (let readIndex = 0; readIndex < input.length; readIndex++) {
    const h = getNum(input[readIndex], readIndex)
    const l = getNum(input[++readIndex], readIndex)
    res[writeIndex++] = (h << 4) + l
  }
  return res
}
