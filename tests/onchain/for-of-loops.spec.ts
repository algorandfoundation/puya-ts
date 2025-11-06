import { describe, expect } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('for loops', () => {
  const test = createArc4TestFixture({
    paths: 'tests/approvals/for-of-loops.algo.ts',
    contracts: {
      ForOfLoopsAlgo: {},
    },
  })

  test('test_for_of_loop_tuple', async ({ appClientForOfLoopsAlgo }) => {
    const r1 = await appClientForOfLoopsAlgo.send.call({ method: 'test_for_of_loop_tuple', args: [[4, 8, 10]] })
    expect(r1.return).toBe(4n + 8n + 10n)
    const r2 = await appClientForOfLoopsAlgo.send.call({ method: 'test_for_of_loop_tuple', args: [[4, 42, 10]] })
    expect(r2.return).toBe(4n + 42n)
  })
  test('test_for_of_loop_arc4_dynamic_array', async ({ appClientForOfLoopsAlgo }) => {
    const r1 = await appClientForOfLoopsAlgo.send.call({ method: 'test_for_of_loop_arc4_dynamic_array', args: [[4, 8, 10]] })
    expect(r1.return).toBe(4n + 8n + 10n)
    const r2 = await appClientForOfLoopsAlgo.send.call({ method: 'test_for_of_loop_arc4_dynamic_array', args: [[4, 42, 6]] })
    expect(r2.return).toBe(4n + 42n)
  })
  test('test_for_of_loop_arc4_static_array', async ({ appClientForOfLoopsAlgo }) => {
    const r1 = await appClientForOfLoopsAlgo.send.call({ method: 'test_for_of_loop_arc4_static_array', args: [[4, 8, 10, 10, 10]] })
    expect(r1.return).toBe(4n + 8n + 10n + 10n + 10n)
    const r2 = await appClientForOfLoopsAlgo.send.call({ method: 'test_for_of_loop_arc4_static_array', args: [[4, 8, 10, 42, 10]] })
    expect(r2.return).toBe(4n + 8n + 10n + 42n)
  })
  test('test_for_of_loop_native_immutable_array', async ({ appClientForOfLoopsAlgo }) => {
    const r1 = await appClientForOfLoopsAlgo.send.call({ method: 'test_for_of_loop_native_immutable_array', args: [[4, 8, 10]] })
    expect(r1.return).toBe(4n + 8n + 10n)
    const r2 = await appClientForOfLoopsAlgo.send.call({ method: 'test_for_of_loop_native_immutable_array', args: [[42, 8, 10]] })
    expect(r2.return).toBe(42n)
  })
  test('test_for_of_loop_native_mutable_array', async ({ appClientForOfLoopsAlgo }) => {
    const r1 = await appClientForOfLoopsAlgo.send.call({ method: 'test_for_of_loop_native_mutable_array', args: [[4, 8, 10]] })
    expect(r1.return).toBe(4n + 8n + 10n)
    const r2 = await appClientForOfLoopsAlgo.send.call({ method: 'test_for_of_loop_native_mutable_array', args: [[4, 8, 42]] })
    expect(r2.return).toBe(4n + 8n + 42n)
  })

  test('test_iterable_props', async ({ appClientForOfLoopsAlgo }) => {
    const result = await appClientForOfLoopsAlgo.send.call({
      method: 'test_iterable_props',
      args: [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9],
      ],
    })
    expect(result.return).toBe(3n * 6n)
  })
})
