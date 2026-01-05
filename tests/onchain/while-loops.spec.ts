import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('while loops', () => {
  const test = createArc4TestFixture({ paths: 'tests/approvals/while-loops.algo.ts', contracts: { DemoContract: {} } })

  test('runs', async ({ appClientDemoContract, expect }) => {
    const result = await appClientDemoContract.send.call({ method: 'testWhile', args: [10] })

    expect(result.return).toBe(10n)
  })
})
