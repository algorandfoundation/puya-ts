import { algos } from '@algorandfoundation/algokit-utils'
import { describe, expect } from 'vitest'
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
})
