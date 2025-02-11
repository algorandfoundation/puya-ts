import { algos } from '@algorandfoundation/algokit-utils'
import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('mutable arrays', () => {
  const test = createArc4TestFixture('tests/approvals/mutable-arrays.algo.ts', {
    MutableArraysAlgo: {},
  })
  test('it runs', async ({ appClientMutableArraysAlgo }) => {
    await appClientMutableArraysAlgo.send.call({ method: 'test', args: [5], extraFee: algos(1) })
  })
})
