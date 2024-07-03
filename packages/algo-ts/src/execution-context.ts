import { biguint, BigUintCompat, bytes, BytesCompat, StringCompat, uint64, Uint64Compat } from './primitives'
import { OpsNamespace } from './op-types'
import { Account, Application, Asset } from './reference'

export type ExecutionContext = {
  log(...args: Array<Uint64Compat | BytesCompat | BigUintCompat | StringCompat>): void
  ops: Partial<OpsNamespace>
  makeUint64(v: Uint64Compat): uint64
  makeInterpolatedBytes(b: TemplateStringsArray, replacements: BytesCompat[]): bytes
  makeBytes(b: BytesCompat | undefined): bytes
  makeBigUint(v: BigUintCompat): biguint
  application(id: uint64): Application
  asset(id: uint64 | undefined): Asset
  account(address: bytes | undefined): Account
  arrayAt<T>(arrayLike: T[], index: Uint64Compat): T
  arraySlice(arrayLike: Uint8Array, start: Uint64Compat, end: Uint64Compat): Uint8Array
  arraySlice<T>(arrayLike: T[], start: Uint64Compat, end: Uint64Compat): T[]

  assert(condition: unknown, message?: string): asserts condition
  err(message?: string): never
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
