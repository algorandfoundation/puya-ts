import type { uint64 } from '@algorandfoundation/algo-ts'
import { GlobalState } from '@algorandfoundation/algo-ts'
import { Contract } from '@algorandfoundation/algo-ts'
import { BaseContract } from '@algorandfoundation/algo-ts'

export abstract class SimpleContract extends BaseContract {
  someState = GlobalState<uint64>()
  public simpleMethod(a: uint64, b: uint64): uint64 {
    return a * b
  }
}

export abstract class Arc4Contract extends Contract {
  someState = GlobalState<uint64>()
  private simpleMethod(a: uint64, b: uint64): uint64 {
    return a * b
  }

  public simpleAbiMethod(a: uint64, b: uint64): uint64 {
    return a + b
  }
}
