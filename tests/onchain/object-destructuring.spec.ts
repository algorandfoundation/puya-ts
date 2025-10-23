import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('object destructuring', () => {
  const test = createArc4TestFixture({ path: 'tests/approvals/object-destructuring.algo.ts', contracts: { ObjectDestructuringAlgo: {} } })
  test('it runs', async ({ appClientObjectDestructuringAlgo }) => {
    await appClientObjectDestructuringAlgo.send.call({ method: 'test' })
  })
})
