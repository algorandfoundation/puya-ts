import { algos, microAlgos } from '@algorandfoundation/algokit-utils'
import { describe, expect } from 'vitest'
import { createArc4TestFixture } from '../util/test-fixture'

// Behaviour tests for examples/devportal/inner_transactions.
// The app sends inner payments and creates/holds assets, so it's funded up-front (min-balance
// bumps). Inner transactions set fee: 0, so each call passes an extraFee to cover them.
describe('devportal inner_transactions example', () => {
  const test = createArc4TestFixture({
    paths: 'examples/devportal/inner_transactions/contract.algo.ts',
    contracts: {
      HelloWorldContract: {},
      InnerTransactions: { funding: algos(10) },
    },
  })

  test('HelloWorldContract.hello returns a greeting', async ({ appClientHelloWorldContract }) => {
    const result = await appClientHelloWorldContract.send.call({ method: 'hello', args: ['World'] })
    expect(result.return).toBe('Hello, World')
  })

  test('payment sends an inner payment and returns the amount', async ({ appClientInnerTransactions }) => {
    const result = await appClientInnerTransactions.send.call({
      method: 'payment',
      extraFee: microAlgos(1000n),
    })
    expect(result.return).toBe(5000n)
  })

  test('fungibleAssetCreate creates a fungible asset and returns its id', async ({ appClientInnerTransactions, algorand }) => {
    const result = await appClientInnerTransactions.send.call({
      method: 'fungibleAssetCreate',
      extraFee: microAlgos(1000n),
    })
    const assetId = result.return as bigint
    expect(assetId).toBeGreaterThan(0n)

    const info = await algorand.asset.getById(assetId)
    expect(info.total).toBe(100_000_000_000n)
    expect(info.decimals).toBe(2)
    expect(info.unitName).toBe('RP')
    expect(info.assetName).toBe('Royalty Points')
  })

  test('nonFungibleAssetCreate creates an asset and returns its id', async ({ appClientInnerTransactions, algorand }) => {
    const result = await appClientInnerTransactions.send.call({
      method: 'nonFungibleAssetCreate',
      extraFee: microAlgos(1000n),
    })
    const assetId = result.return as bigint
    expect(assetId).toBeGreaterThan(0n)

    const info = await algorand.asset.getById(assetId)
    expect(info.total).toBe(100n)
    expect(info.unitName).toBe('ML')
    expect(info.assetName).toBe('Mona Lisa')
  })

  // fungibleAssetCreate leaves manager/reserve/freeze/clawback unset, making the asset
  // immutable: an inner assetConfig against it fails because there is no manager to authorize it.
  test('assetConfig of an immutable asset is rejected', async ({ appClientInnerTransactions }) => {
    const created = await appClientInnerTransactions.send.call({
      method: 'fungibleAssetCreate',
      extraFee: microAlgos(1000n),
    })
    const assetId = created.return as bigint

    await expect(
      appClientInnerTransactions.send.call({
        method: 'assetConfig',
        args: [assetId],
        extraFee: microAlgos(1000n),
      }),
    ).rejects.toThrow()
  })

  test('assetOptIn opts the app account into an asset', async ({ appClientInnerTransactions, assetFactory, testAccount }) => {
    const asset = await assetFactory({
      assetName: 'optin-asset',
      unitName: 'opt',
      total: 1000n,
      decimals: 0,
      sender: testAccount.addr,
      defaultFrozen: false,
    })

    const result = await appClientInnerTransactions.send.call({
      method: 'assetOptIn',
      args: [asset],
      extraFee: microAlgos(1000n),
    })
    expect(result.confirmation.confirmedRound).toBeGreaterThan(0n)

    // The app account now holds the asset (balance 0).
    const info = await appClientInnerTransactions.algorand.asset.getAccountInformation(appClientInnerTransactions.appAddress, asset)
    expect(info.balance).toBe(0n)
  })

  test('assetTransfer moves an asset from the app account to a receiver', async ({
    appClientInnerTransactions,
    algorand,
    assetFactory,
    testAccount,
    localnet,
  }) => {
    const asset = await assetFactory({
      assetName: 'xfer-asset',
      unitName: 'xfr',
      total: 1000n,
      decimals: 0,
      sender: testAccount.addr,
      defaultFrozen: false,
    })

    // App opts in, then is funded with some units to send onwards.
    await appClientInnerTransactions.send.call({
      method: 'assetOptIn',
      args: [asset],
      extraFee: microAlgos(1000n),
    })
    await algorand.send.assetTransfer({
      assetId: asset,
      amount: 100n,
      receiver: appClientInnerTransactions.appAddress,
      sender: testAccount.addr,
    })

    const receiver = await localnet.context.generateAccount({ initialFunds: algos(1) })
    await algorand.send.assetOptIn({ assetId: asset, sender: receiver.addr })

    await appClientInnerTransactions.send.call({
      method: 'assetTransfer',
      args: [asset, receiver.addr.toString(), 10n],
      extraFee: microAlgos(1000n),
    })

    const info = await algorand.asset.getAccountInformation(receiver.addr, asset)
    expect(info.balance).toBe(10n)
  })

  test('multiInnerTxns submits a grouped payment and app call', async ({ appClientInnerTransactions, appClientHelloWorldContract }) => {
    const result = await appClientInnerTransactions.send.call({
      method: 'multiInnerTxns',
      args: [appClientHelloWorldContract.appId],
      extraFee: microAlgos(2000n),
    })
    expect(result.return).toStrictEqual([5000n, 'Hello, World'])
  })

  test('deployApp deploys an app and returns its id', async ({ appClientInnerTransactions }) => {
    const result = await appClientInnerTransactions.send.call({
      method: 'deployApp',
      extraFee: microAlgos(1000n),
    })
    expect(result.return).toBeGreaterThan(0n)
  })

  test('arc4DeployApp deploys an app and returns its id', async ({ appClientInnerTransactions }) => {
    const result = await appClientInnerTransactions.send.call({
      method: 'arc4DeployApp',
      extraFee: microAlgos(1000n),
    })
    expect(result.return).toBeGreaterThan(0n)
  })

  test('noopAppCall calls into a deployed HelloWorldContract', async ({ appClientInnerTransactions, appClientHelloWorldContract }) => {
    const result = await appClientInnerTransactions.send.call({
      method: 'noopAppCall',
      args: [appClientHelloWorldContract.appId],
      extraFee: microAlgos(3000n),
    })
    expect(result.return).toStrictEqual(['Hello, World', 'Hello, again'])
  })

  // nonFungibleAssetCreate makes the app account the asset's manager/reserve/freeze/clawback,
  // so the remaining asset-admin methods can run against it as one lifecycle.
  test('freezes, revokes, reconfigures and deletes an app-managed asset', async ({ appClientInnerTransactions, algorand, testAccount }) => {
    const created = await appClientInnerTransactions.send.call({
      method: 'nonFungibleAssetCreate',
      extraFee: microAlgos(1000n),
    })
    const assetId = created.return as bigint

    // Give the caller a holding to freeze and claw back.
    await algorand.send.assetOptIn({ assetId, sender: testAccount.addr })
    await appClientInnerTransactions.send.call({
      method: 'assetTransfer',
      args: [assetId, testAccount.addr.toString(), 10n],
      extraFee: microAlgos(1000n),
    })

    await appClientInnerTransactions.send.call({
      method: 'assetFreeze',
      args: [testAccount.addr.toString(), assetId],
      extraFee: microAlgos(1000n),
    })
    const frozenHolding = await algorand.asset.getAccountInformation(testAccount.addr, assetId)
    expect(frozenHolding.frozen).toBe(true)

    // Clawback bypasses the freeze and returns the units to the app.
    await appClientInnerTransactions.send.call({
      method: 'assetRevoke',
      args: [assetId, testAccount.addr.toString(), 10n],
      extraFee: microAlgos(1000n),
    })
    const revokedHolding = await algorand.asset.getAccountInformation(testAccount.addr, assetId)
    expect(revokedHolding.balance).toBe(0n)

    // Reconfigure: hand freeze/clawback to the caller (the app stays manager).
    await appClientInnerTransactions.send.call({
      method: 'assetConfig',
      args: [assetId],
      extraFee: microAlgos(1000n),
    })
    const reconfigured = await algorand.asset.getById(assetId)
    expect(reconfigured.freeze).toBe(testAccount.addr.toString())

    // All units are back with the creator, so the manager can destroy the asset.
    await appClientInnerTransactions.send.call({
      method: 'assetDelete',
      args: [assetId],
      extraFee: microAlgos(1000n),
    })
    await expect(algorand.asset.getById(assetId)).rejects.toThrow()
  })
})
