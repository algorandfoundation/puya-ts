import { Buffer } from 'node:buffer'
import { describe, expect, test } from 'vitest'
import { hexToUint8Array, uint8ArrayToHex } from './base-16'
import { utf8ToUint8Array } from './index'

describe('base-16', () => {
  test.each([
    [[]],
    [[0]],
    [[255]],
    [[0, 1, 2, 3, 4]],
    [[23, 53, 2, 53, 65]],
    [[255, 255, 255, 255, 255]],
    [utf8ToUint8Array('kjasdfkjldsafklasdfklsdfklase')],
    [utf8ToUint8Array('abc')],
    [utf8ToUint8Array('43 t5bzxzgdfgasdfsd')],
    [utf8ToUint8Array('kjnkdsfvv,xm,vc.zlsdkvslkdfkldsflksdflaksdfksfkldslkdssds')],
  ])('%s encodes and decodes', (source: number[] | Uint8Array) => {
    const expected = Buffer.from(source).toString('hex').toUpperCase()

    expect(uint8ArrayToHex(Uint8Array.from(source))).toBe(expected)

    const decoded = hexToUint8Array(expected)

    expect(decoded).toStrictEqual(Uint8Array.from(source))
  })
  test.each([
    ['**', 'Invalid character * at position 0'],
    ['0123gg', 'Invalid character g at position 4'],
    ['abcdef;', 'Invalid length for base16 string'],
    ['notpadded', 'Invalid length for base16 string'],
  ])('%s encodes and decodes', async (source: string, errorMessage: string) => {
    await expect(async () => hexToUint8Array(source)).rejects.toThrowError(errorMessage)
  })
})
