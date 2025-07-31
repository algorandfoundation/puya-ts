import type { bytes, gtxn, itxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, baremethod, Contract, err, GlobalState, Uint64 } from '@algorandfoundation/algorand-typescript'

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

  // @expect-error PaymentTxn cannot be used as an ABI return type
  badReturnsGtxn(): gtxn.PaymentTxn {
    err('No implementation')
  }

  // @expect-error PaymentInnerTxn cannot be used as an ABI return type
  badReturnsItxn(): itxn.PaymentInnerTxn {
    err('No implementation')
  }

  // @expect-error Bare methods cannot have any parameters
  @baremethod()
  badBareParams(x: uint64): void {}
  // @expect-error Bare method return type must be void
  @baremethod()
  badBareReturn(): uint64 {
    return 1
  }
}

export class OverloadedMethods extends Contract {
  // @expect-error User defined functions must have exactly 1 call signature
  public overloaded(x: uint64): uint64
  public overloaded(x: uint64, y: uint64): uint64
  public overloaded(x: uint64, y?: uint64): uint64 {
    return Uint64(4)
  }
}
