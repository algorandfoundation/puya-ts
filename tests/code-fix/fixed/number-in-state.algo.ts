import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, GlobalState } from '@algorandfoundation/algorand-typescript'

class TestContract extends Contract {
  testState = GlobalState<uint64>({ initialValue: 1 })

  testState2 = GlobalState<uint64>({ initialValue: 3 })

  test(x: uint64) {
    return x
  }
}

