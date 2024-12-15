import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, Contract, GlobalState, Uint64 } from '@algorandfoundation/algorand-typescript'

export default class AbiDecorators extends Contract {
  // @expect-warning Duplicate on completion actions
  @abimethod({ allowActions: ['NoOp', 'NoOp'] })
  public justNoop(): void {}
  // @expect-error Private or protected methods cannot be exposed as an abi method
  @abimethod({ onCreate: 'require' })
  private createMethod(): void {}
  @abimethod({ allowActions: ['NoOp'] })
  // @expect-error Only one decorator is allowed per method. Multiple on complete actions can be provided in a single decorator
  @abimethod({ allowActions: ['OptIn'] })
  public duplicateDecorators(): void {}

  globalValue = GlobalState({ initialValue: Uint64(123) })

  // @expect-error Default argument specification for 'a' does not match parameter type
  @abimethod({ defaultArguments: { a: { from: 'globalValue' } } })
  public methodWithDefaults(a: bytes): void {}
}

export class OverloadedMethods extends Contract {
  // @expect-error User defined functions must hav exactly 1 call signature
  public overloaded(x: uint64): uint64
  public overloaded(x: uint64, y: uint64): uint64
  public overloaded(x: uint64, y?: uint64): uint64 {
    return Uint64(4)
  }
}
