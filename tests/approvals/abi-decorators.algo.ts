import { abimethod, Contract, GlobalState, uint64, Uint64 } from '@algorandfoundation/algo-ts'

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

  @abimethod({ defaultArguments: { a: { fromMember: 'globalValue' }, b: { fromMember: 'readonly' }, c: { fromConstant: 145 } } })
  public methodWithDefaults(a: uint64, b: uint64, c: uint64): uint64 {
    return a * b + c
  }
}
