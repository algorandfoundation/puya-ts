import { algo } from '@algorandfoundation/algokit-utils'
import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('wide math', () => {
  const test = createArc4TestFixture('tests/approvals/wide-math.algo.ts', { WideMath: {} })

  test('it runs', async ({ appClientWideMath }) => {
    await appClientWideMath.send.call({ method: 'test', extraFee: algo(1) })
  })
})
