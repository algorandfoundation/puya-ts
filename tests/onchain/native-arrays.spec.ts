import { algos } from '@algorandfoundation/algokit-utils'
import { describe, expect } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('native arrays', () => {
  const test = createArc4TestFixture({
    path: 'tests/approvals/native-arrays.algo.ts',
    contracts: {
      NativeArraysAlgo: {},
    },
  })
  test('it runs', async ({ appClientNativeArraysAlgo }) => {
    await appClientNativeArraysAlgo.send.call({ method: 'doThings', args: [], extraFee: algos(1) })
  })
  test('works with arc4 values', async ({ appClientNativeArraysAlgo }) => {
    await appClientNativeArraysAlgo.send.call({ method: 'arc4Interop', args: [] })
  })
  test('works with native structs', async ({ appClientNativeArraysAlgo }) => {
    const result = await appClientNativeArraysAlgo.send.call({ method: 'structs', args: [{ x: 5, y: 3 }] })
    expect(result.return).toStrictEqual([[5n, 3n]])
  })
  test('works with fixed arrays', async ({ appClientNativeArraysAlgo }) => {
    await appClientNativeArraysAlgo.send.call({ method: 'fixedArray', args: [Array(50).fill(0)] })
  })
  test('works with read only arrays', async ({ appClientNativeArraysAlgo }) => {
    await appClientNativeArraysAlgo.send.call({ method: 'readonlyArray', args: [] })
  })
  test('works with booleans', async ({ appClientNativeArraysAlgo }) => {
    expect((await appClientNativeArraysAlgo.send.call({ method: 'booleans' })).return).toStrictEqual([true, false, true])
    expect((await appClientNativeArraysAlgo.send.call({ method: 'booleansStatic' })).return).toStrictEqual([true, false, true])
    expect((await appClientNativeArraysAlgo.send.call({ method: 'arc4Booleans' })).return).toStrictEqual([true, false, true])
    expect((await appClientNativeArraysAlgo.send.call({ method: 'arc4BooleansStatic' })).return).toStrictEqual([true, false, true])
  })
})
