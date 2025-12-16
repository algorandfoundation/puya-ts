import { ABIMethod, ABIType } from '@algorandfoundation/algokit-utils/abi'
import { describe, expect } from 'vitest'
import { utf8ToUint8Array } from '../../src/util'
import { createArc4TestFixture } from './util/test-fixture'

const getAbiReturnUint64 = (log: Uint8Array) => {
  return ABIType.from('uint64').decode(log.slice(4))
}

describe('abi validation routing', () => {
  const b31 = utf8ToUint8Array('ABCDEFGHABCDEFGHABCDEFGHABCDEFG')
  const b32 = utf8ToUint8Array('ABCDEFGHABCDEFGHABCDEFGHABCDEFGH')

  const abiBytes32 = ABIType.from('byte[32]')
  const abiBytes = ABIType.from('byte[]')

  const validB32 = abiBytes32.encode(b32)
  const invalidB32 = abiBytes32.encode(b32).slice(0, -1)

  const test = createArc4TestFixture({ paths: 'tests/approvals/abi-validation.algo.ts', contracts: { AbiValidationAlgo: {} } })
  test('with validation fails on invalid', async ({ appClientAbiValidationAlgo }) => {
    const withValidation = ABIMethod.fromSignature('withValidation(byte[32])uint64')

    await expect(appClientAbiValidationAlgo.send.bare.call({ args: [withValidation.getSelector(), invalidB32] })).rejects.toThrow(
      'invalid number of bytes for arc4.static_array<arc4.uint8, 32>',
    )

    const res = await appClientAbiValidationAlgo.send.bare.call({ args: [withValidation.getSelector(), validB32] })
    const resReturn = getAbiReturnUint64(res.confirmation.logs![0])
    expect(resReturn).toBe(32n)
  })
  test('with default validation fails on invalid', async ({ appClientAbiValidationAlgo }) => {
    const defaultValidation = ABIMethod.fromSignature('defaultValidation(byte[32])uint64')

    await expect(appClientAbiValidationAlgo.send.bare.call({ args: [defaultValidation.getSelector(), invalidB32] })).rejects.toThrow(
      'invalid number of bytes for arc4.static_array<arc4.uint8, 32>',
    )

    const res = await appClientAbiValidationAlgo.send.bare.call({ args: [defaultValidation.getSelector(), validB32] })
    const resReturn = getAbiReturnUint64(res.confirmation.logs![0])
    expect(resReturn).toBe(32n)
  })
  test('without validation works on invalid', async ({ appClientAbiValidationAlgo }) => {
    const withoutValidation = ABIMethod.fromSignature('withoutValidation(byte[32])uint64')

    const res1 = await appClientAbiValidationAlgo.send.bare.call({ args: [withoutValidation.getSelector(), invalidB32] })
    const res1Return = getAbiReturnUint64(res1.confirmation.logs![0])
    expect(res1Return).toBe(31n)

    const res2 = await appClientAbiValidationAlgo.send.bare.call({ args: [withoutValidation.getSelector(), validB32] })
    const res2Return = getAbiReturnUint64(res2.confirmation.logs![0])
    expect(res2Return).toBe(32n)
  })
  test('with manual validation in convert, fails on invalid', async ({ appClientAbiValidationAlgo }) => {
    const manualValidationInConvert = ABIMethod.fromSignature('manualValidationInConvert(byte[])uint64')

    const invalidBytes = abiBytes.encode(b31)
    await expect(
      appClientAbiValidationAlgo.send.bare.call({ args: [manualValidationInConvert.getSelector(), invalidBytes] }),
    ).rejects.toThrow('invalid number of bytes for arc4.static_array<arc4.uint8, 32>')

    const validBytes = abiBytes.encode(b32)
    const res = await appClientAbiValidationAlgo.send.bare.call({ args: [manualValidationInConvert.getSelector(), validBytes] })
    const resReturn = getAbiReturnUint64(res.confirmation.logs![0])
    expect(resReturn).toBe(32n)
  })
  test('with manual validation after convert, fails on invalid', async ({ appClientAbiValidationAlgo }) => {
    const manualValidationAfterConvert = ABIMethod.fromSignature('manualValidationAfterConvert(byte[])uint64')

    const invalidBytes = abiBytes.encode(b31)
    await expect(
      appClientAbiValidationAlgo.send.bare.call({ args: [manualValidationAfterConvert.getSelector(), invalidBytes] }),
    ).rejects.toThrow('invalid number of bytes for arc4.static_array<arc4.uint8, 32>')

    const validBytes = abiBytes.encode(b32)
    const res = await appClientAbiValidationAlgo.send.bare.call({ args: [manualValidationAfterConvert.getSelector(), validBytes] })
    const resReturn = getAbiReturnUint64(res.confirmation.logs![0])
    expect(resReturn).toBe(32n)
  })
})
