import { describe } from 'vitest'
import { createArc4TestFixture, createBaseTestFixture } from './util/test-fixture'

describe('primitives', () => {
  describe('boolean', () => {
    const test = createBaseTestFixture({ paths: 'tests/approvals/boolean-conversions.algo.ts', contracts: ['BooleanConversionsAlgo'] })

    test('it can be called', async ({ BooleanConversionsAlgoInvoker }) => {
      await BooleanConversionsAlgoInvoker.send()
    })
  })

  describe('uint64', () => {
    const test = createBaseTestFixture({ paths: 'tests/approvals/uint64-expressions.algo.ts', contracts: ['DemoContract'] })
    test('can be created', async ({ DemoContractInvoker }) => {
      await DemoContractInvoker.send()
    })
  })
  describe('biguint', () => {
    const test = createBaseTestFixture({ paths: 'tests/approvals/biguint-expressions.algo.ts', contracts: ['DemoContract'] })
    test('can be created', async ({ DemoContractInvoker }) => {
      await DemoContractInvoker.send()
    })
  })
  describe('bytes', () => {
    const test = createBaseTestFixture({ paths: 'tests/approvals/byte-expressions.algo.ts', contracts: ['DemoContract'] })
    test('can be created', async ({ DemoContractInvoker }) => {
      await DemoContractInvoker.send()
    })
  })

  describe('strings', () => {
    const test = createArc4TestFixture({ paths: 'tests/approvals/strings.algo.ts', contracts: { StringContract: {} } })

    test('can be joined', async ({ appClientStringContract, expect }) => {
      const result = await appClientStringContract.send.call({ method: 'join', args: ['hello', 'world'] })
      expect(result.return).toBe('helloworld')
    })
    test('can be interpolated', async ({ appClientStringContract, expect }) => {
      const result = await appClientStringContract.send.call({ method: 'interpolate', args: ['hello'] })
      expect(result.return).toBe('You interpolated hello')
    })
  })
})
