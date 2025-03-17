import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('arc4 method selector', () => {
  const test = createArc4TestFixture('tests/approvals/arc4-method-selector.algo.ts', { ContractOne: {}, ContractTwo: {} })

  test('It gets the correct method selector', async ({ appClientContractTwo, expect }) => {
    const result = await appClientContractTwo.send.call({ method: 'test', args: [] })

    expect(result.return).toEqual(true)
  })

  test('It gets the correct method selector when the method name is overridden in config', async ({ appClientContractOne, expect }) => {
    const result = await appClientContractOne.send.call({ method: 'test', args: [] })

    expect(result.return).toBe(true)
  })
})
