import { bytes, gtxn, internal, uint64 } from '@algorandfoundation/algo-ts'
import algosdk from 'algosdk'
import { MAX_ITEMS_IN_LOG } from '../constants'
import { DecodedLogs, decodeLogs, LogDecoding } from '../decode-logs'
import { asBigInt, asBytes, asUint64 } from '../util'

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
  #applicationLogs: Map<bigint, bytes[]> = new Map()

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

  get lastActive(): gtxn.Transaction {
    return this.lastGroup.activeTransaction
  }

  appendLog(value: internal.primitives.StubBytesCompat): void {
    const activeTransaction = this.activeGroup.activeTransaction
    if (activeTransaction.type !== gtxn.TransactionType.ApplicationCall) {
      throw internal.errors.internalError('Can only add logs to ApplicationCallTransaction!')
    }
    const applicationId = asBigInt(activeTransaction.appId.id)
    if (!this.#applicationLogs.has(applicationId)) {
      this.#applicationLogs.set(applicationId, [])
    }
    const logs = this.#applicationLogs.get(applicationId)!
    if (logs.length + 1 > MAX_ITEMS_IN_LOG) {
      throw internal.errors.internalError(`Too many log calls in program, up to ${MAX_ITEMS_IN_LOG} is allowed`)
    }
    logs.push(asBytes(value))
  }

  logs(appId: internal.primitives.StubUint64Compat): bytes[] {
    return this.#applicationLogs.get(asBigInt(appId)) ?? []
  }

  exportLogs<const T extends [...LogDecoding[]]>(appId: uint64, ...decoding: T): DecodedLogs<T> {
    const applicationLogs = this.#applicationLogs.get(asBigInt(appId)) ?? []
    const rawLogs = applicationLogs.map((l) => internal.primitives.toExternalValue(l))
    return decodeLogs(rawLogs, decoding)
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
