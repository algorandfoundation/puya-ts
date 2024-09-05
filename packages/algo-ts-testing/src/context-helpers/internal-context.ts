import { internal } from '@algorandfoundation/algo-ts'
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
}

export const lazyContext = new InternalContext()
