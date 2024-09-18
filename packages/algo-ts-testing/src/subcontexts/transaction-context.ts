import { gtxn, internal } from '@algorandfoundation/algo-ts'
import algosdk from 'algosdk'
import { asUint64 } from '../util'

function ScopeGenerator(dispose: () => void) {
  function* internal() {
    try {
      yield
    } finally {
      dispose()
    }
  }
  const scope = internal()
  scope.next()
  return {
    done: () => {
      scope.return()
    },
  }
}

interface ExecutionScope {
  execute: <TReturn>(body: () => TReturn) => TReturn
}

export class TransactionContext {
  readonly groups: TransactionGroup[] = []
  #activeGroup: TransactionGroup | undefined

  createScope(group: gtxn.Transaction[], activeTransactionIndex?: number): ExecutionScope {
    const transactionGroup = new TransactionGroup(group, activeTransactionIndex)
    const previousGroup = this.#activeGroup
    this.#activeGroup = transactionGroup

    const scope = ScopeGenerator(() => {
      if (this.#activeGroup?.transactions?.length) {
        this.groups.push(this.#activeGroup)
      }
      this.#activeGroup = previousGroup
    })
    return {
      execute: <TReturn>(body: () => TReturn) => {
        const result = body()
        scope.done()
        return result
      },
    }
  }

  ensureScope(group: gtxn.Transaction[], activeTransactionIndex?: number): ExecutionScope {
    if (!this.#activeGroup || !this.#activeGroup.transactions.length) {
      return this.createScope(group, activeTransactionIndex)
    }
    return {
      execute: <TReturn>(body: () => TReturn) => {
        return body()
      },
    }
  }

  get activeGroup(): TransactionGroup | undefined {
    return this.#activeGroup
  }

  get activeTransaction(): gtxn.Transaction {
    return this.#activeGroup ? this.#activeGroup.activeTransaction : ({} as gtxn.Transaction)
  }

  get lastGroup(): TransactionGroup {
    if (this.groups.length === 0) {
      internal.errors.internalError('No group transactions found!')
    }
    return this.groups.at(-1)!
  }

  get lastActive(): gtxn.Transaction {
    return this.lastGroup.activeTransaction
  }
}

export class TransactionGroup {
  activeTransactionIndex: number
  latestTimestamp: number
  transactions: gtxn.Transaction[]

  constructor(transactions: gtxn.Transaction[], activeTransactionIndex?: number) {
    this.latestTimestamp = Date.now()
    if (transactions.length > algosdk.AtomicTransactionComposer.MAX_GROUP_SIZE) {
      internal.errors.internalError(
        `Transaction group can have at most ${algosdk.AtomicTransactionComposer.MAX_GROUP_SIZE} transactions, as per AVM limits.`,
      )
    }
    transactions.forEach((txn, index) => {
      txn.groupIndex = asUint64(index)
    })
    this.activeTransactionIndex = activeTransactionIndex === undefined ? transactions.length - 1 : activeTransactionIndex
    this.transactions = transactions
  }

  get activeTransaction() {
    return this.transactions[this.activeTransactionIndex]
  }

  get activeApplicationId() {
    if (this.transactions.length === 0) {
      internal.errors.internalError('No transactions in the group')
    }

    const appId = (this.activeTransaction as gtxn.ApplicationTxn)?.appId
    if (appId) {
      return appId.id
    }
    internal.errors.internalError('No app_id found in the active transaction')
  }
}
