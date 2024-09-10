import { Account, Application, Asset, BaseContract, internal } from '@algorandfoundation/algo-ts'
import { MAX_UINT64 } from '../constants'
import { AccountData, AssetHolding } from '../impl/account'
import { ApplicationData } from '../impl/application'
import { AssetData } from '../impl/asset'
import { asBigInt, asBytesCls, asMaybeBytesCls, asMaybeUint64Cls, asUint64, asUint64Cls, iterBigInt } from '../util'

export class LedgerContext {
  appIdIter = iterBigInt(1001n, MAX_UINT64)
  assetIdIter = iterBigInt(1001n, MAX_UINT64)
  applicationDataMap = new Map<bigint, ApplicationData>()
  appIdContractMap = new Map<bigint, BaseContract>()
  accountDataMap = new Map<string, AccountData>()
  assetDataMap = new Map<bigint, AssetData>()

  addAppIdContractMap(appId: internal.primitives.StubUint64Compat, contract: BaseContract): void {
    this.appIdContractMap.set(asBigInt(appId), contract)
  }

  getAsset(assetId: internal.primitives.StubUint64Compat): Asset {
    const id = asBigInt(assetId)
    if (this.assetDataMap.has(id)) {
      return Asset(asUint64(id))
    }
    throw internal.errors.internalError('Unknown asset, check correct testing context is active')
  }

  getApplication(applicationId: internal.primitives.StubUint64Compat): Application {
    const id = asBigInt(applicationId)
    if (this.applicationDataMap.has(id)) {
      return Application(asUint64(id))
    }
    throw internal.errors.internalError('Unknown application, check correct testing context is active')
  }
  getApplicationForContract(contract: BaseContract): Application {
    for (const [appId, c] of this.appIdContractMap) {
      if (c === contract) {
        if (this.applicationDataMap.has(appId)) {
          return Application(asUint64(appId))
        }
      }
    }
    throw internal.errors.internalError('Unknown contract, check correct testing context is active')
  }

  /**
   * Update asset holdings for account, only specified values will be updated.
   * Account will also be opted-in to asset
   * @param accountAddress
   * @param assetId
   * @param balance
   * @param frozen
   */
  updateAssetHolding(
    accountAddress: internal.primitives.StubBytesCompat | Account,
    assetId: internal.primitives.StubUint64Compat | Asset,
    balance?: internal.primitives.StubUint64Compat,
    frozen?: boolean,
  ): void {
    const addr = (asMaybeBytesCls(accountAddress) ?? asBytesCls((accountAddress as Account).bytes)).toString()
    const id = (asMaybeUint64Cls(assetId) ?? asUint64Cls((assetId as Asset).id)).asBigInt()
    const accountData = this.accountDataMap.get(addr)!
    const asset = this.assetDataMap.get(id)!
    const holding = accountData.optedAssets.get(id) ?? new AssetHolding(0n, asset.defaultFrozen)
    if (balance !== undefined) holding.balance = asUint64(balance)
    if (frozen !== undefined) holding.frozen = frozen
    accountData.optedAssets.set(id, holding)
  }
}
