import { describe } from 'vitest'
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
})
