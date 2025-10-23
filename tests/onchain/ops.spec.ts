import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('ops', () => {
  const test = createArc4TestFixture({ path: 'tests/approvals/ops.algo.ts', contracts: { MyContract: {} } })

  test('runs', async ({ appClientMyContract }) => {
    await appClientMyContract.send.call({ method: 'test' })
    await appClientMyContract.send.call({ method: 'test2', args: [32n] })
  })
})
