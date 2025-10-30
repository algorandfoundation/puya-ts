import { describe, expect, it } from 'vitest'
import { base32ToUint8Array, uint8ArrayToBase32 } from './base-32'
import { hexToUint8Array } from './index'

describe('base-32 encoding', () => {
  const ZERO_ADDRESS = 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ'
  it(`Zero address should be ${ZERO_ADDRESS}`, () => {
    const publicKey = new Uint8Array(32)
    const hash = hexToUint8Array('0C74E554')
    const zeroAddressBytes = new Uint8Array([...publicKey, ...hash])
    //const zeroAddressBytes = hexToUint8Array('00000000000000000000000000000000000000000000000000000000000000000c74e554')
    const addressStr = uint8ArrayToBase32(zeroAddressBytes)
    expect(addressStr).toBe(ZERO_ADDRESS)
  })

  describe('encode and decode should return same value', () => {
    it.each([
      [new Uint8Array()],
      [new Uint8Array([1])],
      [new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8])],
      [new Uint8Array(32)],
      [new Uint8Array(36)],
    ])('%s', (value) => {
      const encoded = uint8ArrayToBase32(value)

      const decoded = base32ToUint8Array(encoded)

      expect(decoded).toStrictEqual(value)
    })
  })
})
