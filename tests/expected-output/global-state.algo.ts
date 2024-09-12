import { Contract, GlobalState } from '@algorandfoundation/algo-ts'

export class TestContract extends Contract {
  // @expect-error unknown is not a valid type for storage
  noInitial = GlobalState()
}
