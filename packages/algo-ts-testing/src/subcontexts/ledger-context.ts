import { Account, Application, Asset, BaseContract, internal, uint64 } from '@algorandfoundation/algo-ts'
import { DEFAULT_ACCOUNT_MIN_BALANCE, MAX_UINT64 } from '../constants'
import { Mutable } from '../typescript-helpers'
import { asBigInt, asUint64, iterBigInt } from '../util'

export class AssetHolding {
  balance: uint64
  frozen: boolean
  constructor(balance: internal.primitives.StubUint64Compat, frozen: boolean) {
    this.balance = asUint64(balance)
    this.frozen = frozen
  }
}
export class AccountData {
  optedAssets = new Map<bigint, AssetHolding>()
  optedApplications = new Map<bigint, Application>()
  account: Mutable<Omit<Account, 'bytes' | 'isOptedIn'>>

  constructor() {
    this.account = {
      totalAppsCreated: 0,
      totalAppsOptedIn: 0,
      totalAssets: 0,
      totalAssetsCreated: 0,
      totalBoxBytes: 0,
      totalBoxes: 0,
      totalExtraAppPages: 0,
      totalNumByteSlice: 0,
      totalNumUint: 0,
      minBalance: DEFAULT_ACCOUNT_MIN_BALANCE,
      balance: 0,
      authAddress: Account(),
    }
  }
}

export type AssetData = Mutable<Omit<Asset, 'id' | 'balance' | 'frozen'>>

export type ApplicationData = Mutable<Omit<Application, 'id'>>

export class LedgerContext {
  appIdIter = iterBigInt(1001n, MAX_UINT64)
  assetIdIter = iterBigInt(1001n, MAX_UINT64)
  applicationDataMap = new Map<bigint, ApplicationData>()
  appIdContractMap = new Map<bigint, BaseContract>()
  accountDataMap = new Map<string, AccountData>()
  assetDataMap = new Map<bigint, AssetData>()

  addAppIdContractMap(appId: bigint | uint64, contract: BaseContract): void {
    this.appIdContractMap.set(asBigInt(appId), contract)
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
    accountAddress: internal.primitives.StubBytesCompat,
    assetId: internal.primitives.StubUint64Compat,
    balance?: internal.primitives.StubUint64Compat,
    frozen?: boolean,
  ): void {
    const addr = internal.primitives.BytesCls.fromCompat(accountAddress).toString()
    const id = internal.primitives.Uint64Cls.fromCompat(assetId).asBigInt()
    const accountData = this.accountDataMap.get(addr)!
    const holding = accountData.optedAssets.get(id) ?? new AssetHolding(0n, false)
    if (balance !== undefined) holding.balance = asUint64(balance)
    if (frozen !== undefined) holding.frozen = frozen
    accountData.optedAssets.set(id, holding)
  }
}
