import { algos } from '@algorandfoundation/algokit-utils'
import { describe, expect } from 'vitest'
import { bigIntToUint8Array } from '../../src/util'
import { createArc4TestFixture } from './util/test-fixture'

describe('gtxns contract', () => {
  const test = createArc4TestFixture('tests/approvals/gtxns.algo.ts', { GtxnsAlgo: {} })
  test('it verifies the txn type', async ({ appClientGtxnsAlgo, algorand, testAccount }) => {
    const call = await appClientGtxnsAlgo.createTransaction.call({ method: 'test', args: [] })

    await algorand
      .newGroup()
      .addPayment({
        amount: algos(1),
        receiver: appClientGtxnsAlgo.appAddress,
        sender: testAccount,
      })
      .addTransaction(call.transactions[0])
      .send()

    await expect(appClientGtxnsAlgo.send.call({ method: 'test', args: [] }), 'If gtxn 0 is not pay, should throw').rejects.toThrow(
      /transaction type is pay/,
    )
  })

  test('it disambiguates union types', async ({ appClientGtxnsAlgo, algorand, testAccount }) => {
    const call = await appClientGtxnsAlgo.createTransaction.call({ method: 'test2', args: [] })

    const result = await algorand
      .newGroup()
      .addPayment({
        amount: algos(1),
        receiver: appClientGtxnsAlgo.appAddress,
        sender: testAccount,
      })
      .addAssetCreate({
        assetName: 'Testing',
        unitName: 'x',
        sender: testAccount,
        total: 1n,
      })
      .addTransaction(call.transactions[0])
      .send()
    expect(result.confirmations[2].logs).toStrictEqual([
      appClientGtxnsAlgo.appAddress.publicKey,
      bigIntToUint8Array(0n, 8),
      bigIntToUint8Array(appClientGtxnsAlgo.appId, 8),
    ])
  })
})
