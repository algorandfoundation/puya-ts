import { Account, Application, BaseContract, bytes, gtxn, internal, Uint64 } from '@algorandfoundation/algo-ts'
import { DecodedLogs, decodeLogs, LogDecoding } from './decode-logs'
import { StateStore } from './state-store'
import { TestExecutionContext } from './test-execution-context'
import { DeliberateAny } from './typescript-helpers'
import { asBigInt, iterBigInt } from './util'

interface IConstructor<T> {
  new(...args: DeliberateAny[]): T
}

const getContractProxyHandler = <T extends BaseContract>(harness: TestHarness): ProxyHandler<IConstructor<T>> => ({
  construct(target, args) {
    const instance = new target(...args)
    const application = harness.anyApplication()
    harness.addAppIdContractMap(asBigInt(application.id), instance)
    return instance
  },
})

export class TestHarness {
  #testExecutionContext: TestExecutionContext
  #stateStore: StateStore
  #appIdIter = iterBigInt(1001n, 2n ** 64n - 1n)

  constructor() {
    this.#testExecutionContext = new TestExecutionContext()
    internal.ctxMgr.instance = this.#testExecutionContext

    this.#stateStore = new StateStore()
    this.#testExecutionContext.stateStore = this.#stateStore
  }

  setTransactionGroup(group: gtxn.Transaction[], activeTransactionIndex?: number) {
    this.#stateStore.txnGroup = group
    this.#stateStore.activeTransactionIndex = activeTransactionIndex ?? (group.length === 1 ? 0 : undefined)
  }

  get defaultCreator(): Account {
    return this.#stateStore.defaultCreator
  }

  addAppIdContractMap(appId: bigint, contract: BaseContract): void {
    this.#stateStore!.appIdContractMap.set(appId, contract)
  }

  getApplicationForContract(contract: BaseContract): Application {
    for (const [appId, c] of this.#stateStore!.appIdContractMap) {
      if (c === contract) return this.#stateStore!.applications.get(appId)!
    }
    throw internal.errors.internalError('Contract not found in test harness')
  }

  anyApplicationCallTransaction({ appId, args, ...rest }: Partial<gtxn.ApplicationTxn> & { args: bytes[] }): gtxn.ApplicationTxn {
    return {
      sender: this.defaultCreator,
      type: gtxn.TransactionType.ApplicationCall,
      numAppArgs: Uint64(args.length),
      appId: this.anyApplication(),
      appArgs(index) {
        return args[index]
      },
      ...rest,
    } as gtxn.ApplicationTxn
  }

  anyApplication(app?: Partial<Application>): Application {
    const { id, ...rest } = app ?? {}
    const appId = id ?? this.#appIdIter.next().value
    const application = {
      id: appId,
      ...rest,
    } as Application
    this.#stateStore!.applications.set(asBigInt(application.id), application)
    return application
  }

  exportLogs<const T extends [...LogDecoding[]]>(...decoding: T): DecodedLogs<T> {
    const activeTransaction = this.#stateStore!.activeTransaction
    if (activeTransaction.type !== gtxn.TransactionType.ApplicationCall)
      throw internal.errors.internalError('Cannot export logs outside of an application call context')

    const applicationLogs = this.#stateStore!.getApplicationLogs(activeTransaction.appId)
    const rawLogs = applicationLogs.map((l) => internal.primitives.toExternalValue(l))
    return decodeLogs(rawLogs, decoding)
  }

  reset() {
    this.#stateStore = new StateStore()
    internal.ctxMgr.reset()
  }

  create<T extends BaseContract>(type: IConstructor<T>, ...args: DeliberateAny[]): T {
    const proxy = new Proxy(type, getContractProxyHandler<T>(this))
    return new proxy(...args)
  }
}
