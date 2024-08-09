import { Account, Application, Asset, BaseContract, Bytes, bytes, gtxn, internal, Uint64, uint64 } from '@algorandfoundation/algo-ts'
import algosdk from 'algosdk'
import { ContractContext } from './contract-context'
import { DecodedLogs, decodeLogs, LogDecoding } from './decode-logs'
import { AccountCls, ApplicationCls, AssetCls } from './reference'
import { StateStore } from './state-store'
import { asBigInt, iterBigInt } from './util'

export class TestExecutionContext implements internal.ExecutionContext {
  #stateStore: StateStore
  #appIdIter = iterBigInt(1001n, 2n ** 64n - 1n)
  #active_contract: BaseContract | undefined
  contract: ContractContext

  constructor() {
    internal.ctxMgr.instance = this
    this.#stateStore = new StateStore()
    this.contract = new ContractContext(this)
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
    const activeTransaction = this.#stateStore.activeTransaction
    if (activeTransaction.type !== gtxn.TransactionType.ApplicationCall) {
      throw internal.errors.internalError('Cannot log outside of an application call context')
    }
    this.#stateStore.addApplicationLog(activeTransaction.appId, value)
  }

  exportLogs<const T extends [...LogDecoding[]]>(...decoding: T): DecodedLogs<T> {
    const activeTransaction = this.#stateStore.activeTransaction
    if (activeTransaction.type !== gtxn.TransactionType.ApplicationCall)
      throw internal.errors.internalError('Cannot export logs outside of an application call context')

    const applicationLogs = this.#stateStore.getApplicationLogs(activeTransaction.appId)
    const rawLogs = applicationLogs.map((l) => internal.primitives.toExternalValue(l))
    return decodeLogs(rawLogs, decoding)
  }

  get currentTransaction() {
    const result = this.#stateStore.txnGroup.find((t) => t.type === gtxn.TransactionType.ApplicationCall)
    if (!result) {
      throw internal.errors.internalError('Transaction group must contain at least one ApplicationCall transaction (type="appl")')
    }
    return result
  }

  get defaultCreator(): Account {
    return this.#stateStore.defaultCreator
  }

  get activeContract(): BaseContract | undefined {
    return this.#active_contract
  }

  set activeContract(contract: BaseContract | undefined) {
    this.#active_contract = contract
  }

  get currentTransactionGroup() {
    return this.#stateStore.txnGroup
  }

  setTransactionGroup(group: gtxn.Transaction[], activeTransactionIndex?: number) {
    this.#stateStore.txnGroup = group
    this.#stateStore.activeTransactionIndex = activeTransactionIndex ?? (group.length === 1 ? 0 : undefined)
  }

  addAppIdContractMap(appId: bigint | uint64, contract: BaseContract): void {
    this.#stateStore.appIdContractMap.set(asBigInt(appId), contract)
  }

  getApplicationForContract(contract: BaseContract): Application {
    for (const [appId, c] of this.#stateStore.appIdContractMap) {
      if (c === contract) return this.#stateStore.applications.get(appId)!
    }
    throw internal.errors.internalError('Contract not found in test harness')
  }

  anyApplicationCallTransaction({ appId, args, sender, ...rest }: Partial<gtxn.ApplicationTxn> & { args: bytes[] }): gtxn.ApplicationTxn {
    return {
      sender: sender ?? this.defaultCreator,
      type: gtxn.TransactionType.ApplicationCall,
      numAppArgs: Uint64(args.length),
      appId: appId ?? this.anyApplication(),
      appArgs(index) {
        return args[index]
      },
      ...rest,
    } as gtxn.ApplicationTxn
  }

  anyPaymentTransaction({ sender, ...rest }: Partial<gtxn.PayTxn>): gtxn.PayTxn {
    return {
      sender: sender ?? this.defaultCreator,
      type: gtxn.TransactionType.Payment,
      ...rest,
    } as gtxn.PayTxn
  }
  anyApplication(app?: Partial<Application>): Application {
    const { id, ...rest } = app ?? {}
    const appId = id ?? this.#appIdIter.next().value
    const application = {
      id: appId,
      ...rest,
    } as Application
    this.#stateStore.applications.set(asBigInt(application.id), application)
    return application
  }

  anyAccount(account?: Partial<Account>): Account {
    const { bytes, ...rest } = account ?? {}
    return {
      bytes: bytes ?? Bytes(algosdk.generateAccount().addr),
      ...rest,
    } as Account
  }

  reset() {
    this.#active_contract = undefined
    this.#stateStore = new StateStore()
    this.contract = new ContractContext(this)
    internal.ctxMgr.reset()
  }
}
