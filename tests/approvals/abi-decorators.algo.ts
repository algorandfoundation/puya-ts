import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, Contract, GlobalState, readonly, Uint64 } from '@algorandfoundation/algorand-typescript'

export default class AbiDecorators extends Contract {
  @abimethod({ allowActions: 'NoOp' })
  public justNoop(): void {}
  @abimethod({ onCreate: 'require' })
  public createMethod(): void {}
  @abimethod({ allowActions: ['NoOp', 'OptIn', 'CloseOut', 'DeleteApplication', 'UpdateApplication'] })
  public allActions(): void {}
  @abimethod({ readonly: true, name: 'overrideReadonlyName' })
  public readonly(): uint64 {
    return 5
  }

  globalValue = GlobalState({ initialValue: Uint64(123) })

  @abimethod({ defaultArguments: { a: { from: 'globalValue' }, b: { from: 'readonly' }, c: { constant: 145 } } })
  public methodWithDefaults(a: uint64, b: uint64, c: uint64): uint64 {
    return a * b + c
  }

  @readonly
  public readonlyAlt(): uint64 {
    return 1
  }

  @readonly
  @abimethod({ onCreate: 'allow' })
  public readonlyAlt2(): uint64 {
    return 2
  }
}

export class OverloadedMethods extends Contract {
  @abimethod({ name: 'doThing' })
  doThingOne(x: uint64): uint64 {
    return x
  }

  @abimethod({ name: 'doThing' })
  doThingTwo(x: uint64, y: uint64): uint64 {
    return x * y
  }
}

export class BaseAbi extends Contract {
  @abimethod({ allowActions: 'OptIn' })
  someMethod() {
    return 'base-abi:optin'
  }
}

export class SubAbi extends BaseAbi {
  @abimethod({ allowActions: 'OptIn' })
  someMethod() {
    return 'sub-abi:optin'
  }
}

export class SubAbi2 extends BaseAbi {
  // Implicitly overrides base with NoOp
  someMethod(): string {
    return 'sub-abi-2:noop'
  }
}
