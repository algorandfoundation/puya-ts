import { describe } from 'vitest'
import { bigIntToUint8Array } from '../../src/util'
import { decodeLogs } from './util/decode-logs'
import { createArc4TestFixture, createBaseTestFixture } from './util/test-fixture'

describe('inheritance', () => {
  describe('non arc4', () => {
    const test = createBaseTestFixture('tests/approvals/inheritance-b.algo.ts', ['ConcreteSimpleContract'])
    test('Simple contract can be created', async ({ ConcreteSimpleContractInvoker, expect }) => {
      const result = await ConcreteSimpleContractInvoker.send({
        args: [bigIntToUint8Array(10n), bigIntToUint8Array(2n)],
      })
      const [returnValue] = decodeLogs(result, ['i'])

      expect(returnValue).toBe(2n * 10n)
    })
  })
  describe('arc4', () => {
    const test = createArc4TestFixture('tests/approvals/inheritance-b.algo.ts', { ConcreteArc4Contract: {} })
    test('ARC4 contract can be created', async ({ appFactoryConcreteArc4Contract }) => {
      const result = appFactoryConcreteArc4Contract.send.bare.create()
    })
  })
})
