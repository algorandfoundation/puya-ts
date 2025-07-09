import { microAlgos } from '@algorandfoundation/algokit-utils'
import { describe, expect } from 'vitest'
import { invariant } from '../../src/util'
import { createArc4TestFixture } from './util/test-fixture'

describe('large-objects-in-state', () => {
  const test = createArc4TestFixture('tests/approvals/large-objects-in-state.algo.ts', { LargeObjectsInStateAlgo: {} })

  test('it runs', async ({ appFactoryLargeObjectsInStateAlgo, algorand, testAccount }) => {
    const { appClient } = await appFactoryLargeObjectsInStateAlgo.send.bare.create({})

    const { return: mbr } = await appClient.send.call({ method: 'getMbr' })

    invariant(typeof mbr === 'bigint', 'mbr must be bigint')

    const fund = algorand.createTransaction.payment({
      receiver: appClient.appAddress,
      amount: microAlgos(mbr),
      sender: testAccount,
    })

    await appClient.send.call({ method: 'bootstrap', args: [fund], boxReferences: ['x', 'x', 'x', 'x'] })

    await appClient.send.call({ method: 'increaseXCount', args: [0, 1] })
    const { return: item0 } = await appClient.send.call({ method: 'getCounts', args: [0] })
    const { return: item50 } = await appClient.send.call({ method: 'getCounts', args: [50] })

    expect(item0).toEqual({ x: 1n, y: 0 })
    expect(item50).toEqual({ x: 0n, y: 0 })
  })
})
