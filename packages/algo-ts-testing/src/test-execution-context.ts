import { Account, Application, Asset, BaseContract, Bytes, bytes, gtxn, internal, Uint64, uint64 } from '@algorandfoundation/algo-ts'
import algosdk from 'algosdk'
import { DecodedLogs, decodeLogs, LogDecoding } from './decode-logs'
import { AccountCls, ApplicationCls, AssetCls } from './reference'
import { getGenericTypeInfo } from './runtime-helpers'
import { StateStore } from './state-store'
import { DeliberateAny } from './typescript-helpers'
import { asBigInt, extractGenericTypeArgs, iterBigInt } from './util'

interface IConstructor<T> {
  new (...args: DeliberateAny[]): T
}

type StateTotals = Pick<Application, 'globalNumBytes' | 'globalNumUint' | 'localNumBytes' | 'localNumUint'>

interface States {
  globalStates: Map<bytes, internal.state.GlobalStateCls<unknown>>
  localStates: Map<bytes, internal.state.LocalStateMapCls<unknown>>
  totals: StateTotals
}

const isUint64GenericType = (typeName: string) => {
  const genericTypes: string[] = extractGenericTypeArgs(typeName)
  return genericTypes.some((t) => t.toLocaleLowerCase() === 'uint64')
}

const extractStates = (contract: BaseContract): States => {
  const stateTotals = { globalNumBytes: 0, globalNumUint: 0, localNumBytes: 0, localNumUint: 0 }
  const states = {
    globalStates: new Map<bytes, internal.state.GlobalStateCls<unknown>>(),
    localStates: new Map<bytes, internal.state.LocalStateMapCls<unknown>>(),
    totals: stateTotals,
  }
  Object.entries(contract).forEach(([key, value]) => {
    const isLocalState = value instanceof Function && value.name === 'localStateInternal'
    const isGlobalState = value instanceof internal.state.GlobalStateCls
    if (isLocalState || isGlobalState) {
      // set key using property name if not already set
      if (value.key === undefined) value.key = Bytes(key)

      // capture state into the context
      if (isLocalState) states.localStates.set(value.key, value.map)
      else states.globalStates.set(value.key, value)

      // populate state totals
      const isUint64State = isUint64GenericType(getGenericTypeInfo(value)!)
      stateTotals.globalNumUint += isGlobalState && isUint64State ? 1 : 0
      stateTotals.globalNumBytes += isGlobalState && !isUint64State ? 1 : 0
      stateTotals.localNumUint += isLocalState && isUint64State ? 1 : 0
      stateTotals.localNumBytes += isLocalState && !isUint64State ? 1 : 0
    }
  })
  return states
}

const getContractProxyHandler = <T extends BaseContract>(context: TestExecutionContext): ProxyHandler<IConstructor<T>> => ({
  construct(target, args) {
    const instance = new Proxy(new target(...args), {
      get(target, prop, receiver) {
        const orig = Reflect.get(target, prop, receiver)
        if (prop === 'approvalProgram' || prop === 'clearStateProgram') {
          return () => {
            try {
              context.activeContract = target as unknown as T
              return (orig as () => boolean | uint64).apply(target)
            } finally {
              context.activeContract = undefined
            }
          }
        }
        return orig
      },
    })
    const states = extractStates(instance)
    const application = context.anyApplication({
      ...states.totals,
    })
    context.addAppIdContractMap(application.id, instance)
    states.globalStates.forEach((value, key) => {
      context.pushGlobalState(application.id, key, value)
    })
    states.localStates.forEach((value, key) => {
      context.pushLocalState(application.id, key, value)
    })
    return instance
  },
})

export class TestExecutionContext implements internal.ExecutionContext {
  #stateStore: StateStore
  #appIdIter = iterBigInt(1001n, 2n ** 64n - 1n)
  #active_contract: BaseContract | undefined

  constructor() {
    internal.ctxMgr.instance = this
    this.#stateStore = new StateStore()
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

  pushLocalState(appId: bigint | uint64, key: bytes, value: internal.state.LocalStateMapCls<unknown>) {
    const appIdBigInt = asBigInt(appId)
    if (!this.#stateStore.appIdLocalStateMap.has(appIdBigInt)) {
      this.#stateStore.appIdLocalStateMap.set(appIdBigInt, new Map())
    }
    this.#stateStore.appIdLocalStateMap.get(appIdBigInt)!.set(key, value)
  }

  pushGlobalState(appId: bigint | uint64, key: bytes, value: internal.state.GlobalStateCls<unknown>) {
    const appIdBigInt = asBigInt(appId)
    if (!this.#stateStore.appGlobalStateMap.has(appIdBigInt)) {
      this.#stateStore.appGlobalStateMap.set(appIdBigInt, new Map())
    }
    this.#stateStore.appGlobalStateMap.get(appIdBigInt)!.set(key, value)
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

  create<T extends BaseContract>(type: IConstructor<T>, ...args: DeliberateAny[]): T {
    const proxy = new Proxy(type, getContractProxyHandler<T>(this))
    return new proxy(...args)
  }

  reset() {
    this.#stateStore = new StateStore()
    internal.ctxMgr.reset()
  }
}
