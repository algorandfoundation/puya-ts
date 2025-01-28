import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('switch statements', () => {
  const test = createArc4TestFixture('tests/approvals/switch-statements.algo.ts', { DemoContract: {} })

  test('runs', async ({ appClientDemoContract }) => {
    await appClientDemoContract.send.call({ method: 'run', args: [] })
  })
})
