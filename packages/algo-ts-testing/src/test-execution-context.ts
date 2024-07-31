import { Account, Application, Asset, bytes, internal, uint64 } from '@algorandfoundation/algo-ts'
import { StateStore } from './state-store'
import { AccountCls, ApplicationCls, AssetCls } from './reference'

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
  get rawLogs() {
    return this.#stateStore!.logs.map((l) => internal.primitives.toExternalValue(l))
  }
}
