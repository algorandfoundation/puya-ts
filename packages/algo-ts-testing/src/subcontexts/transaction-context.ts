import { gtxn, internal } from '@algorandfoundation/algo-ts'

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
  #groups: TransactionGroup[] = []
  #activeGroup: TransactionGroup | undefined

  createExecutionScope(group: gtxn.Transaction[], activeTransactionIndex?: number): ExecutionScope {
    const transactionGroup = new TransactionGroup(group, activeTransactionIndex)
    const previousGroup = this.#activeGroup
    this.#activeGroup = transactionGroup

    const scope = ScopeGenerator(() => {
      if (this.#activeGroup?.transactions?.length) {
        this.#groups.push(this.#activeGroup)
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

  ensureExecutionScope(group: gtxn.Transaction[], activeTransactionIndex?: number): ExecutionScope {
    if (!this.#activeGroup || !this.#activeGroup.transactions.length) {
      return this.createExecutionScope(group, activeTransactionIndex)
    }
    return {
      execute: <TReturn>(body: () => TReturn) => {
        return body()
      },
    }
  }

  get activeGroup(): TransactionGroup {
    return this.#activeGroup ?? new TransactionGroup([])
  }

  get activeTransaction(): gtxn.Transaction {
    return this.#activeGroup ? this.#activeGroup.activeTransaction : ({} as gtxn.Transaction)
  }

  get lastGroup(): TransactionGroup {
    if (this.#groups.length === 0) {
      throw new internal.errors.InternalError('No group transactions found!')
    }
    return this.#groups.at(-1)!
  }

  get lastActive(): gtxn.Transaction {
    return this.lastGroup.activeTransaction
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

  get activeApplicationId() {
    if (this.transactions.length === 0) {
      throw new internal.errors.InternalError('No transactions in the group')
    }
    if ('appId' in this.activeTransaction) {
      return this.activeTransaction.appId.id
    }
    throw new internal.errors.InternalError('No app_id found in the active transaction')
  }
}
