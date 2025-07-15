import { Contract, GlobalState } from '@algorandfoundation/algorand-typescript'

class TestContract extends Contract {
  testState = GlobalState({ initialValue: 1 })
}
