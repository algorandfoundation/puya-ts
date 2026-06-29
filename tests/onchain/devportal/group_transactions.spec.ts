import { algos, microAlgos } from '@algorandfoundation/algokit-utils'
import type { AppClient } from '@algorandfoundation/algokit-utils/app-client'
import type { AppFactory } from '@algorandfoundation/algokit-utils/app-factory'
import type { AssetCreateParams } from '@algorandfoundation/algokit-utils/composer'
import { describe, expect } from 'vitest'
import { createArc4TestFixture } from '../util/test-fixture'

// Behaviour tests for examples/devportal/group_transactions.
// Mirrors the canonical Python tests: two ways of reading sibling transactions
// (index lookup and typed ABI arguments) plus group-position guards.
describe('devportal group_transactions example', () => {
  const test = createArc4TestFixture({
    paths: 'examples/devportal/group_transactions/contract.algo.ts',
    // optInToAsset sends an inner asset-transfer, and the app also receives
    // payments during a test group, so it needs a balance to stay above its
    // minimum.
    contracts: { GroupTransactions: { funding: algos(1) } },
  })

  // Deploy a second, distinct instance of the same contract (a unique appName
  // avoids idempotent reuse of the fixture's primary app) and fund it so it can
  // sit in a group alongside the first.
  const deploySecondInstance = async (appFactory: AppFactory): Promise<AppClient> => {
    const { appClient } = await appFactory.deploy({ appName: 'GroupTransactions-observer' })
    await appClient.fundAppAccount({ amount: microAlgos(200_000n) })
    return appClient
  }

  // Opt the (already-funded) app account into a fresh asset via the contract's
  // inner zero-amount transfer, so it can be the recipient of asset transfers.
  const optIntoAsset = async (client: AppClient, asset: bigint) => {
    await client.send.call({ method: 'optInToAsset', args: [asset], extraFee: microAlgos(1000n) })
  }

  const createAsset = async (
    assetFactory: (params: AssetCreateParams) => Promise<bigint>,
    sender: AssetCreateParams['sender'],
    name: string,
  ) =>
    assetFactory({
      assetName: name,
      unitName: name.slice(0, 3),
      total: 10_000_000n,
      decimals: 0,
      sender,
      defaultFrozen: false,
    })

  test('expectPayment validates the payment immediately preceding the app call', async ({
    appClientGroupTransactions,
    algorand,
    testAccount,
  }) => {
    // [Payment -> AppCall]: expectPayment reads the txn at groupIndex - 1.
    const result = await algorand
      .newGroup()
      .addPayment({
        amount: microAlgos(12345n),
        receiver: appClientGroupTransactions.appAddress,
        sender: testAccount,
      })
      .addAppCallMethodCall(await appClientGroupTransactions.params.call({ method: 'expectPayment', args: [12345n] }))
      .send()

    expect(result.returns?.at(-1)?.returnValue).toBe(12345n)
  })

  test('expectPayment rejects when the payment amount does not match', async ({ appClientGroupTransactions, algorand, testAccount }) => {
    await expect(
      algorand
        .newGroup()
        .addPayment({
          amount: microAlgos(1000n),
          receiver: appClientGroupTransactions.appAddress,
          sender: testAccount,
        })
        .addAppCallMethodCall(await appClientGroupTransactions.params.call({ method: 'expectPayment', args: [9999n] }))
        .send(),
    ).rejects.toThrow(/wrong payment amount/)
  })

  test('expectPayment rejects when there is no preceding transaction', async ({ appClientGroupTransactions }) => {
    // Called on its own (groupIndex 0), so groupIndex - 1 has no transaction.
    await expect(appClientGroupTransactions.send.call({ method: 'expectPayment', args: [1n] })).rejects.toThrow()
  })

  test('receiveFunding binds a payment and an asset transfer as typed ABI arguments', async ({
    appClientGroupTransactions,
    algorand,
    assetFactory,
    testAccount,
  }) => {
    const asset = await createAsset(assetFactory, testAccount.addr, 'fund')
    await optIntoAsset(appClientGroupTransactions, asset)

    // Two transaction args bind positionally: the group is [pay, axfer, call],
    // exactly the parameter declaration order, ending at the app call.
    const result = await appClientGroupTransactions.send.call({
      method: 'receiveFunding',
      args: [
        await algorand.createTransaction.payment({
          amount: microAlgos(54321n),
          receiver: appClientGroupTransactions.appAddress,
          sender: testAccount,
        }),
        await algorand.createTransaction.assetTransfer({
          assetId: asset,
          amount: 1000n,
          receiver: appClientGroupTransactions.appAddress,
          sender: testAccount,
        }),
        asset,
        54321n,
      ],
    })

    expect(result.return).toBe(54321n + 1000n)
  })

  test('receiveFunding rejects when the payment amount is wrong', async ({
    appClientGroupTransactions,
    algorand,
    assetFactory,
    testAccount,
  }) => {
    const asset = await createAsset(assetFactory, testAccount.addr, 'fund2')
    await optIntoAsset(appClientGroupTransactions, asset)

    await expect(
      appClientGroupTransactions.send.call({
        method: 'receiveFunding',
        args: [
          await algorand.createTransaction.payment({
            amount: microAlgos(100n),
            receiver: appClientGroupTransactions.appAddress,
            sender: testAccount,
          }),
          await algorand.createTransaction.assetTransfer({
            assetId: asset,
            amount: 1000n,
            receiver: appClientGroupTransactions.appAddress,
            sender: testAccount,
          }),
          asset,
          200n,
        ],
      }),
    ).rejects.toThrow(/wrong payment amount/)
  })

  test('receiveFunding rejects when the transaction arguments are supplied in the wrong order', async ({
    appClientGroupTransactions,
    algorand,
    assetFactory,
    testAccount,
  }) => {
    const asset = await createAsset(assetFactory, testAccount.addr, 'fund3')
    await optIntoAsset(appClientGroupTransactions, asset)

    // Swapping the transactions puts an AssetTransfer where the router asserts
    // a Payment (and vice versa); rejected client-side or on-chain.
    await expect(
      appClientGroupTransactions.send.call({
        method: 'receiveFunding',
        args: [
          await algorand.createTransaction.assetTransfer({
            assetId: asset,
            amount: 1000n,
            receiver: appClientGroupTransactions.appAddress,
            sender: testAccount,
          }),
          await algorand.createTransaction.payment({
            amount: microAlgos(100n),
            receiver: appClientGroupTransactions.appAddress,
            sender: testAccount,
          }),
          asset,
          100n,
        ],
      }),
    ).rejects.toThrow()
  })

  test('chainedAppCall decodes the lastLog of the app call at groupIndex - 1', async ({
    appClientGroupTransactions,
    appFactoryGroupTransactions,
    algorand,
    testAccount,
  }) => {
    const chained = appClientGroupTransactions
    const observer = await deploySecondInstance(appFactoryGroupTransactions)

    // group: [payment, expectPayment (chained), chainedAppCall (observer)]
    const result = await algorand
      .newGroup()
      .addPayment({
        amount: microAlgos(777n),
        receiver: chained.appAddress,
        sender: testAccount,
      })
      .addAppCallMethodCall(await chained.params.call({ method: 'expectPayment', args: [777n] }))
      .addAppCallMethodCall(await observer.params.call({ method: 'chainedAppCall', args: [] }))
      .send()

    expect(result.returns?.at(-1)?.returnValue).toBe(777n)
  })

  test('observeAppCall reads the lastLog of a preceding app call passed as a typed argument', async ({
    appClientGroupTransactions,
    appFactoryGroupTransactions,
    algorand,
    testAccount,
  }) => {
    const chained = appClientGroupTransactions
    const observer = await deploySecondInstance(appFactoryGroupTransactions)

    // `prior` is supplied as the typed txn arg, so it is placed immediately
    // before the observe call; its own preceding payment is added explicitly,
    // giving [payment, prior, observe].
    const prior = await chained.params.call({ method: 'expectPayment', args: [321n] })
    const result = await algorand
      .newGroup()
      .addPayment({
        amount: microAlgos(321n),
        receiver: chained.appAddress,
        sender: testAccount,
      })
      .addAppCallMethodCall(await observer.params.call({ method: 'observeAppCall', args: [prior] }))
      .send()

    expect(result.returns?.at(-1)?.returnValue).toBe(321n)
  })

  test('strictPosition accepts a fixed [Payment, AppCall, AssetTransfer] shape', async ({
    appClientGroupTransactions,
    algorand,
    assetFactory,
    testAccount,
  }) => {
    const asset = await createAsset(assetFactory, testAccount.addr, 'strict')

    // [Payment(0), AppCall(1), AssetTransfer(2)]; pay.sender == axfer.assetReceiver.
    const result = await algorand
      .newGroup()
      .addPayment({
        amount: microAlgos(0n),
        receiver: appClientGroupTransactions.appAddress,
        sender: testAccount,
      })
      .addAppCallMethodCall(await appClientGroupTransactions.params.call({ method: 'strictPosition', args: [3n] }))
      .addAssetTransfer({
        assetId: asset,
        amount: 0n,
        receiver: testAccount.addr,
        sender: testAccount,
      })
      .send()

    expect(result.confirmations.length).toBe(3)
  })

  test('strictPosition rejects when the group size is wrong', async ({ appClientGroupTransactions, algorand, testAccount }) => {
    // Only two transactions in the group, but strictPosition is told to expect three.
    await expect(
      algorand
        .newGroup()
        .addPayment({
          amount: microAlgos(0n),
          receiver: appClientGroupTransactions.appAddress,
          sender: testAccount,
        })
        .addAppCallMethodCall(await appClientGroupTransactions.params.call({ method: 'strictPosition', args: [3n] }))
        .send(),
    ).rejects.toThrow(/wrong group size/)
  })

  test('strictPosition rejects when it is not at index 1', async ({ appClientGroupTransactions, algorand, assetFactory, testAccount }) => {
    const asset = await createAsset(assetFactory, testAccount.addr, 'strict2')

    // App call is at index 0, not index 1.
    await expect(
      algorand
        .newGroup()
        .addAppCallMethodCall(await appClientGroupTransactions.params.call({ method: 'strictPosition', args: [3n] }))
        .addPayment({
          amount: microAlgos(0n),
          receiver: appClientGroupTransactions.appAddress,
          sender: testAccount,
        })
        .addAssetTransfer({
          assetId: asset,
          amount: 0n,
          receiver: testAccount.addr,
          sender: testAccount,
        })
        .send(),
    ).rejects.toThrow(/must be index 1/)
  })

  test('expectAssetTransfer rejects when there is no preceding transaction', async ({
    appClientGroupTransactions,
    assetFactory,
    testAccount,
  }) => {
    const asset = await createAsset(assetFactory, testAccount.addr, 'axfer')

    await expect(appClientGroupTransactions.send.call({ method: 'expectAssetTransfer', args: [asset] })).rejects.toThrow()
  })

  test('expectAssetTransfer rejects when the preceding transaction is the wrong type', async ({
    appClientGroupTransactions,
    algorand,
    assetFactory,
    testAccount,
  }) => {
    const asset = await createAsset(assetFactory, testAccount.addr, 'axfer2')

    // A Payment precedes the call where an AssetTransfer is expected, so the
    // gtxn.AssetTransferTxn(...) typed lookup itself fails.
    await expect(
      algorand
        .newGroup()
        .addPayment({
          amount: microAlgos(1000n),
          receiver: appClientGroupTransactions.appAddress,
          sender: testAccount,
        })
        .addAppCallMethodCall(await appClientGroupTransactions.params.call({ method: 'expectAssetTransfer', args: [asset] }))
        .send(),
    ).rejects.toThrow()
  })

  test('expectAssetTransfer validates the asset transfer immediately preceding the app call', async ({
    appClientGroupTransactions,
    algorand,
    assetFactory,
    testAccount,
  }) => {
    const asset = await createAsset(assetFactory, testAccount.addr, 'prev')
    await optIntoAsset(appClientGroupTransactions, asset)

    // [AssetTransfer -> AppCall]: expectAssetTransfer reads groupIndex - 1.
    const result = await algorand
      .newGroup()
      .addAssetTransfer({
        assetId: asset,
        amount: 750n,
        receiver: appClientGroupTransactions.appAddress,
        sender: testAccount,
      })
      .addAppCallMethodCall(await appClientGroupTransactions.params.call({ method: 'expectAssetTransfer', args: [asset] }))
      .send()

    expect(result.returns?.at(-1)?.returnValue).toBe(750n)
  })
})
