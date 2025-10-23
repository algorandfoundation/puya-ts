import { algos } from '@algorandfoundation/algokit-utils'
import { describe, expect } from 'vitest'
import { bigIntToUint8Array } from '../../src/util'
import { createArc4TestFixture } from './util/test-fixture'

describe('gtxns contract', () => {
  const test = createArc4TestFixture({ path: 'tests/approvals/gtxns.algo.ts', contracts: { GtxnsAlgo: {} } })
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

  test('oca is enum and can be compared to enum values', async ({ appClientGtxnsAlgo }) => {
    const callTest3 = await appClientGtxnsAlgo.createTransaction.call({ method: 'test3', args: [] })

    await appClientGtxnsAlgo.send.call({ method: 'test4', args: [callTest3.transactions[0]] })
  })

  test('pay txn properties can be read', async ({ appClientGtxnsAlgo, algorand, testAccount, localnet }) => {
    await localnet.newScope()
    const result = await appClientGtxnsAlgo.send.call({
      method: 'reflectAllPay',
      args: [
        algorand.createTransaction.payment({
          amount: algos(1),
          receiver: appClientGtxnsAlgo.appAddress,
          sender: testAccount,
        }),
      ],
    })
    expect(Object.keys(result.return as object)).toEqual([
      'sender',
      'fee',
      'firstValid',
      'firstValidTime',
      'lastValid',
      'note',
      'lease',
      'typeBytes',
      'groupIndex',
      'txnId',
      'rekeyTo',
      'receiver',
      'amount',
      'closeRemainderTo',
    ])
  })

  test('gtxn union types compile correctly ', async ({ appClientGtxnsAlgo, algorand, testAccount }) => {
    const result = await appClientGtxnsAlgo.send.call({
      method: 'test5',
      args: [
        algorand.createTransaction.payment({
          amount: algos(1),
          receiver: appClientGtxnsAlgo.appAddress,
          sender: testAccount,
        }),
      ],
    })
    expect(result.return).toBe(1n)
  })
})
