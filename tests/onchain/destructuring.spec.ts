import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('destructuring iterators', () => {
  const test = createArc4TestFixture('tests/approvals/destructuring-iterators.algo.ts', { DestructuringIterators: {} })

  test('runs', async ({ appClientDestructuringIterators }) => {
    await appClientDestructuringIterators.send.call({ method: 'test' })
  })
})
