import { algos } from '@algorandfoundation/algokit-utils'
import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('reference arrays', () => {
  const test = createArc4TestFixture({
    paths: 'tests/approvals/reference-arrays.algo.ts',
    contracts: {
      ReferenceArraysAlgo: {},
    },
  })
  test('it runs', async ({ appClientReferenceArraysAlgo }) => {
    await appClientReferenceArraysAlgo.send.call({ method: 'test', args: [5], extraFee: algos(1) })
  })
})
