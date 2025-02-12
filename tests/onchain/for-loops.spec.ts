import { describe, expect } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('for loops', () => {
  const test = createArc4TestFixture('tests/approvals/for-loops.algo.ts', {
    ForLoopsAlgo: {},
  })

  test('basic', async ({ appClientForLoopsAlgo }) => {
    const r1 = await appClientForLoopsAlgo.send.call({ method: 'test_for_loop', args: [2, 10, 2] })
    expect(r1.return).toBe(2n + 4n + 6n + 8n)
    const r2 = await appClientForLoopsAlgo.send.call({ method: 'test_for_loop', args: [2, 11, 2] })
    expect(r2.return).toBe(2n + 4n + 6n + 8n + 10n)
  })
  test('break', async ({ appClientForLoopsAlgo }) => {
    const r1 = await appClientForLoopsAlgo.send.call({ method: 'test_for_loop_break', args: [2, 10, 2] })
    expect(r1.return).toBe(2n + 4n + 6n)
    const r2 = await appClientForLoopsAlgo.send.call({ method: 'test_for_loop_break', args: [2, 11, 3] })
    expect(r2.return).toBe(2n + 5n + 8n)
  })
  test('continue', async ({ appClientForLoopsAlgo }) => {
    const r1 = await appClientForLoopsAlgo.send.call({ method: 'test_for_loop_continue', args: [0, 20, 3] })
    expect(r1.return).toBe(3n + 6n + 9n + 12n + 18n)
    const r2 = await appClientForLoopsAlgo.send.call({ method: 'test_for_loop_continue', args: [0, 20, 5] })
    expect(r2.return).toBe(0n)
  })
  test('labelled break', async ({ appClientForLoopsAlgo }) => {
    const r1 = await appClientForLoopsAlgo.send.call({ method: 'test_for_loop_labelled', args: [0, 20, 3] })
    expect(r1.return).toBe(0n)
    const r2 = await appClientForLoopsAlgo.send.call({ method: 'test_for_loop_labelled', args: [2, 20, 5] })
    expect(r2.return).toBe(2n + 2n)
  })
})
