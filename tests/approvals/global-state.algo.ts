import { Contract, GlobalState, Uint64 } from '@algorandfoundation/algo-ts'

export class TestContract extends Contract {
  testState = GlobalState({ initialValue: Uint64(2) })
}
