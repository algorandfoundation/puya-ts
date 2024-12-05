import { algo } from '@algorandfoundation/algokit-utils'
import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('precompiled', () => {
  const test = createArc4TestFixture('tests/approvals/precompiled-factory.algo.ts', { HelloFactory: {} })

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