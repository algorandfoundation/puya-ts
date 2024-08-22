import { BigUint, Bytes, internal, op, uint64 } from '@algorandfoundation/algo-ts'
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import { afterEach } from 'node:test'
import { describe, expect, test } from 'vitest'
import { TestExecutionContext } from '../src'
import { MAX_UINT512, MAX_UINT64 } from '../src/constants'
import appSpecJson from './artifacts/miscellaneous-ops/data/MiscellaneousOpsContract.arc32.json'
import { getAlgorandAppClient, getAvmResult, getAvmResultRaw } from './avm-invoker'
import { asBigUintCls, asBytesCls, asUint64, asUint8Array, base64Encode, base64UrlEncode } from './util'


const avm_int_arg_overflow_error = "is not a non-negative int or too big to fit in size"

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
      const result = op.addw(asUint64(a), asUint64(b))
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
      expect(() => op.addw(asUint64(a), asUint64(b))).toThrow('Uint64 over or underflow')
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
      const result = op.itob(asUint64(a))
      expect(asUint8Array(result)).toEqual(avmResult)
    })

    test.each([
      MAX_UINT64 + 1n,
      MAX_UINT512
    ])('should throw error when input overflows', async (a) => {
      await expect(getAvmResultRaw(appClient, 'verify_itob', a)).rejects.toThrow(avm_int_arg_overflow_error)
      expect(() => op.itob(asUint64(a))).toThrow('Uint64 over or underflow')
    })
  })
})
