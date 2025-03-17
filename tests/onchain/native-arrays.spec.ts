import { describe, expect } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('native arrays', () => {
  const test = createArc4TestFixture('tests/approvals/native-arrays.algo.ts', {
    NativeArraysAlgo: {},
  })
  test('it runs', async ({ appClientNativeArraysAlgo }) => {
    await appClientNativeArraysAlgo.send.call({ method: 'doThings', args: [] })
  })
  test('works with arc4 values', async ({ appClientNativeArraysAlgo }) => {
    await appClientNativeArraysAlgo.send.call({ method: 'arc4Interop', args: [] })
  })
  test('works with native structs', async ({ appClientNativeArraysAlgo }) => {
    const result = await appClientNativeArraysAlgo.send.call({ method: 'structs', args: [{ x: 5, y: 3 }] })
    expect(result.return).toStrictEqual([[5n, 3n]])
  })
})
