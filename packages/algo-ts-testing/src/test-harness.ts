import { Account, bytes, gtxn, internal } from '@algorandfoundation/algo-ts'
import { DecodedLogs, decodeLogs, LogDecoding } from './decode-logs'
import { StateStore } from './state-store'
import { TestExecutionContext } from './test-execution-context'
import { TransactionBase, TransactionType } from './transactions'
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
    this.#stateStore.txnGroup.push(...value)
  }

  get defaultCreator(): Account {
    return this.#stateStore.defaultCreator
  }

  anyApplicationCallTransaction(txn: Partial<gtxn.ApplicationTxn> & { args: bytes[] }): gtxn.ApplicationTxn {
    return {
      sender: this.defaultCreator,
      type: TransactionType.ApplicationCall,
      appArgs(index) {
        return txn.args[index]
      },
      numAppArgs: txn.args.length,
      ...txn,
    } as gtxn.ApplicationTxn
  }

  exportLogs<const T extends [...LogDecoding[]]>(...decoding: T): DecodedLogs<T> {
    return decodeLogs(this.#testExecutionContext.rawLogs, decoding)
  }

  reset() {
    this.#stateStore.reset()
  }
}
