import { Account, Application, Asset, BaseContract, Bytes, bytes, gtxn, internal, uint64 } from '@algorandfoundation/algo-ts'
import algosdk from 'algosdk'
import { DecodedLogs, decodeLogs, LogDecoding } from './decode-logs'
import { AccountCls, ApplicationCls, AssetCls } from './reference'
import { ContractContext } from './subcontexts/contract-context'
import { LedgerContext } from './subcontexts/ledger-context'
import { TransactionContext } from './subcontexts/transaction-context'
import { asBigInt } from './util'
import { ValueGenerator } from './value-generators'

export class TestExecutionContext implements internal.ExecutionContext {
  #applicationLogs: Map<bigint, bytes[]>
  #active_contract: BaseContract | undefined
  #contractContext: ContractContext
  #ledgerContext: LedgerContext
  #txnContext: TransactionContext
  #valueGenerator: ValueGenerator
  #defaultSender: Account

  constructor() {
    internal.ctxMgr.instance = this
    this.#applicationLogs = new Map()
    this.#contractContext = new ContractContext(this)
    this.#ledgerContext = new LedgerContext()
    this.#txnContext = new TransactionContext(this)
    this.#valueGenerator = new ValueGenerator(this)
    this.#defaultSender = Account(Bytes(algosdk.generateAccount().addr))
  }

  account(address: bytes): Account {
    return new AccountCls(address)
  }

  application(id: uint64): Application {
    return new ApplicationCls(id)
  }
  asset(id: uint64): Asset {
    return new AssetCls(id)
  }

  log(value: bytes): void {
    const activeTransaction = this.txn.lastActiveTransaction
    if (activeTransaction.type !== gtxn.TransactionType.ApplicationCall) {
      throw internal.errors.internalError('Cannot log outside of an application call context')
    }
    const applicationId = asBigInt(activeTransaction.appId.id)
    if (!this.#applicationLogs.has(applicationId)) {
      this.#applicationLogs.set(applicationId, [])
    }
    this.#applicationLogs.get(applicationId)!.push(value)
  }

  exportLogs<const T extends [...LogDecoding[]]>(...decoding: T): DecodedLogs<T> {
    const activeTransaction = this.txn.lastActiveTransaction
    if (activeTransaction.type !== gtxn.TransactionType.ApplicationCall)
      throw internal.errors.internalError('Cannot export logs outside of an application call context')

    const applicationLogs = this.#applicationLogs.get(asBigInt(activeTransaction.appId.id)) ?? []
    const rawLogs = applicationLogs.map((l) => internal.primitives.toExternalValue(l))
    return decodeLogs(rawLogs, decoding)
  }

  get contract() {
    return this.#contractContext
  }

  get ledger() {
    return this.#ledgerContext
  }

  get txn() {
    return this.#txnContext
  }

  get any() {
    return this.#valueGenerator
  }

  get currentTransaction() {
    return this.txn.lastActiveTransaction
  }

  get defaultSender(): Account {
    return this.#defaultSender
  }

  get activeContract(): BaseContract | undefined {
    return this.#active_contract
  }

  set activeContract(contract: BaseContract | undefined) {
    this.#active_contract = contract
  }

  get currentTransactionGroup() {
    return this.txn.lastTxnGroup.transactions
  }

  reset() {
    this.#active_contract = undefined
    this.#applicationLogs.clear()
    this.#contractContext = new ContractContext(this)
    this.#ledgerContext = new LedgerContext()
    this.#txnContext = new TransactionContext(this)
    internal.ctxMgr.reset()
  }
}
