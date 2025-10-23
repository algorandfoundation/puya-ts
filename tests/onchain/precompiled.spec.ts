import { algo } from '@algorandfoundation/algokit-utils'
import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('precompiled', () => {
  describe('un-typed', () => {
    const test = createArc4TestFixture({ path: 'tests/approvals/precompiled-factory.algo.ts', contracts: { HelloFactory: {} } })

    test('Hello contract can be deployed', async ({ appClientHelloFactory }) => {
      await appClientHelloFactory.send.call({ method: 'test_compile_contract', extraFee: algo(1) })
    })
    test('HelloTemplate contract can be deployed', async ({ appClientHelloFactory }) => {
      await appClientHelloFactory.send.call({ method: 'test_compile_contract_with_template', extraFee: algo(1) })
    })
    test('HelloTemplateCustomPrefix contract can be deployed', async ({ appClientHelloFactory }) => {
      await appClientHelloFactory.send.call({ method: 'test_compile_contract_with_template_and_custom_prefix', extraFee: algo(1) })
    })
    test('LargeProgram contract can be deployed', async ({ appClientHelloFactory }) => {
      await appClientHelloFactory.send.call({ method: 'test_compile_contract_large', extraFee: algo(1) })
    })
  })
  describe('typed', () => {
    const test = createArc4TestFixture({
      path: 'tests/approvals/precompiled-typed.algo.ts',
      contracts: { HelloFactory: { funding: algo(1) } },
    })

    test('Hello contract can be deployed', async ({ appClientHelloFactory }) => {
      await appClientHelloFactory.send.call({ method: 'test_compile_contract', extraFee: algo(1) })
    })
    test('HelloTemplate contract can be deployed', async ({ appClientHelloFactory }) => {
      await appClientHelloFactory.send.call({ method: 'test_compile_contract_with_template', extraFee: algo(1) })
    })
    test('HelloTemplateCustomPrefix contract can be deployed', async ({ appClientHelloFactory }) => {
      await appClientHelloFactory.send.call({ method: 'test_compile_contract_with_template_and_custom_prefix', extraFee: algo(1) })
    })
    test('LargeProgram contract can be deployed', async ({ appClientHelloFactory }) => {
      await appClientHelloFactory.send.call({ method: 'test_compile_contract_large', extraFee: algo(1) })
    })
    test('Program with txn params can be called', async ({ appClientHelloFactory }) => {
      await appClientHelloFactory.send.call({ method: 'test_call_contract_with_transactions', extraFee: algo(1) })
    })
    test('Program with reference type params can be called', async ({ appClientHelloFactory }) => {
      await appClientHelloFactory.send.call({ method: 'test_call_contract_with_reference_types', extraFee: algo(1) })
    })
  })
})
