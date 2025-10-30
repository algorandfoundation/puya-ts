import { describe, expect } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('uint64-to-string', () => {
  const test = createArc4TestFixture({ path: 'tests/approvals/uint64-to-string.algo.ts', contracts: { Uint64ToStringAlgo: {} } })

  test('it works', async ({ appClientUint64ToStringAlgo }) => {
    const { return: result } = await appClientUint64ToStringAlgo.send.call({ method: 'test', args: [456] })

    expect(result).toBe('456')
  })
})
