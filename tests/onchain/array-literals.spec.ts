import { describe, expect } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('array literals', () => {
  const test = createArc4TestFixture('tests/approvals/array-literals.algo.ts', {
    ArrayLiteralsAlgo: {},
  })

  test('test', async ({ appClientArrayLiteralsAlgo }) => {
    await appClientArrayLiteralsAlgo.send.call({ method: 'test', args: [5, 9] })
  })
  test('test2', async ({ appClientArrayLiteralsAlgo }) => {
    const result = await appClientArrayLiteralsAlgo.send.call({ method: 'test2' })
    expect(result.return).toBe(1n)
  })
})
