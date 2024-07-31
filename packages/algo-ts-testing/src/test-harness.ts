import { Account, bytes, gtxn, internal, Uint64 } from '@algorandfoundation/algo-ts'
import { DecodedLogs, decodeLogs, LogDecoding } from './decode-logs'
import { StateStore } from './state-store'
import { TestExecutionContext } from './test-execution-context'

export class TestHarness {
  #testExecutionContext: TestExecutionContext
  #stateStore: StateStore

  constructor() {
    this.#testExecutionContext = new TestExecutionContext()
    internal.ctxMgr.instance = this.#testExecutionContext

    this.#stateStore = new StateStore()
    this.#testExecutionContext.stateStore = this.#stateStore
  }

  set gtxn(value: gtxn.AnyTransaction[]) {
    this.#stateStore.txnGroup = value
  }

  get defaultCreator(): Account {
    return this.#stateStore.defaultCreator
  }

  anyApplicationCallTransaction(txn: Partial<gtxn.ApplicationTxn> & { args: bytes[] }): gtxn.ApplicationTxn {
    return {
      sender: this.defaultCreator,
      type: gtxn.TransactionType.ApplicationCall,
      app_args(index) {
        return txn.args[index]
      },
      num_app_args: Uint64(txn.args.length),
      ...txn,
    } as gtxn.ApplicationTxn
  }

  exportLogs<const T extends [...LogDecoding[]]>(...decoding: T): DecodedLogs<T> {
    const rawLogs = this.#stateStore!.logs.map((l) => internal.primitives.toExternalValue(l))
    return decodeLogs(rawLogs, decoding)
  }

  reset() {
    this.#stateStore.reset()
    internal.ctxMgr.reset()
  }
}
