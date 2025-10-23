import { describe, expect } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('array destructuring', () => {
  const test = createArc4TestFixture({
    path: 'tests/approvals/array-destructuring.algo.ts',
    contracts: {
      ArrayDestructuringAlgo: {},
    },
  })

  test('testNested', async ({ appClientArrayDestructuringAlgo }) => {
    const result = await appClientArrayDestructuringAlgo.send.call({
      method: 'testNested',
      args: [[1, [2, 3]]],
    })

    expect(result.return).toStrictEqual([1n, [2n, 3n], 1n, 2n])
  })

  test('test', async ({ appClientArrayDestructuringAlgo }) => {
    await appClientArrayDestructuringAlgo.send.call({
      method: 'test',
    })
  })

  test('testLiteralDestructuring', async ({ appClientArrayDestructuringAlgo }) => {
    await appClientArrayDestructuringAlgo.send.call({
      method: 'testLiteralDestructuring',
    })
  })
})
