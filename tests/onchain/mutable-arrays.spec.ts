import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('mutable arrays', () => {
  const test = createArc4TestFixture('tests/approvals/mutable-arrays.algo.ts', {
    MatchExprAlgo: {},
  })
  test('it runs', async ({ appClientMatchExprAlgo }) => {
    await appClientMatchExprAlgo.send.call({ method: 'test', args: [50] })
  })
})
