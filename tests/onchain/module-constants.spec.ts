import { describe, expect } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('module constants', () => {
  const test = createArc4TestFixture({ path: 'tests/approvals/module-constants.algo.ts', contracts: { ModuleConstantsAlgo: {} } })

  test('bool constants work', async ({ appClientModuleConstantsAlgo }) => {
    const result = await appClientModuleConstantsAlgo.send.call({ method: 'getBoolConstants' })

    expect(result.return).toEqual([false, true])
  })
  test('uint64 constants work', async ({ appClientModuleConstantsAlgo }) => {
    const result = await appClientModuleConstantsAlgo.send.call({ method: 'getUintConstants' })

    expect(result.return).toEqual([12n, 8n, 20n, 5n, 0n, 100n, 40n, 2n, 10n, 8n, 2n])
  })
  test('biguint constants work', async ({ appClientModuleConstantsAlgo }) => {
    const result = await appClientModuleConstantsAlgo.send.call({ method: 'getBigUintConstants' })

    expect(result.return).toEqual([12n, 8n, 20n, 5n, 0n, 10n, 8n, 2n])
  })
  test('string constants work', async ({ appClientModuleConstantsAlgo }) => {
    const result = await appClientModuleConstantsAlgo.send.call({ method: 'getStringConstants' })

    expect(result.return).toEqual(['ab'])
  })
})
