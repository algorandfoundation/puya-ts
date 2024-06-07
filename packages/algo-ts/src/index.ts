import { uint64 } from './primitives'

export * from './primitives'
export { log, err, assert } from './util'
export * from './reference'
export * as op from './op'
export { Txn, Global } from './op'
export * as internal from './internal'
export * as arc4 from './arc4'

export abstract class Contract {
  public abstract approvalProgram(): boolean | uint64
  public clearState(): boolean | uint64 {
    return true
  }
}
