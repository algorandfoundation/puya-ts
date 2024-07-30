import { internal } from '@algorandfoundation/algo-ts'
import { DecodedLogs, decodeLogs, LogDecoding, StateStore, TestExecutionContext, TransactionBase } from './internal'
;(function setupGlobalContext() {
  internal.ctxMgr.instance = new TestExecutionContext()
})()
export class TestHarness {
  #testExecutionContext: TestExecutionContext
  #stateStore: StateStore

  constructor() {
    this.#stateStore = new StateStore()
    this.#testExecutionContext = internal.ctxMgr.instance as TestExecutionContext
    this.#testExecutionContext.stateStore = this.#stateStore
  }

  set gtxn(value: TransactionBase[]) {
    this.#stateStore.txnGroup = value
  }

  exportLogs<const T extends [...LogDecoding[]]>(...decoding: T): DecodedLogs<T> {
    return decodeLogs(this.#testExecutionContext.rawLogs, decoding)
  }

  reset() {
    this.#stateStore.reset()
  }
}
