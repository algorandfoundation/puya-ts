import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, Contract, GlobalState, Uint64 } from '@algorandfoundation/algorand-typescript'

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
