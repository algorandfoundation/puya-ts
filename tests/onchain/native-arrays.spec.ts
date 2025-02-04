import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('native arrays', () => {
  const test = createArc4TestFixture('tests/approvals/native-arrays.algo.ts', {
    MatchExprAlgo: {},
  })
  test('it runs', async ({ appClientMatchExprAlgo }) => {
    await appClientMatchExprAlgo.send.call({ method: 'doThings', args: [] })
  })
})
