import { describe, expect } from 'vitest'
import { utf8ToUint8Array } from '../../src/util'
import { createArc4TestFixture } from './util/test-fixture'

describe('abi validation', () => {
  const b31 = utf8ToUint8Array('ABCDEFGHABCDEFGHABCDEFGHABCDEFG')
  const b32 = utf8ToUint8Array('ABCDEFGHABCDEFGHABCDEFGHABCDEFGH')

  const test = createArc4TestFixture('tests/approvals/abi-validation.algo.ts', { AbiValidationAlgo: {} })
  test('with validation fails on invalid', async ({ appClientAbiValidationAlgo }) => {
    await expect(appClientAbiValidationAlgo.send.call({ method: 'withValidation', args: [b31] })).rejects.toThrow(
      'Value array does not match static array length. Expected 32, got 31',
    )
    const res = await appClientAbiValidationAlgo.send.call({ method: 'withValidation', args: [b32] })
    expect(res.return).toBe(32n)
  })
  test('with default validation fails on invalid', async ({ appClientAbiValidationAlgo }) => {
    await expect(appClientAbiValidationAlgo.send.call({ method: 'defaultValidation', args: [b31] })).rejects.toThrow(
      'Value array does not match static array length. Expected 32, got 31',
    )
    const res = await appClientAbiValidationAlgo.send.call({ method: 'defaultValidation', args: [b32] })
    expect(res.return).toBe(32n)
  })
  test('without validation works on invalid', async ({ appClientAbiValidationAlgo }) => {
    const res1 = await appClientAbiValidationAlgo.send.call({ method: 'withoutValidation', args: [b31] })
    expect(res1.return).toBe(31n)

    const res2 = await appClientAbiValidationAlgo.send.call({ method: 'withoutValidation', args: [b32] })
    expect(res2.return).toBe(32n)
  })
})
