import { bytes, uint64 } from './primitives'
import { Account, Application, Asset } from './reference'
import { Transaction } from './transactions'

export type ExecutionContext = {
  log(value: bytes): void
  application(id: uint64): Application
  asset(id: uint64 | undefined): Asset
  account(address: bytes | undefined): Account
  currentTransaction: Transaction
  currentTransactionGroup: Transaction[]
}

declare global {
  // eslint-disable-next-line no-var
  var puyaTsExecutionContext: ExecutionContext | undefined
}

export const ctxMgr = {
  set instance(ctx: ExecutionContext) {
    const instance = global.puyaTsExecutionContext
    if (instance != undefined) throw new Error('Execution context has already been set')
    global.puyaTsExecutionContext = ctx
  },
  get instance() {
    const instance = global.puyaTsExecutionContext
    if (instance == undefined) throw new Error('No execution context has been set')
    return instance
  },
  reset() {
    global.puyaTsExecutionContext = undefined
  },
}
