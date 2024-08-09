import { gtxn, internal } from '@algorandfoundation/algo-ts'
import { TestExecutionContext } from '../test-execution-context'

export class TransactionContext {
  #context: TestExecutionContext
  #groups: TransactionGroup[] = []

  constructor(context: TestExecutionContext) {
    this.#context = context
  }

  addTxnGroup(group: gtxn.Transaction[], activeTransactionIndex?: number) {
    this.#groups.push(new TransactionGroup(group, activeTransactionIndex))
  }

  get lastTxnGroup(): TransactionGroup {
    if (this.#groups.length === 0) {
      throw new internal.errors.InternalError('No group transactions found!')
    }
    return this.#groups.at(-1)!
  }

  get lastActiveTransaction(): gtxn.Transaction {
    return this.lastTxnGroup.activeTransaction
  }
}

class TransactionGroup {
  activeTransactionIndex: number

  constructor(
    public transactions: gtxn.Transaction[],
    activeTransactionIndex?: number,
  ) {
    this.activeTransactionIndex = activeTransactionIndex === undefined ? transactions.length - 1 : activeTransactionIndex
  }

  get activeTransaction() {
    return this.transactions[this.activeTransactionIndex]
  }
}
