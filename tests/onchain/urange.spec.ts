import { describe, expect } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('urange', () => {
  const test = createArc4TestFixture({ path: 'tests/approvals/urange.algo.ts', contracts: { UrangeAlgo: {} } })

  test('works with single arg', async ({ appClientUrangeAlgo }) => {
    const result = await appClientUrangeAlgo.send.call({ method: 'testSingleArg' })

    expect(result.return).toEqual([0n, 1n, 2n, 3n, 4n])
  })
  test('works with two arg', async ({ appClientUrangeAlgo }) => {
    const result = await appClientUrangeAlgo.send.call({ method: 'testTwoArg' })

    expect(result.return).toEqual([2n, 3n, 4n])
  })
  test('works with three arg', async ({ appClientUrangeAlgo }) => {
    const result = await appClientUrangeAlgo.send.call({ method: 'testThreeArg' })

    expect(result.return).toEqual([2n, 5n, 8n])
  })
})
