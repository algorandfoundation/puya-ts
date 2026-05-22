import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, Account, assert, Asset, Contract } from '@algorandfoundation/algorand-typescript'

// example: REFERENCE_ACCOUNT_ASSET_EXAMPLE
export class ReferenceAccountAsset extends Contract {
  @abimethod()
  getAssetBalance(): uint64 {
    const acct = Account('WMHF4FLJNKY2BPFK7YPV5ID6OZ7LVDB2B66ZTXEAMLL2NX4WJZRJFVX66M')
    const asset = Asset(1185)
    assert(acct.isOptedIn(asset), 'Account is not opted in to the asset')
    return asset.balance(acct)
  }

  @abimethod()
  getAssetBalanceWithArg(acct: Account, asset: Asset): uint64 {
    assert(acct.isOptedIn(asset), 'Account is not opted in to the asset')
    return asset.balance(acct)
  }
}

// example: REFERENCE_ACCOUNT_ASSET_EXAMPLE
