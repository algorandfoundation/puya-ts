import type { AppClient } from '@algorandfoundation/algokit-utils/app-client'
import type { AppFactory } from '@algorandfoundation/algokit-utils/app-factory'
import crypto from 'node:crypto'
import { describe, expect } from 'vitest'
import { createArc4TestFixture } from '../util/test-fixture'

// Behaviour tests for examples/devportal/reference_asset.
//
// ReferenceAsset reads the total supply of an asset that is either baked into
// the program via the `TMPL_KNOWN_ASSET` template variable or supplied as a
// method argument, so each test deploys a fresh app with the template variable
// filled, mirroring the Python `_deploy` helper.
describe('devportal reference_asset example', () => {
  const test = createArc4TestFixture({
    paths: 'examples/devportal/reference_asset/contract.algo.ts',
    contracts: { ReferenceAsset: {} },
  })

  // the asset factory below creates assets with this total supply
  const ASSET_TOTAL = 10_000_000n

  // Deploy ReferenceAsset with the TMPL_KNOWN_ASSET template variable filled.
  async function deploy(factory: AppFactory, knownAssetId: bigint): Promise<AppClient> {
    const { appClient } = await factory.send.bare.create({
      deployTimeParams: { KNOWN_ASSET: knownAssetId },
      note: crypto.randomBytes(8),
    })
    return appClient
  }

  async function newAsset(
    assetFactory: (p: { sender: string; total: bigint; decimals: number }) => Promise<bigint>,
    sender: string,
  ): Promise<bigint> {
    return assetFactory({ sender, total: ASSET_TOTAL, decimals: 0 })
  }

  test('the template-provided asset total supply is read by the no-arg variant', async ({
    appFactoryReferenceAsset,
    assetFactory,
    testAccount,
  }) => {
    const assetA = await newAsset(assetFactory, testAccount.addr.toString())
    const client = await deploy(appFactoryReferenceAsset, assetA)

    const result = await client.send.call({ method: 'getAssetTotalSupply' })
    expect(result.return).toBe(ASSET_TOTAL)
  })

  test('a destroyed asset id no longer resolves, so reading total fails', async ({ appFactoryReferenceAsset, algorand, testAccount }) => {
    // create an asset (with a manager so it can be destroyed) then destroy it
    const { assetId } = await algorand.send.assetCreate({
      sender: testAccount.addr,
      total: 1n,
      manager: testAccount.addr,
    })
    await algorand.send.assetDestroy({ sender: testAccount.addr, assetId })

    const client = await deploy(appFactoryReferenceAsset, assetId)

    await expect(client.send.call({ method: 'getAssetTotalSupply' })).rejects.toThrow()
  })

  test('the with-argument variant reads the real total supply of a created asset', async ({
    appFactoryReferenceAsset,
    assetFactory,
    testAccount,
  }) => {
    const assetA = await newAsset(assetFactory, testAccount.addr.toString())
    const client = await deploy(appFactoryReferenceAsset, assetA)

    const result = await client.send.call({ method: 'getAssetTotalSupplyWithArg', args: [assetA] })
    expect(result.return).toBe(ASSET_TOTAL)
  })

  test('each distinct asset reference returns its own total supply', async ({ appFactoryReferenceAsset, assetFactory, testAccount }) => {
    const assetA = await newAsset(assetFactory, testAccount.addr.toString())
    const assetB = await newAsset(assetFactory, testAccount.addr.toString())
    const client = await deploy(appFactoryReferenceAsset, assetA)

    for (const assetId of [assetA, assetB]) {
      const result = await client.send.call({
        method: 'getAssetTotalSupplyWithArg',
        args: [assetId],
        note: crypto.randomBytes(8),
      })
      expect(result.return).toBe(ASSET_TOTAL)
    }
  })
})
