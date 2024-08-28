import { BigUint, Bytes, internal, Uint64, uint64 } from '@algorandfoundation/algo-ts'
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import { afterEach } from 'node:test'
import { describe, expect, it, test } from 'vitest'
import { TestExecutionContext } from '../src'
import { MAX_BYTES_SIZE, MAX_UINT512, MAX_UINT64 } from '../src/constants'
import * as op from '../src/impl/pure'
import appSpecJson from './artifacts/miscellaneous-ops/data/MiscellaneousOpsContract.arc32.json'
import { getAlgorandAppClient, getAvmResult, getAvmResultRaw } from './avm-invoker'
import { asBigUintCls, asBytesCls, asUint8Array, base64Encode, base64UrlEncode, getPaddedUint8Array, getSha256Hash } from './util'

const avm_int_arg_overflow_error = "is not a non-negative int or too big to fit in size"
const sqrtMaxUint64 = 4294967295n

describe('Pure op codes', async () => {
  const appClient = await getAlgorandAppClient(appSpecJson as AppSpec)
  const ctx = new TestExecutionContext()

  afterEach(async () => {
    ctx.reset()
  })

  describe('addw', async () => {
    test.each([
      [0, 0],
      [0, MAX_UINT64],
      [MAX_UINT64, 0],
      [1, 0],
      [0, 1],
      [100, 42],
      [1, MAX_UINT64 - 1n],
      [MAX_UINT64 - 1n, 1],
      [100, MAX_UINT64],
      [MAX_UINT64, MAX_UINT64],
    ])('should add two uint64 values', async (a, b) => {
      const avmResult = await getAvmResult<uint64[]>(appClient, 'verify_addw', a, b)
      const result = op.addw(a, b)
      expect(result[0].valueOf()).toBe(avmResult[0])
      expect(result[1].valueOf()).toBe(avmResult[1])
    })

    test.each([
      [1, MAX_UINT64 + 1n],
      [MAX_UINT64 + 1n, 1],
      [0, MAX_UINT512],
      [MAX_UINT512 * 2n, 0],
    ])('should throw error when input overflows', async (a, b) => {
      await expect(getAvmResultRaw(appClient, 'verify_addw', a, b)).rejects.toThrow(avm_int_arg_overflow_error)
      expect(() => op.addw(a, b)).toThrow('Uint64 over or underflow')
    })
  })

  describe('base64Decode', async () => {
    test.each([
      base64Encode(""),
      base64Encode("abc"),
      base64Encode("hello, world."),
      base64Encode("0123."),
      base64Encode(new Uint8Array([0xff])),
      base64Encode(new Uint8Array(Array(256).fill(0x00).concat([0xff]))),
    ])('should decode standard base64 string', async (a) => {
      const avmResult = (await getAvmResultRaw(appClient, 'verify_base64_decode_standard', asUint8Array(a)))!
      const result = op.base64Decode(internal.opTypes.Base64.StdEncoding, a)
      expect(asBytesCls(result).asUint8Array()).toEqual(avmResult)
    })

    test.each([
      Bytes(new Uint8Array(Array(256).fill(0x00).concat([0xff]))),
      asBigUintCls(BigUint(MAX_UINT512)).toBytes().asAlgoTs(),
    ])('should throw error when input is not a valid base64 string', async (a) => {
      await expect(getAvmResultRaw(appClient, 'verify_base64_decode_standard', asUint8Array(a))).rejects.toThrow('illegal base64 data at input byte 0')
      expect(() => op.base64Decode(internal.opTypes.Base64.StdEncoding, a)).toThrow('illegal base64 data')
    })

    test.each([
      base64UrlEncode(""),
      base64UrlEncode("abc"),
      base64UrlEncode("hello, world."),
      base64UrlEncode("0123."),
      base64UrlEncode(new Uint8Array([0xff])),
      base64UrlEncode(new Uint8Array(Array(256).fill(0x00).concat([0xff]))),
    ])('should decode base64url string', async (a) => {
      const avmResult = (await getAvmResultRaw(appClient, 'verify_base64_decode_url', asUint8Array(a)))!
      const result = op.base64Decode(internal.opTypes.Base64.URLEncoding, a)
      expect(asBytesCls(result).asUint8Array()).toEqual(avmResult)
    })

    test.each([
      Bytes(new Uint8Array(Array(256).fill(0x00).concat([0xff]))),
      asBigUintCls(BigUint(MAX_UINT512)).toBytes().asAlgoTs(),
    ])('should throw error when input is not a valid base64url string', async (a) => {
      await expect(getAvmResultRaw(appClient, 'verify_base64_decode_url', asUint8Array(a))).rejects.toThrow('illegal base64 data')
      expect(() => op.base64Decode(internal.opTypes.Base64.URLEncoding, a)).toThrow('illegal base64 data')
    })
  })

  describe('bitLength', async () => {
    test.each([
      [Bytes(internal.encodingUtil.bigIntToUint8Array(0n)), 0],
      [Bytes(internal.encodingUtil.bigIntToUint8Array(1n)), 0],
      [Bytes(internal.encodingUtil.bigIntToUint8Array(MAX_UINT64)), 0],
      [Bytes(internal.encodingUtil.bigIntToUint8Array(MAX_UINT512)), 0],
      [Bytes(internal.encodingUtil.bigIntToUint8Array(MAX_UINT512 * MAX_UINT512)), 0],
      [Bytes(new Uint8Array(Array(8).fill(0x00).concat(Array(4).fill(0x0f)))), 0],
      [Bytes(new Uint8Array([0x0f])), MAX_BYTES_SIZE - 1],
      [Bytes(new Uint8Array()), 0]
    ])('should return the number of bits for the bytes input', async (a, padSize) => {
      const avmResult = await getAvmResult<uint64>(appClient, 'verify_bytes_bitlen', asUint8Array(a), padSize)
      const paddedA = getPaddedUint8Array(padSize, a)
      const result = op.bitLength(paddedA)
      expect(result.valueOf()).toBe(avmResult)
    })

    test.each([
      0,
      1,
      42,
      MAX_UINT64
    ])('should return the number of bits for the uint64 input', async (a) => {
      const avmResult = await getAvmResult<uint64>(appClient, 'verify_uint64_bitlen', a)
      const result = op.bitLength(a)
      expect(result.valueOf()).toBe(avmResult)
    })

    test.each([
      MAX_UINT64 + 1n,
      MAX_UINT512,
      MAX_UINT512 * 2n
    ])('should throw error when uint64 input overflows', async (a) => {
      await expect(getAvmResultRaw(appClient, 'verify_uint64_bitlen', a)).rejects.toThrow(avm_int_arg_overflow_error)
      expect(() => op.bitLength(a)).toThrow('Uint64 over or underflow')
    })
  })

  describe('bsqrt', async () => {
    test.each([
      0,
      1,
      2,
      9,
      13,
      144n,
      MAX_UINT64,
      MAX_UINT512
    ])('should compute the square root of a big uint', async (a) => {
      const uint8ArrayA = internal.encodingUtil.bigIntToUint8Array(BigInt(a))
      const avmResult = (await getAvmResultRaw(appClient, 'verify_bsqrt', uint8ArrayA))!

      const result = op.bsqrt(a)
      const bytesResult = asBigUintCls(result).toBytes()
      expect(bytesResult.asUint8Array()).toEqual(avmResult)
    })

    test.each([
      MAX_UINT512 + 1n,
      MAX_UINT512 * 2n
    ])('should throw error when input overflows', async (a) => {
      const uint8ArrayA = internal.encodingUtil.bigIntToUint8Array(BigInt(a))
      await expect(getAvmResultRaw(appClient, 'verify_bsqrt', uint8ArrayA)).rejects.toThrow('math attempted on large byte-array')
      expect(() => op.bsqrt(a)).toThrow('BigUint over or underflow')
    })
  })

  describe('btoi', async () => {
    test.each([
      Bytes(internal.encodingUtil.bigIntToUint8Array(0n)),
      Bytes(internal.encodingUtil.bigIntToUint8Array(1n)),
      Bytes(internal.encodingUtil.bigIntToUint8Array(MAX_UINT64)),
      Bytes(new Uint8Array(Array(4).fill(0x00).concat(Array(4).fill(0x0f))))
    ])('should convert bytes to uint64', async (a) => {
      const avmResult = await getAvmResult<uint64>(appClient, 'verify_btoi', asUint8Array(a))
      const result = op.btoi(a)
      expect(result.valueOf()).toBe(avmResult)
    })

    test.each([
      Bytes(internal.encodingUtil.bigIntToUint8Array(MAX_UINT512)),
      Bytes(internal.encodingUtil.bigIntToUint8Array(MAX_UINT512 * MAX_UINT512, 128)),
      Bytes(new Uint8Array(Array(5).fill(0x00).concat(Array(4).fill(0x0f)))),
    ])('should throw error when input overflows', async (a) => {
      const errorRegex = new RegExp(`btoi arg too long, got \\[${a.length.valueOf()}\\]bytes`)
      await expect(getAvmResultRaw(appClient, 'verify_btoi', asUint8Array(a))).rejects.toThrow(errorRegex)
      expect(() => op.btoi(a)).toThrow(errorRegex)
    })
  })

  describe('bzero', async () => {
    test.each([
      0,
      1,
      42,
      MAX_BYTES_SIZE
    ])('should retrun a zero filled bytes value of the given size', async (a) => {
      const avmResult = (await getAvmResultRaw(appClient, 'verify_bzero', a))!
      const result = op.bzero(a)
      const resultHash = getSha256Hash(asUint8Array(result))
      expect(resultHash).toEqual(avmResult)
    })

    test.each([
      MAX_BYTES_SIZE + 1,
      MAX_UINT64
    ])('should throw error when result overflows', async (a) => {
      await expect(getAvmResultRaw(appClient, 'verify_bzero', a)).rejects.toThrow('bzero attempted to create a too large string')
      expect(() => op.bzero(a)).toThrow('bzero attempted to create a too large string')
    })

    test.each([
      MAX_UINT64 + 1n,
      MAX_UINT512,
      MAX_UINT512 * 2n
    ])('should throw error when input overflows', async (a) => {
      await expect(getAvmResultRaw(appClient, 'verify_bzero', a)).rejects.toThrow(avm_int_arg_overflow_error)
      expect(() => op.bzero(a)).toThrow('Uint64 over or underflow')
    })
  })

  describe('concat', async () => {
    test.each([
      ["", "", 0, 0],
      ["1", "", 0, 0],
      ["", "1", 0, 0],
      ["1", "1", 0, 0],
      ["", "0", 0, MAX_BYTES_SIZE - 1],
      ["0", "", MAX_BYTES_SIZE - 1, 0],
      ["1", "0", 0, MAX_BYTES_SIZE - 2],
      ["1", "0", MAX_BYTES_SIZE - 2, 0],
    ])('should retrun concatenated bytes', async (a, b, padASize, padBSize) => {
      const avmResult = (await getAvmResultRaw(appClient, 'verify_concat', asUint8Array(a), asUint8Array(b), padASize, padBSize))!

      const paddedA = getPaddedUint8Array(padASize, a)
      const paddedB = getPaddedUint8Array(padBSize, b)

      const result = op.concat(paddedA, paddedB)
      const resultHash = getSha256Hash(asUint8Array(result))
      expect(resultHash).toEqual(avmResult)
    })

    test.each([
      ["1", "0", MAX_BYTES_SIZE, 0],
      ["1", "1", MAX_BYTES_SIZE, MAX_BYTES_SIZE],
      ["1", "0", 0, MAX_BYTES_SIZE]
    ])('should throw error when input overflows', async (a, b, padASize, padBSize) => {
      await expect(getAvmResultRaw(appClient, 'verify_concat', asUint8Array(a), asUint8Array(b), padASize, padBSize)).rejects.toThrow(/concat produced a too big \(\d+\) byte-array/)
      const paddedA = getPaddedUint8Array(padASize, a)
      const paddedB = getPaddedUint8Array(padBSize, b)

      expect(() => op.concat(paddedA, paddedB)).toThrow(/Bytes length \d+ exceeds maximum length/)
    })
  })

  describe('divmodw', async () => {
    test.each([
      [0, 1, 0, 1],
      [100, 42, 100, 42],
      [42, 100, 42, 100],
      [0, MAX_UINT64, 0, MAX_UINT64],
      [MAX_UINT64, 1, MAX_UINT64, 1],
      [1, MAX_UINT64, 1, MAX_UINT64],
      [MAX_UINT64 - 1n, 1, MAX_UINT64 - 1n, 1],
      [1, MAX_UINT64 - 1n, 1, MAX_UINT64 - 1n],
      [100, MAX_UINT64, 100, MAX_UINT64],
      [MAX_UINT64, MAX_UINT64, MAX_UINT64, MAX_UINT64],
    ])('should calculate div and mod results', async (a, b, c, d) => {
      const avmResult = await getAvmResult<uint64[]>(appClient, 'verify_divmodw', a, b, c, d)
      const result = op.divmodw(a, b, c, d)
      expect(result[0].valueOf()).toBe(avmResult[0])
      expect(result[1].valueOf()).toBe(avmResult[1])
      expect(result[2].valueOf()).toBe(avmResult[2])
      expect(result[3].valueOf()).toBe(avmResult[3])
    })

    test.each([
      [1, MAX_UINT64 + 1n, 1, MAX_UINT64 + 1n],
      [MAX_UINT64 + 1n, 1, MAX_UINT64 + 1n, 1],
      [0, MAX_UINT512, 0, MAX_UINT512],
      [MAX_UINT512 * 2n, 1, MAX_UINT512 * 2n, 1],
    ])('should throw error when input overflows', async (a, b, c, d) => {
      await expect(getAvmResultRaw(appClient, 'verify_divmodw', a, b, c, d)).rejects.toThrow(avm_int_arg_overflow_error)
      expect(() => op.divmodw(a, b, c, d)).toThrow('Uint64 over or underflow')
    })

    test.each([
      [0, 1],
      [100, 42],
      [42, 100],
      [0, MAX_UINT64],
      [MAX_UINT64, 1],
      [1, MAX_UINT64],
      [MAX_UINT64 - 1n, 1],
      [1, MAX_UINT64 - 1n],
      [100, MAX_UINT64],
      [MAX_UINT64, MAX_UINT64],
    ])('should throw error when dividing by zero', async (a, b) => {
      await expect(getAvmResultRaw(appClient, 'verify_divmodw', a, b, 0, 0)).rejects.toThrow('/ 0')
      expect(() => op.divmodw(a, b, 0, 0)).toThrow('Division by zero')
    })
  })

  describe('divw', async () => {
    test.each([
      [0, 1, 1],
      [42, 100, 100],
      [0, MAX_UINT64, MAX_UINT64],
      [1, MAX_UINT64, MAX_UINT64],
      [1, MAX_UINT64 - 1n, MAX_UINT64 - 1n],
      [100, MAX_UINT64, MAX_UINT64],
    ])('should calculate div result', async (a, b, c) => {
      const avmResult = await getAvmResult<uint64[]>(appClient, 'verify_divw', a, b, c)
      const result = op.divw(a, b, c)
      expect(result.valueOf()).toBe(avmResult)
    })

    test.each([
      [0, 1],
      [100, 42],
      [42, 100],
      [0, MAX_UINT64],
      [MAX_UINT64, 1],
      [1, MAX_UINT64],
      [MAX_UINT64 - 1n, 1],
      [1, MAX_UINT64 - 1n],
      [100, MAX_UINT64],
      [MAX_UINT64, MAX_UINT64],
    ])('should throw error when dividing by zero', async (a, b) => {
      await expect(getAvmResultRaw(appClient, 'verify_divw', a, b, 0)).rejects.toThrow('divw 0')
      expect(() => op.divw(a, b, 0)).toThrow('Division by zero')
    })

    test.each([
      [1, MAX_UINT64 + 1n, 1],
      [MAX_UINT64 + 1n, 1, MAX_UINT64 + 1n],
      [0, MAX_UINT512, MAX_UINT512],
      [MAX_UINT512 * 2n, 1, MAX_UINT512 * 2n],
    ])('should throw error when input overflows', async (a, b, c) => {
      await expect(getAvmResultRaw(appClient, 'verify_divw', a, b, c)).rejects.toThrow(avm_int_arg_overflow_error)
      expect(() => op.divw(a, b, c)).toThrow('Uint64 over or underflow')
    })

    test.each([
      [100, 42, 42],
      [MAX_UINT64, 1, 1],
      [MAX_UINT64 - 1n, 1, 1],
      [MAX_UINT64, MAX_UINT64, MAX_UINT64],
    ])('should throw error when result overflows', async (a, b, c) => {
      await expect(getAvmResultRaw(appClient, 'verify_divw', a, b, c)).rejects.toThrow('divw overflow')
      expect(() => op.divw(a, b, c)).toThrow('Uint64 over or underflow')
    })
  })

  describe('exp', async () => {
    test.each([
      [0, 1],
      [1, 0],
      [42, 11],
      [sqrtMaxUint64, 2],
      [1, MAX_UINT64],
    ])('should calculate the exponentiation result', async (a, b) => {
      const avmResult = await getAvmResult<uint64>(appClient, 'verify_exp', a, b)
      const result = op.exp(a, b)
      expect(result.valueOf()).toBe(avmResult)
    })

    test.each([
      [100, 42],
      [MAX_UINT64, 2],
      [2, 64],
    ])('should throw error when result overflows', async (a, b) => {
      await expect(getAvmResultRaw(appClient, 'verify_exp', a, b)).rejects.toThrow('overflow')
      expect(() => op.exp(a, b)).toThrow('Uint64 over or underflow')
    })

    test.each([
      [1, MAX_UINT64 + 1n],
      [MAX_UINT64 + 1n, 1],
      [0, MAX_UINT512],
      [MAX_UINT512 * 2n, 1],
    ])('should throw error when input overflows', async (a, b) => {
      await expect(getAvmResultRaw(appClient, 'verify_exp', a, b)).rejects.toThrow(avm_int_arg_overflow_error)
      expect(() => op.exp(a, b)).toThrow('Uint64 over or underflow')
    })

    it('0 ** 0 is not supported', async () => {
      await expect(getAvmResultRaw(appClient, 'verify_exp', 0, 0)).rejects.toThrow('0^0 is undefined')
      expect(() => op.exp(0, 0)).toThrow('0 ** 0 is undefined')
    })
  })

  describe('expw', async () => {
    test.each([
      [0, 1],
      [1, 0],
      [42, 11],
      [sqrtMaxUint64, 4],
      [2, 127]
    ])('should calculate the exponentiation result', async (a, b) => {
      const avmResult = await getAvmResult<uint64[]>(appClient, 'verify_expw', a, b)
      const result = op.expw(a, b)
      expect(result[0].valueOf()).toBe(avmResult[0])
      expect(result[1].valueOf()).toBe(avmResult[1])
    })

    test.each([
      [100, 42],
      [MAX_UINT64, 3],
      [2, 128],
    ])('should throw error when result overflows', async (a, b) => {
      await expect(getAvmResultRaw(appClient, 'verify_expw', a, b)).rejects.toThrow('overflow')
      expect(() => op.expw(a, b)).toThrow('Uint64 over or underflow')
    })

    test.each([
      [1, MAX_UINT64 + 1n],
      [MAX_UINT64 + 1n, 1],
      [0, MAX_UINT512],
      [MAX_UINT512 * 2n, 1],
    ])(`should throw error when input overflows`, async (a, b) => {
      await expect(getAvmResultRaw(appClient, 'verify_expw', a, b)).rejects.toThrow(avm_int_arg_overflow_error)
      expect(() => op.expw(a, b)).toThrow('Uint64 over or underflow')
    })

    it('0 ** 0 is not supported', async () => {
      await expect(getAvmResultRaw(appClient, 'verify_expw', 0, 0)).rejects.toThrow('0^0 is undefined')
      expect(() => op.expw(0, 0)).toThrow('0 ** 0 is undefined')
    })
  })

  describe('extract', async () => {
    test.each([
      [0, 0],
      [0, 1],
      [0, 2],
      [11, 1],
      [12, 0],
      [8, 4],
      [256, 0],
      [256, 3],
    ])(`should extract bytes from the input`, async (b, c) => {
      const a = "hello, world".repeat(30)
      const avmResult = (await getAvmResultRaw(appClient, 'verify_extract', asUint8Array(a), b, c))!
      let result = op.extract(a, Uint64(b), Uint64(c))
      expect(asUint8Array(result)).toEqual(avmResult)

      if (c) {
        result = op.extract(a, b, c)
        expect(asUint8Array(result)).toEqual(avmResult)
      }
    })

    test.each([
      "hello, world",
      "hi",
    ])('should work to extract bytes from 2 to end', async (a) => {
      const avmResult = (await getAvmResultRaw(appClient, 'verify_extract_from_2', asUint8Array(a)))!
      const result = op.extract(a, 2, 0)
      expect(asUint8Array(result)).toEqual(avmResult)
    })

    test.each([
      [1, MAX_UINT64 + 1n],
      [MAX_UINT64 + 1n, 1],
      [0, MAX_UINT512],
      [MAX_UINT512 * 2n, 1],
    ])(`should throw error when input overflows`, async (b, c) => {
      const a = "hello, world".repeat(30)
      await expect(getAvmResultRaw(appClient, 'verify_extract', asUint8Array(a), b, c)).rejects.toThrow(avm_int_arg_overflow_error)
      expect(() => op.extract(a, b, c)).toThrow('Uint64 over or underflow')
    })

    test.each([
      [0, 13],
      [13, 0],
      [11, 2],
      [8, 5],
    ])('should throw error when input is invalid', async (b, c) => {
      const a = "hello, world"
      await expect(getAvmResultRaw(appClient, 'verify_extract', asUint8Array(a), b, c)).rejects.toThrow(/extraction (start|end) \d+ is beyond length/)
      expect(() => op.extract(a, b, c)).toThrow(/extraction (start|end) \d+ is beyond length/)
    })
  })

  describe('itob', async () => {
    test.each([
      0,
      42,
      100n,
      256,
      65535,
      MAX_UINT64,
    ])('should convert uint64 to bytes', async (a) => {
      const avmResult = (await getAvmResultRaw(appClient, 'verify_itob', a))!
      const result = op.itob(a)
      expect(asUint8Array(result)).toEqual(avmResult)
    })

    test.each([
      MAX_UINT64 + 1n,
      MAX_UINT512
    ])('should throw error when input overflows', async (a) => {
      await expect(getAvmResultRaw(appClient, 'verify_itob', a)).rejects.toThrow(avm_int_arg_overflow_error)
      expect(() => op.itob(a)).toThrow('Uint64 over or underflow')
    })
  })
})
