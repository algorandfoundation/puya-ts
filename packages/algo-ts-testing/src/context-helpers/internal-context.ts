import { internal } from '@algorandfoundation/algo-ts'
import { AccountData } from '../subcontexts/ledger-context'
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

  getAccountData(accountPublicKey: internal.primitives.StubBytesCompat): AccountData {
    const key = internal.primitives.BytesCls.fromCompat(accountPublicKey)
    const data = this.ledger.accountDataMap.get(key.toString())
    if (!data) {
      throw internal.errors.internalError('Unknown account, check correct testing context is active')
    }
    return data
  }
}

export const lazyContext = new InternalContext()
