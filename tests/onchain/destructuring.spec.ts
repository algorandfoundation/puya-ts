import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('destructuring iterators', () => {
  const test = createArc4TestFixture({ path: 'tests/approvals/destructuring-iterators.algo.ts', contracts: { DestructuringIterators: {} } })

  test('runs', async ({ appClientDestructuringIterators }) => {
    await appClientDestructuringIterators.send.call({ method: 'test' })
  })
})
