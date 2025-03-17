import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('match expr', () => {
  const test = createArc4TestFixture('tests/approvals/match-expr.algo.ts', {
    MatchExprAlgo: {},
  })
  test('it runs', async ({ appClientMatchExprAlgo }) => {
    await appClientMatchExprAlgo.send.call({ method: 'testMatches', args: [5] })
  })
})
