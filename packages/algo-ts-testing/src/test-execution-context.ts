import { Account, Application, Asset, Bytes, bytes, gtxn, internal, uint64 } from '@algorandfoundation/algo-ts'
import algosdk from 'algosdk'
import { captureMethodConfig } from './abi-metadata'
import { DecodedLogs, decodeLogs, LogDecoding } from './decode-logs'
import * as ops from './impl'
import { AccountCls } from './impl/account'
import { ApplicationCls } from './impl/application'
import { AssetCls } from './impl/asset'
import { ContractContext } from './subcontexts/contract-context'
import { LedgerContext } from './subcontexts/ledger-context'
import { TransactionContext } from './subcontexts/transaction-context'
import { asBigInt } from './util'
import { ValueGenerator } from './value-generators'

export class TestExecutionContext implements internal.ExecutionContext {
  #applicationLogs: Map<bigint, bytes[]>
  #contractContext: ContractContext
  #ledgerContext: LedgerContext
  #txnContext: TransactionContext
  #valueGenerator: ValueGenerator
  #defaultSender: Account

  constructor() {
    internal.ctxMgr.instance = this
    this.#applicationLogs = new Map()
    this.#contractContext = new ContractContext()
    this.#ledgerContext = new LedgerContext()
    this.#txnContext = new TransactionContext()
    this.#valueGenerator = new ValueGenerator()
    this.#defaultSender = Account(Bytes(algosdk.generateAccount().addr))
  }

  account(address?: bytes): Account {
    return new AccountCls(address)
  }

  application(id?: uint64): Application {
    return new ApplicationCls(id)
  }

  asset(id?: uint64): Asset {
    return new AssetCls(id)
  }

  log(value: bytes): void {
    const activeTransaction = this.txn.activeTransaction
    if (activeTransaction.type !== gtxn.TransactionType.ApplicationCall) {
      throw internal.errors.internalError('Cannot log outside of an application call context')
    }
    const applicationId = asBigInt(activeTransaction.appId.id)
    if (!this.#applicationLogs.has(applicationId)) {
      this.#applicationLogs.set(applicationId, [])
    }
    this.#applicationLogs.get(applicationId)!.push(value)
  }

  exportLogs<const T extends [...LogDecoding[]]>(appId: uint64, ...decoding: T): DecodedLogs<T> {
    const applicationLogs = this.#applicationLogs.get(asBigInt(appId)) ?? []
    const rawLogs = applicationLogs.map((l) => internal.primitives.toExternalValue(l))
    return decodeLogs(rawLogs, decoding)
  }

  get op() {
    return ops
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

  get defaultSender(): Account {
    return this.#defaultSender
  }

  get abiMetadata() {
    return {
      captureMethodConfig,
    }
  }

  reset() {
    this.#applicationLogs.clear()
    this.#contractContext = new ContractContext()
    this.#ledgerContext = new LedgerContext()
    this.#txnContext = new TransactionContext()
    internal.ctxMgr.reset()
    internal.ctxMgr.instance = this
  }
}
