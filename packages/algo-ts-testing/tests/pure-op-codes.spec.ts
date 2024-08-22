import { Bytes, internal, op, uint64 } from '@algorandfoundation/algo-ts'
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec'
import { afterEach } from 'node:test'
import { describe, expect, test } from 'vitest'
import { TestExecutionContext } from '../src'
import { MAX_UINT512, MAX_UINT64 } from '../src/constants'
import appSpecJson from './artifacts/miscellaneous-ops/data/MiscellaneousOpsContract.arc32.json'
import { getAlgorandAppClient, getAvmResult, getAvmResultRaw } from './avm-invoker'
import { asUint64, asUint8Array } from './util'


const avm_int_arg_overflow_error = "is not a non-negative int or too big to fit in size"

describe('Pure op codes', async () => {
  const appClient = await getAlgorandAppClient(appSpecJson as AppSpec)
  const ctx = new TestExecutionContext()

  afterEach(async () => {
    ctx.reset()
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

  describe('itob', async (a) => {
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
