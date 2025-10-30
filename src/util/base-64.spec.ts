import { Buffer } from 'node:buffer'
import { describe, expect, test } from 'vitest'
import { base64ToUint8Array, uint8ArrayToBase64 } from './base-64'
import { utf8ToUint8Array } from './index'

describe('base-64', () => {
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
    const expected = Buffer.from(source).toString('base64')

    expect(uint8ArrayToBase64(Uint8Array.from(source))).toBe(expected)

    const decoded = base64ToUint8Array(expected)

    expect(decoded).toStrictEqual(Uint8Array.from(source))
  })
  test.each([
    ['**', 'Invalid character * at position 0'],
    ['abcdef;', 'Invalid character ; at position 6'],
    ['notpadded', 'Invalid length for base64 string'],
  ])('%s encodes and decodes', async (source: string, errorMessage: string) => {
    await expect(async () => base64ToUint8Array(source)).rejects.toThrowError(errorMessage)
  })
})
