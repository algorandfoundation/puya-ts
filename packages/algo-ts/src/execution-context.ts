import { OpsNamespace } from './op-types'
import { biguint, BigUintCompat, bytes, BytesCompat, StringCompat, uint64, Uint64Compat } from './primitives'
import { Account, Application, Asset } from './reference'

export type ExecutionContext = {
  log(value: bytes): void
  application(id: uint64): Application
  asset(id: uint64 | undefined): Asset
  account(address: bytes | undefined): Account
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
