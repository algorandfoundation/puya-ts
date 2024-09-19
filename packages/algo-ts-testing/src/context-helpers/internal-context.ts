import { internal } from '@algorandfoundation/algo-ts'
import { AccountData } from '../impl/account'
import { ApplicationData } from '../impl/application'
import { AssetData } from '../impl/asset'
import { TransactionGroup } from '../subcontexts/transaction-context'
import { TestExecutionContext } from '../test-execution-context'

/**
 * For accessing implementation specific functions, with a convenient single entry
 * point for other modules to import Also allows for a single place to check and
 * provide.
 */
class InternalContext {
  get value() {
    return internal.ctxMgr.instance as TestExecutionContext
  }

  get defaultSender() {
    return this.value.defaultSender
  }

  get ledger() {
    return this.value.ledger
  }

  get txn() {
    return this.value.txn
  }

  get contract() {
    return this.value.contract
  }

  get any() {
    return this.value.any
  }

  get activeApplication() {
    return this.ledger.getApplication(this.activeGroup.activeApplicationId)
  }

  get activeGroup(): TransactionGroup {
    return this.value.txn.activeGroup
  }

  getAccountData(accountPublicKey: internal.primitives.StubBytesCompat): AccountData {
    const key = internal.primitives.BytesCls.fromCompat(accountPublicKey)
    const data = this.ledger.accountDataMap.get(key.toString())
    if (!data) {
      throw internal.errors.internalError('Unknown account, check correct testing context is active')
    }
    return data
  }

  getAssetData(id: internal.primitives.StubUint64Compat): AssetData {
    const key = internal.primitives.Uint64Cls.fromCompat(id)
    const data = this.ledger.assetDataMap.get(key.asBigInt())
    if (!data) {
      throw internal.errors.internalError('Unknown asset, check correct testing context is active')
    }
    return data
  }

  getApplicationData(id: internal.primitives.StubUint64Compat): ApplicationData {
    const key = internal.primitives.Uint64Cls.fromCompat(id)
    const data = this.ledger.applicationDataMap.get(key.asBigInt())
    if (!data) {
      throw internal.errors.internalError('Unknown application, check correct testing context is active')
    }
    return data
  }
}

export const lazyContext = new InternalContext()
