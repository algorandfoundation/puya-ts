import { Account, Asset, Bytes, bytes, gtxn, internal, Uint64, uint64 } from '@algorandfoundation/algo-ts'
import { lazyContext } from '../context-helpers/internal-context'
import { asMaybeUint64Cls, asUint64 } from '../util'

const resolveAssetIndex = (assetIdOrIndex: internal.primitives.StubUint64Compat): uint64 => {
  const input = asUint64(assetIdOrIndex)
  if (input >= 1001) {
    return input
  }
  const txn = lazyContext.activeGroup.activeTransaction as gtxn.ApplicationTxn
  return txn.assets(input).id
}

const getAsset = (asset: Asset | internal.primitives.StubUint64Compat): Asset | undefined => {
  try {
    const assetId = asMaybeUint64Cls(asset)
    if (assetId !== undefined) {
      return lazyContext.ledger.getAsset(resolveAssetIndex(assetId))
    }
    return asset as Asset
  } catch {
    return undefined
  }
}

export const AssetParams: internal.opTypes.AssetParamsType = {
  assetTotal: function (a: Asset | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [Uint64(0), false] : [asset.total, true]
  },
  assetDecimals: function (a: Asset | internal.primitives.StubUint64Compat): readonly [uint64, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [Uint64(0), false] : [asset.decimals, true]
  },
  assetDefaultFrozen: function (a: Asset | internal.primitives.StubUint64Compat): readonly [boolean, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [false, false] : [asset.defaultFrozen, true]
  },
  assetUnitName: function (a: Asset | internal.primitives.StubUint64Compat): readonly [bytes, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [Bytes(), false] : [asset.unitName, true]
  },
  assetName: function (a: Asset | internal.primitives.StubUint64Compat): readonly [bytes, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [Bytes(), false] : [asset.name, true]
  },
  assetUrl: function (a: Asset | internal.primitives.StubUint64Compat): readonly [bytes, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [Bytes(), false] : [asset.url, true]
  },
  assetMetadataHash: function (a: Asset | internal.primitives.StubUint64Compat): readonly [bytes, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [Bytes(), false] : [asset.metadataHash, true]
  },
  assetManager: function (a: Asset | internal.primitives.StubUint64Compat): readonly [Account, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [Account(), false] : [asset.manager, true]
  },
  assetReserve: function (a: Asset | internal.primitives.StubUint64Compat): readonly [Account, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [Account(), false] : [asset.reserve, true]
  },
  assetFreeze: function (a: Asset | internal.primitives.StubUint64Compat): readonly [Account, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [Account(), false] : [asset.freeze, true]
  },
  assetClawback: function (a: Asset | internal.primitives.StubUint64Compat): readonly [Account, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [Account(), false] : [asset.clawback, true]
  },
  assetCreator: function (a: Asset | internal.primitives.StubUint64Compat): readonly [Account, boolean] {
    const asset = getAsset(a)
    return asset === undefined ? [Account(), false] : [asset.creator, true]
  },
}
