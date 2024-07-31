import { Account, Application, Asset, bytes, gtxn, internal, uint64 } from '@algorandfoundation/algo-ts'
import { AccountCls, ApplicationCls, AssetCls } from './reference'
import { StateStore } from './state-store'

export class TestExecutionContext implements internal.ExecutionContext {
  #stateStore: StateStore | undefined

  set stateStore(store: StateStore) {
    this.#stateStore = store
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
    this.#stateStore!.logs.push(value)
  }

  get currentTransaction() {
    const result = this.#stateStore!.txnGroup.find((t) => t.type === gtxn.TransactionType.ApplicationCall)
    if (!result) {
      throw internal.errors.internalError('Transaction group must contain at least one ApplicationCall transaction (type="appl")')
    }
    return result
  }
}
