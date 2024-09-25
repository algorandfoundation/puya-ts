import { internal, TransactionType, uint64 } from '@algorandfoundation/algo-ts'
import algosdk from 'algosdk'
import { lazyContext } from '../context-helpers/internal-context'
import { DecodedLogs, decodeLogs, LogDecoding } from '../decode-logs'
import { testInvariant } from '../errors'
import { AllTransactionFields, Transaction } from '../impl/transactions'
import { asBigInt, asUint64 } from '../util'

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

  createScope(group: Transaction[], activeTransactionIndex?: number): ExecutionScope {
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

  ensureScope(group: Transaction[], activeTransactionIndex?: number): ExecutionScope {
    if (!this.#activeGroup || !this.#activeGroup.transactions.length) {
      return this.createScope(group, activeTransactionIndex)
    }
    return {
      execute: <TReturn>(body: () => TReturn) => {
        return body()
      },
    }
  }

  get activeGroup(): TransactionGroup {
    if (this.#activeGroup) {
      return this.#activeGroup
    }
    throw internal.errors.internalError('no active txn group')
  }

  get lastGroup(): TransactionGroup {
    if (this.groups.length === 0) {
      internal.errors.internalError('No group transactions found!')
    }
    return this.groups.at(-1)!
  }

  get lastActive(): Transaction {
    return this.lastGroup.activeTransaction
  }

  /* internal */
  appendLog(value: internal.primitives.StubBytesCompat): void {
    const activeTransaction = this.activeGroup.activeTransaction
    if (activeTransaction.type !== TransactionType.ApplicationCall) {
      throw internal.errors.internalError('Can only add logs to ApplicationCallTransaction!')
    }
    activeTransaction.appendLog(value)
  }

  exportLogs<const T extends [...LogDecoding[]]>(appId: uint64, ...decoding: T): DecodedLogs<T> {
    const transaction = this.groups
      .flatMap((g) => g.transactions)
      .filter((t) => t.type === TransactionType.ApplicationCall)
      .find((t) => asBigInt(t.appId.id) === asBigInt(appId))
    let logs = []
    if (transaction) {
      logs = transaction.appLogs
    } else {
      logs = lazyContext.getApplicationData(appId).appLogs
    }
    const rawLogs = logs.map((l) => internal.primitives.toExternalValue(l))
    return decodeLogs(rawLogs, decoding)
  }
}

export class TransactionGroup {
  activeTransactionIndex: number
  latestTimestamp: number
  transactions: Transaction[]

  constructor(transactions: Transaction[], activeTransactionIndex?: number) {
    this.latestTimestamp = Date.now()
    if (transactions.length > algosdk.AtomicTransactionComposer.MAX_GROUP_SIZE) {
      internal.errors.internalError(
        `Transaction group can have at most ${algosdk.AtomicTransactionComposer.MAX_GROUP_SIZE} transactions, as per AVM limits.`,
      )
    }
    transactions.forEach((txn, index) => Object.assign(txn, { groupIndex: asUint64(index) }))
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
    testInvariant(this.activeTransaction.type === TransactionType.ApplicationCall, 'No app_id found in the active transaction')
    return this.activeTransaction.appId.id
  }

  patchActiveTransactionFields(fields: AllTransactionFields) {
    const activeTransaction = this.activeTransaction as unknown as AllTransactionFields
    const filteredFields = Object.fromEntries(Object.entries(fields).filter(([_, value]) => value !== undefined))
    Object.assign(activeTransaction, filteredFields)
  }
}
