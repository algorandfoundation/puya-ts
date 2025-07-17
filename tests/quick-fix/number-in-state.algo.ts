import { Contract, GlobalState } from '@algorandfoundation/algorand-typescript'

class TestContract extends Contract {
  testState = GlobalState({ initialValue: 1 })

  testState2 = GlobalState<number>({ initialValue: 3 })
}
