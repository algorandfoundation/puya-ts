import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, GlobalState } from '@algorandfoundation/algorand-typescript'

class TestContract extends Contract {
  testState = GlobalState({ initialValue: 1 })

  testState2 = GlobalState<number>({ initialValue: 3 })

  test(x: uint64) {
    return x
  }
}
