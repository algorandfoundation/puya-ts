import type { uint64, Account, Asset } from '@algorandfoundation/algorand-typescript'
import { abimethod, assert, Contract, TemplateVar } from '@algorandfoundation/algorand-typescript'

// example: REFERENCE_ACCOUNT_ASSET_EXAMPLE
/**
 * Demonstrates how to reference both an account and an asset to read an
 * account's holding of a specific asset. Both references must be present
 * in the transaction's reference arrays at call time (the AlgoKit client
 * typically handles this automatically).
 */
export class ReferenceAccountAsset extends Contract {
  @abimethod()
  getAssetBalance(): uint64 {
    // Read the asset balance for a well-known account/asset pair, baked into
    // the program when it is compiled/deployed (`TMPL_KNOWN_ACCOUNT`,
    // `TMPL_KNOWN_ASSET`).
    const account = TemplateVar<Account>('KNOWN_ACCOUNT')
    const asset = TemplateVar<Asset>('KNOWN_ASSET')
    assert(account.isOptedIn(asset), 'Account is not opted in to the asset')
    return asset.balance(account)
  }

  @abimethod()
  getAssetBalanceWithArg(account: Account, asset: Asset): uint64 {
    // Same lookup, but with caller-supplied account and asset references.
    assert(account.isOptedIn(asset), 'Account is not opted in to the asset')
    return asset.balance(account)
  }
}

// example: REFERENCE_ACCOUNT_ASSET_EXAMPLE
