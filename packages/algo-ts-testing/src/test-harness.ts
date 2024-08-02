import { Account, Application, bytes, gtxn, internal, Uint64 } from '@algorandfoundation/algo-ts'
import { DecodedLogs, decodeLogs, LogDecoding } from './decode-logs'
import { StateStore } from './state-store'
import { TestExecutionContext } from './test-execution-context'
import { iterBigInt } from './util'

(function setupGlobalContext() {
  internal.ctxMgr.instance = new TestExecutionContext()
})()
export class TestHarness {
  #testExecutionContext: TestExecutionContext
  #stateStore: StateStore
  #appIdIter = iterBigInt(1001n, 2n ** 64n - 1n)

  constructor() {
    this.#testExecutionContext = new TestExecutionContext()
    internal.ctxMgr.instance = this.#testExecutionContext

    this.#stateStore = new StateStore()
    this.#testExecutionContext.stateStore = this.#stateStore
  }

  setTransactionGroup(group: gtxn.Transaction[], activeTransactionIndex?: number) {
    this.#stateStore.txnGroup = group
    this.#stateStore.activeTransactionIndex = activeTransactionIndex ?? (group.length === 1 ? 0 : undefined)
  }

  get defaultCreator(): Account {
    return this.#stateStore.defaultCreator
  }

  anyApplicationCallTransaction(txn: Partial<gtxn.ApplicationTxn> & { args: bytes[] }): gtxn.ApplicationTxn {
    return {
      sender: this.defaultCreator,
      type: gtxn.TransactionType.ApplicationCall,
      numAppArgs: Uint64(txn.args.length),
      appId: this.anyApplication(),
      appArgs(index) {
        return txn.args[index]
      },
      ...txn,
    } as gtxn.ApplicationTxn
  }

  anyApplication(app?: Partial<Application>): Application {
    const { id, ...rest } = app ?? {}
    const appId = id ?? this.#appIdIter.next().value
    return {
      id: appId,
      ...rest,
    } as Application
  }

  exportLogs<const T extends [...LogDecoding[]]>(...decoding: T): DecodedLogs<T> {
    const activeTransaction = this.#stateStore!.activeTransaction
    if (activeTransaction.type !== gtxn.TransactionType.ApplicationCall)
      throw internal.errors.internalError('Cannot export logs outside of an application call context')

    const applicationLogs = this.#stateStore!.getApplicationLogs(activeTransaction.appId)
    const rawLogs = applicationLogs.map((l) => internal.primitives.toExternalValue(l))
    return decodeLogs(rawLogs, decoding)
  }

  reset() {
    this.#stateStore = new StateStore()
    internal.ctxMgr.reset()
  }
}
