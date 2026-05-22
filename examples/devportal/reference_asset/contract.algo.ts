import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, Asset, Contract } from '@algorandfoundation/algorand-typescript'

// example: GET_ASSET_REFERENCE_EXAMPLE
export class ReferenceAsset extends Contract {
  @abimethod()
  getAssetTotalSupply(): uint64 {
    return Asset(1185).total
  }

  @abimethod()
  getAssetTotalSupplyWithArg(asset: Asset): uint64 {
    return asset.total
  }
}

// example: GET_ASSET_REFERENCE_EXAMPLE
