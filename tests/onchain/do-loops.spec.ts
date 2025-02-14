import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('do loops', () => {
  const test = createArc4TestFixture('tests/approvals/do-loops.algo.ts', { DoLoopsAlgo: {} })

  test('testDo runs', async ({ appClientDoLoopsAlgo, expect }) => {
    const result = await appClientDoLoopsAlgo.send.call({ method: 'testDo', args: [10] })

    expect(result.return).toBe(10n)
  })
  test('testDoBreak runs', async ({ appClientDoLoopsAlgo, expect }) => {
    const result = await appClientDoLoopsAlgo.send.call({ method: 'testDoBreak', args: [10, 5] })

    expect(result.return).toBe(BigInt(1 + 2 + 3 + 4 + 5))
  })
  test('testDoContinue runs', async ({ appClientDoLoopsAlgo, expect }) => {
    const result = await appClientDoLoopsAlgo.send.call({ method: 'testDoContinue', args: [10, 3] })

    expect(result.return).toBe(BigInt(1 + 1 + 1 + 2 + 1 + 1 + 2 + 1 + 1 + 2))
  })
})
