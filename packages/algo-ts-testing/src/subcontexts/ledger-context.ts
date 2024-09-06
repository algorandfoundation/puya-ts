import { Account, Application, Asset, BaseContract, internal, uint64 } from '@algorandfoundation/algo-ts'
import { DEFAULT_ACCOUNT_MIN_BALANCE } from '../constants'
import { Mutable } from '../typescript-helpers'
import { asBigInt, iterBigInt } from '../util'

export class AccountData {
  optedAssets = new Map<bigint, Asset>()
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

export class LedgerContext {
  appIdIter = iterBigInt(1001n, 2n ** 64n - 1n)
  applications = new Map<bigint, Application>()
  appIdContractMap = new Map<bigint, BaseContract>()
  accountDataMap = new Map<string, AccountData>()

  addAppIdContractMap(appId: bigint | uint64, contract: BaseContract): void {
    this.appIdContractMap.set(asBigInt(appId), contract)
  }

  getApplicationForContract(contract: BaseContract): Application {
    for (const [appId, c] of this.appIdContractMap) {
      if (c === contract) return this.applications.get(appId)!
    }
    throw internal.errors.internalError('Contract not found in test harness')
  }
}
