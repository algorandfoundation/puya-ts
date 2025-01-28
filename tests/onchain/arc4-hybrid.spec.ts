import { describe } from 'vitest'
import { uint8ArrayToUtf8 } from '../../src/util'
import { createArc4TestFixture } from './util/test-fixture'

describe('arc4-hybrid', () => {
  const test = createArc4TestFixture('tests/approvals/arc4-hybrid.algo.ts', { Arc4HybridAlgo: {} })
  test('works as expected', async ({ appClientArc4HybridAlgo, expect }) => {
    const result = await appClientArc4HybridAlgo.send.call({ method: 'someMethod' })
    const logs = result.confirmation.logs!.map(uint8ArrayToUtf8)

    expect(logs).toStrictEqual(['before', 'some method', 'after'])
  })
})
