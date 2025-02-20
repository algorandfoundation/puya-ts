import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('ops', () => {
  const test = createArc4TestFixture('tests/approvals/ops.algo.ts', { MyContract: {} })

  test('runs', async ({ appClientMyContract }) => {
    await appClientMyContract.send.call({ method: 'test' })
  })
})
