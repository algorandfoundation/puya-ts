import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('switch statements', () => {
  const test = createArc4TestFixture({ paths: 'tests/approvals/switch-statements.algo.ts', contracts: { DemoContract: {} } })

  test('runs', async ({ appClientDemoContract }) => {
    await appClientDemoContract.send.call({ method: 'run', args: [] })
  })

  test('test_side_effects', async ({ appClientDemoContract }) => {
    await appClientDemoContract.send.call({ method: 'test_side_effects', args: [5] })
  })
})
