import { biguint, BigUintCompat, bytes, BytesCompat, str, StringCompat, uint64, Uint64Compat } from './primitives'
import { OpsImplementation } from './op-types'
import { Application, Asset } from './reference'

export type ExecutionContext = {
  log(...args: Array<Uint64Compat | BytesCompat | BigUintCompat>): void
  ops: Partial<OpsImplementation>
  makeUint64(v: Uint64Compat): uint64
  makeInterpolatedBytes(b: TemplateStringsArray, replacements: BytesCompat[]): bytes
  makeBytes(b: BytesCompat): bytes
  makeString(s: StringCompat): str
  makeBigUint(v: BigUintCompat): biguint
  application(id: uint64): Application
  asset(id: uint64): Asset
  arrayAt<T>(arrayLike: T[], index: Uint64Compat): T
  arraySlice<T>(arrayLike: T[], start: Uint64Compat, end: Uint64Compat): T[]

  assert(condition: unknown, message?: string): asserts condition
  err(message?: string): never
}

export const ctxMgr = (() => {
  let instance: ExecutionContext | undefined = undefined
  return {
    set instance(ctx: ExecutionContext) {
      if (instance != undefined) throw new Error('Execution context has already been set')

      instance = ctx
    },
    get instance() {
      if (instance == undefined) throw new Error('No execution context has been set')
      return instance
    },
    reset() {
      instance = undefined
    },
  }
})()
