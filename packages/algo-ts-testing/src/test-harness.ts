import { internal } from '@algorandfoundation/algo-ts'
import { DecodedLogs, decodeLogs, LogDecoding } from './decode-logs'
import { TestExecutionContext } from './test-execution-context'
import { encodeTransactions } from './transactions'
import { Transaction } from './transactions/client'

export class TestHarness {
  #testExecutionContext: TestExecutionContext

  constructor() {
    this.#testExecutionContext = new TestExecutionContext([])
    internal.ctxMgr.instance = this.#testExecutionContext
  }

  set gtxn(value: Transaction[]) {
    this.#testExecutionContext.txnGroup = encodeTransactions(value)
  }

  exportLogs<const T extends [...LogDecoding[]]>(...decoding: T): DecodedLogs<T> {
    return decodeLogs(this.#testExecutionContext.rawLogs, decoding)
  }

  reset() {
    internal.ctxMgr.reset()
  }
}
