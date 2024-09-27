import { Contract, GlobalState } from '@algorandfoundation/algorand-typescript'

export class TestContract extends Contract {
  // @expect-error unknown is not a valid type for storage
  noInitial = GlobalState()
}
