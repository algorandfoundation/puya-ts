import { algos } from '@algorandfoundation/algokit-utils'
import type { AppClient } from '@algorandfoundation/algokit-utils/app-client'
import type { AppFactory } from '@algorandfoundation/algokit-utils/app-factory'
import type { AlgorandFixture } from '@algorandfoundation/algokit-utils/testing'
import { describe, expect } from 'vitest'
import { createArc4TestFixture } from '../util/test-fixture'

// Behaviour tests for examples/devportal/reference_account_asset.
// The no-arg `getAssetBalance` reads a well-known account/asset pair baked into the
// program via `TMPL_KNOWN_ACCOUNT` / `TMPL_KNOWN_ASSET`, so each scenario deploys a
// fresh instance with those deploy-time template params filled. The AlgoKit client
// auto-populates the account + asset references at call time.
describe('devportal reference_account_asset example', () => {
  const test = createArc4TestFixture({
    paths: 'examples/devportal/reference_account_asset/contract.algo.ts',
    contracts: { ReferenceAccountAsset: {} },
  })

  // Deploy a fresh ReferenceAccountAsset with both template variables filled.
  const deploy = async (factory: AppFactory, knownAccount: Uint8Array, knownAssetId: bigint): Promise<AppClient> => {
    const { appClient } = await factory.send.bare.create({
      deployTimeParams: { KNOWN_ACCOUNT: knownAccount, KNOWN_ASSET: knownAssetId },
    })
    return appClient
  }

  // Create and fund a fresh account so it can opt into / hold assets.
  const fundedAccount = (localnet: AlgorandFixture) => localnet.context.generateAccount({ initialFunds: algos(1) })

  test('known pair: the no-arg variant reads the template-provided account/asset holding', async ({
    appFactoryReferenceAccountAsset,
    assetFactory,
    testAccount,
    algorand,
    localnet,
  }) => {
    const holder = await fundedAccount(localnet)
    // A fresh asset created by (and fully held by) the test account.
    const asset = await assetFactory({ assetName: 'Balance Asset', sender: testAccount.addr, total: 10_000_000n, decimals: 0 })

    // opt-in: 0-amount transfer from the holder to itself, then receive some units.
    await algorand.send.assetTransfer({ sender: holder.addr.toString(), receiver: holder.addr.toString(), assetId: asset, amount: 0n })
    const transferAmount = 777n
    await algorand.send.assetTransfer({
      sender: testAccount.addr,
      receiver: holder.addr.toString(),
      assetId: asset,
      amount: transferAmount,
    })

    const appClient = await deploy(appFactoryReferenceAccountAsset, holder.addr.publicKey, asset)

    const result = await appClient.send.call({ method: 'getAssetBalance' })
    expect(result.return).toBe(transferAmount)
  })

  test('known pair: a template-provided account that never opted in trips the assertion', async ({
    appFactoryReferenceAccountAsset,
    assetFactory,
    testAccount,
    localnet,
  }) => {
    const holder = await fundedAccount(localnet)
    const asset = await assetFactory({ assetName: 'Unowned Asset', sender: testAccount.addr, total: 10_000_000n, decimals: 0 })

    const appClient = await deploy(appFactoryReferenceAccountAsset, holder.addr.publicKey, asset)

    await expect(appClient.send.call({ method: 'getAssetBalance' })).rejects.toThrow(/not opted in|AssetBalance/)
  })

  test('with-arg: reads an opted-in account holding after a transfer', async ({
    appFactoryReferenceAccountAsset,
    assetFactory,
    testAccount,
    algorand,
    localnet,
  }) => {
    const asset = await assetFactory({ assetName: 'Balance Asset', sender: testAccount.addr, total: 10_000_000n, decimals: 0 })
    // The template pair is unused by this method but must still be filled at deploy time.
    const appClient = await deploy(appFactoryReferenceAccountAsset, testAccount.addr.publicKey, asset)

    const holder = await fundedAccount(localnet)
    // opt-in: 0-amount transfer from the holder to itself.
    await algorand.send.assetTransfer({ sender: holder.addr.toString(), receiver: holder.addr.toString(), assetId: asset, amount: 0n })
    // transfer some units from the asset creator to the holder.
    const transferAmount = 1234n
    await algorand.send.assetTransfer({
      sender: testAccount.addr,
      receiver: holder.addr.toString(),
      assetId: asset,
      amount: transferAmount,
    })

    const result = await appClient.send.call({
      method: 'getAssetBalanceWithArg',
      args: [holder.addr.toString(), asset],
    })
    expect(result.return).toBe(transferAmount)
  })

  test('with-arg: an opted-in account that received nothing has a zero holding', async ({
    appFactoryReferenceAccountAsset,
    assetFactory,
    testAccount,
    algorand,
    localnet,
  }) => {
    const asset = await assetFactory({ assetName: 'Balance Asset', sender: testAccount.addr, total: 10_000_000n, decimals: 0 })
    const appClient = await deploy(appFactoryReferenceAccountAsset, testAccount.addr.publicKey, asset)

    const holder = await fundedAccount(localnet)
    // opt-in only: 0-amount transfer from the holder to itself.
    await algorand.send.assetTransfer({ sender: holder.addr.toString(), receiver: holder.addr.toString(), assetId: asset, amount: 0n })

    const result = await appClient.send.call({
      method: 'getAssetBalanceWithArg',
      args: [holder.addr.toString(), asset],
    })
    expect(result.return).toBe(0n)
  })

  test('with-arg: an account that never opted into the asset trips the assertion', async ({
    appFactoryReferenceAccountAsset,
    assetFactory,
    testAccount,
    localnet,
  }) => {
    const asset = await assetFactory({ assetName: 'Balance Asset', sender: testAccount.addr, total: 10_000_000n, decimals: 0 })
    const appClient = await deploy(appFactoryReferenceAccountAsset, testAccount.addr.publicKey, asset)

    const holder = await fundedAccount(localnet)
    await expect(
      appClient.send.call({
        method: 'getAssetBalanceWithArg',
        args: [holder.addr.toString(), asset],
      }),
    ).rejects.toThrow(/not opted in|AssetBalance/)
  })
})
