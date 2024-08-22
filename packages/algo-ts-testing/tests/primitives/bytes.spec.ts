import { bytes, Bytes, internal } from '@algorandfoundation/algo-ts';
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec';
import { createHash } from 'crypto';
import { describe, expect, it } from 'vitest';
import { MAX_BYTES_SIZE } from '../../src/constants';
import appSpecJson from '../artifacts/primitive-ops/data/PrimitiveOpsContract.arc32.json';
import { getAlgorandAppClient, getAvmResult, getAvmResultRaw } from '../avm-invoker';
import { padUint8Array } from '../util';

describe('Bytes', async () => {
  const appClient = await getAlgorandAppClient(appSpecJson as AppSpec)

  describe.each([
    ["", "", 0, 0],
    ["1", "", 0, 0],
    ["", "1", 0, 0],
    ["1", "1", 0, 0],
    ["", "0", 0, MAX_BYTES_SIZE - 1],
    ["0", "", MAX_BYTES_SIZE - 1, 0],
    ["1", "0", 0, MAX_BYTES_SIZE - 2],
    ["1", "0", MAX_BYTES_SIZE - 2, 0],
  ])('concat', async (a, b, padASize, padBSize) => {
    it(`${a} concat ${b}`, async () => {

      const uint8ArrayA = internal.encodingUtil.utf8ToUint8Array(a)
      const uint8ArrayB = internal.encodingUtil.utf8ToUint8Array(b)
      const avmResult = (await getAvmResultRaw(appClient, `verify_bytes_add`, uint8ArrayA, uint8ArrayB, padASize, padBSize))!

      const bytesA = Bytes(padUint8Array(uint8ArrayA, padASize))
      const bytesB = Bytes(padUint8Array(uint8ArrayB, padBSize))
      const result = bytesA.concat(bytesB)
      const resultUint8Array = (result as unknown as internal.primitives.BytesCls).asUint8Array()
      const resultHash = new Uint8Array(createHash('sha256').update(resultUint8Array).digest())
      expect(resultHash, `for values: ${a}, ${b}`).toEqual(avmResult)
    })
  })

  describe.each([
    ["", "", 1, MAX_BYTES_SIZE],
    ["1", "", 0, MAX_BYTES_SIZE],
    ["", "", MAX_BYTES_SIZE, MAX_BYTES_SIZE],
  ])('concat overflow', async (a, b, padASize, padBSize) => {
    it(`${a} concat ${b} overflows`, async () => {
      const uint8ArrayA = internal.encodingUtil.utf8ToUint8Array(a)
      const uint8ArrayB = internal.encodingUtil.utf8ToUint8Array(b)

      await expect(getAvmResultRaw(appClient, `verify_bytes_add`, uint8ArrayA, uint8ArrayB, padASize, padBSize)).rejects.toThrow(/concat produced a too big \(\d+\) byte-array/)

      const bytesA = Bytes(padUint8Array(uint8ArrayA, padASize))
      const bytesB = Bytes(padUint8Array(uint8ArrayB, padBSize))
      expect(() => bytesA.concat(bytesB)).toThrow(/Bytes length \d+ exceeds maximum length/)
    })
  })

  describe.each([
    'and',
    'or',
    'xor',
  ])('bitwise operators', async (op) => {
    const getStubResult = (a: bytes, b: bytes) => {
      switch (op) {
        case 'and': return a.bitwiseAnd(b)
        case 'or': return a.bitwiseOr(b)
        case 'xor': return a.bitwiseXor(b)
        default: throw new Error(`Unknown operator: ${op}`)
      }
    }
    describe.each([
      ["0", "0"],
      ["001", "11"],
      ["100", "11"],
      ["00", "111"],
      ["11", "001"],
      ["", "11"],
    ])(`bitwise ${op}`, async (a, b) => {

      it(`${a} bitwise ${op} ${b}`, async () => {
        const bytesA = Bytes(a)
        const bytesB = Bytes(b)

        const uint8ArrayA = internal.encodingUtil.utf8ToUint8Array(a)
        const uint8ArrayB = internal.encodingUtil.utf8ToUint8Array(b)
        const avmResult = (await getAvmResultRaw(appClient, `verify_bytes_${op}`, uint8ArrayA, uint8ArrayB))!
        let result = getStubResult(bytesA, bytesB)
        let resultUint8Array = (result as unknown as internal.primitives.BytesCls).asUint8Array()
        expect(resultUint8Array, `for values: ${a}, ${b}`).toEqual(avmResult)
      })
    })
  })

  describe.each([
    ["0", 0],
    ["1", 0],
    ["1010", 0],
    ["11100", MAX_BYTES_SIZE - 5],
    ["", MAX_BYTES_SIZE],
  ])('bitwise invert', async (a, padSize) => {
    it(`~${a}`, async () => {
      const uint8ArrayA = internal.encodingUtil.utf8ToUint8Array(a)
      const avmResult = (await getAvmResultRaw(appClient, `verify_bytes_not`, uint8ArrayA, padSize))!

      const bytesA = Bytes(padUint8Array(uint8ArrayA, padSize))
      let result = bytesA.bitwiseInvert()
      let resultUint8Array = (result as unknown as internal.primitives.BytesCls).asUint8Array()
      const resultHash = new Uint8Array(createHash('sha256').update(resultUint8Array).digest())

      expect(resultHash, `for value: ${a}`).toEqual(avmResult)
    })
  })

  describe.each([
    ["0", "0"],
    ["", ""],
    ["11", "11"],
    ["011", "11"],
    ["11", "001"],
    ["", "00"],
  ])('equals', async (a, b) => {
    it(`${a} equals ${b}`, async () => {
      const bytesA = Bytes(a)
      const bytesB = Bytes(b)
      const uint8ArrayA = internal.encodingUtil.utf8ToUint8Array(a)
      const uint8ArrayB = internal.encodingUtil.utf8ToUint8Array(b)

      const avmResult = await getAvmResult<boolean>(appClient, `verify_bytes_eq`, uint8ArrayA, uint8ArrayB)
      let result = bytesA.equals(bytesB)
      expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)
    })
  })

  describe.each([
    ["0", "0"],
    ["", ""],
    ["11", "11"],
    ["011", "11"],
    ["11", "001"],
    ["", "00"],
  ])('not equals', async (a, b) => {
    it(`${a} not equals ${b}`, async () => {
      const bytesA = Bytes(a)
      const bytesB = Bytes(b)
      const uint8ArrayA = internal.encodingUtil.utf8ToUint8Array(a)
      const uint8ArrayB = internal.encodingUtil.utf8ToUint8Array(b)

      const avmResult = await getAvmResult<boolean>(appClient, `verify_bytes_ne`, uint8ArrayA, uint8ArrayB)
      let result = !bytesA.equals(bytesB)
      expect(result, `for values: ${a}, ${b}`).toEqual(avmResult)
    })
  })

  describe('from encoded string', () => {
    it('hex', () => {
      const hex = 'FF'
      const bytes = Bytes.fromHex(hex)
      const resultUint8Array = (bytes as unknown as internal.primitives.BytesCls).asUint8Array()
      expect(resultUint8Array).toEqual(Uint8Array.from([0xFF]))
    })

    it('base64', () => {
      const base64 = '/w=='
      const bytes = Bytes.fromBase64(base64)
      const resultUint8Array = (bytes as unknown as internal.primitives.BytesCls).asUint8Array()
      expect(resultUint8Array).toEqual(Uint8Array.from([0xFF]))
    })

    it('base32', () => {
      const base32 = '74======'
      const bytes = Bytes.fromBase32(base32)
      const resultUint8Array = (bytes as unknown as internal.primitives.BytesCls).asUint8Array()
      expect(resultUint8Array).toEqual(Uint8Array.from([0xFF]))
    })
  })

  describe.each([
    MAX_BYTES_SIZE + 1,
    MAX_BYTES_SIZE * 2,
  ])('value overflows', (size) => {
    it(`${size} bytes`, () => {
      const a = new Uint8Array(size).fill(0)
      expect(() => Bytes(a)).toThrow(/Bytes length \d+ exceeds maximum length/)
    })
  })

  describe.each([
    [undefined, new Uint8Array(0)],
    ['ABC', new Uint8Array([0x41, 0x42, 0x43])],
    [new Uint8Array([0xFF, 0x00]), new Uint8Array([0xFF, 0x00])],
  ])('fromCompat', (a, b) => {
    it(`${a} fromCompat`, async () => {
      const result = internal.primitives.BytesCls.fromCompat(a)
      expect(result.asUint8Array()).toEqual(b)
    })
  })
})
