import type { bytes } from '@algorandfoundation/algo-ts'
import { abimethod, Contract, GlobalState, Uint64 } from '@algorandfoundation/algo-ts'

export default class AbiDecorators extends Contract {
  // @expect-warn Duplicate on completion actions
  @abimethod({ allowActions: ['NoOp', 'NoOp'] })
  public justNoop(): void {}
  // @expect-error Private method cannot be exposed as an abi method
  @abimethod({ onCreate: 'require' })
  private createMethod(): void {}
  // @expect-error Only one decorator is allowed per method. Multiple on complete actions can be provided in a single decorator
  @abimethod({ allowActions: ['NoOp'] })
  @abimethod({ allowActions: ['OptIn'] })
  public duplicateDecorators(): void {}

  globalValue = GlobalState({ initialValue: Uint64(123) })

  // @expect-error Default argument specification for 'a' does not match parameter type
  @abimethod({ defaultArguments: { a: { from: 'globalValue' } } })
  public methodWithDefaults(a: bytes): void {}
}
