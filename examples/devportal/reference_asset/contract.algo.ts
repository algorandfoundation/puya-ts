import type { uint64, Asset } from '@algorandfoundation/algorand-typescript'
import { abimethod, Contract, TemplateVar } from '@algorandfoundation/algorand-typescript'

// example: GET_ASSET_REFERENCE_EXAMPLE
/**
 * Demonstrates accessing properties of an external asset. The asset is
 * either baked into the program via a template variable or supplied as a
 * method argument. Either way, it must be present in the transaction's
 * reference array at call time (the AlgoKit client typically handles this
 * automatically).
 */
export class ReferenceAsset extends Contract {
  @abimethod()
  getAssetTotalSupply(): uint64 {
    // Read the total supply of a well-known asset, baked into the program
    // when it is compiled/deployed (`TMPL_KNOWN_ASSET`).
    const asset = TemplateVar<Asset>('KNOWN_ASSET')
    return asset.total
  }

  @abimethod()
  getAssetTotalSupplyWithArg(asset: Asset): uint64 {
    // Same lookup, but with a caller-supplied asset reference.
    return asset.total
  }
}

// example: GET_ASSET_REFERENCE_EXAMPLE
