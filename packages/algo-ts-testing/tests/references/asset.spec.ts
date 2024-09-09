import { afterEach } from "node:test";
import { describe, expect, it, test } from "vitest";
import { TestExecutionContext } from "../../src";
import { AssetCls } from "../../src/reference";
import { Account, Asset, Bytes, Uint64 } from "@algorandfoundation/algo-ts";
import { asBytes, asUint64 } from "../../src/util";
import { asUint8Array } from "../util";

describe('Asset', () => {
  const ctx = new TestExecutionContext()

  afterEach(() => {
    ctx.reset()
  })

  it('can be initialised', () => {
    let asset = new AssetCls()
    expect(asset.id.valueOf()).toBe(0n)

    asset = new AssetCls(123)
    expect(asset.id.valueOf()).toBe(123n)

    asset = new AssetCls(Uint64(456))
    expect(asset.id.valueOf()).toBe(456n)

    asset = new AssetCls(1n)
    expect(asset.id.valueOf()).toBe(1n)
  })

  it('can have balance set and retrieved', () => {
    const account = ctx.any.account()
    const asset = ctx.any.asset()
    ctx.ledger.updateAssetHolding(account, asset, 1000n)

    expect(asset.balance(account).valueOf()).toBe(1000n)
  })

  it('throws error for account not opted into when retrieving balance', () => {
    const account = ctx.any.account()
    const asset = ctx.any.asset()

    expect(() => asset.balance(account)).toThrowError('The asset is not opted into the account!')
  })

  test.each([
    true,
    false
  ])('can have frozen status set and retrieved', (defaultFrozen) => {
    const asset = ctx.any.asset({ defaultFrozen })
    const account = ctx.any.account({}, new Map([[asset.id, 0n]]))

    expect(asset.frozen(account)).toBe(defaultFrozen)
  })

  it('can have attributes set and retrieved', () => {
    const assetData = {
      total: asUint64(1000000),
      decimals: asUint64(6),
      defaultFrozen: false,
      unitName: asBytes("TEST"),
      name: asBytes("Test Asset"),
      url: asBytes("https://test.com"),
      metadataHash: Bytes(new Uint8Array(Array(32).fill(0x00))),
      manager: Account(),
      freeze: Account(),
      clawback: Account(),
      creator: Account(),
      reserve: Account(),
    }

    const asset  = ctx.any.asset(assetData)

    expect(asset.total.valueOf()).toBe(assetData.total.valueOf())
    expect(asset.decimals.valueOf()).toBe(assetData.decimals.valueOf())
    expect(asset.defaultFrozen).toBe(assetData.defaultFrozen)
    expect(asset.unitName.toString()).toEqual(assetData.unitName.toString())
    expect(asset.name.toString()).toEqual(assetData.name.toString())
    expect(asset.url.toString()).toEqual(assetData.url.toString())
    expect(asUint8Array(asset.metadataHash)).toEqual(asUint8Array(assetData.metadataHash))
    expect(asUint8Array(asset.manager.bytes)).toEqual(asUint8Array(assetData.manager.bytes))
    expect(asUint8Array(asset.freeze.bytes)).toEqual(asUint8Array(assetData.freeze.bytes))
    expect(asUint8Array(asset.clawback.bytes)).toEqual(asUint8Array(assetData.clawback.bytes))
    expect(asUint8Array(asset.creator.bytes)).toEqual(asUint8Array(assetData.creator.bytes))
    expect(asUint8Array(asset.reserve.bytes)).toEqual(asUint8Array(assetData.reserve.bytes))
  })

  it('throws error when asset is not in context', () => {
    const asset = new AssetCls(123)
    expect(() => asset.total).toThrowError('Unknown asset, check correct testing context is active')
  })
})
