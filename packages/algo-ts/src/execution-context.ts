import { Contract } from '.'
import { AbiMethodConfig, BareMethodConfig } from './arc4'
import { GlobalType, GTxnType, TxnType } from './op-types'
import { bytes, uint64 } from './primitives'
import { Account, Application, Asset } from './reference'

export type ExecutionContext = {
  log(value: bytes): void
  application(id: uint64): Application
  asset(id: uint64 | undefined): Asset
  account(address: bytes | undefined): Account
  op: { Txn: TxnType; GTxn: GTxnType; Global: GlobalType }
  abiMetadata: {
    captureMethodConfig<T extends Contract>(contract: T, methodName: string, config?: AbiMethodConfig<T> | BareMethodConfig): void
  }
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
