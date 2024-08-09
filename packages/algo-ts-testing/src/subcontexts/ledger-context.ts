import { Application, BaseContract, internal, uint64 } from '@algorandfoundation/algo-ts'
import { asBigInt, iterBigInt } from '../util'

export class LedgerContext {
  appIdIter = iterBigInt(1001n, 2n ** 64n - 1n)
  applications = new Map<bigint, Application>()
  appIdContractMap = new Map<bigint, BaseContract>()

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
