import type { bytes } from '@algorandfoundation/algo-ts'
import { Contract, GlobalState, Txn, Uint64, assert, op, Bytes } from '@algorandfoundation/algo-ts'

export class TestContract extends Contract {
  noInitial = GlobalState<bytes>()
  testState = GlobalState({ initialValue: Uint64(2) })
  testState2 = GlobalState({ initialValue: Uint64(5), key: Bytes('TESTSTATE') })

  public approvalProgram(): boolean {
    assert(this.testState.hasValue, 'State should have value')
    assert(this.testState.value === 2, 'Value should equal 2')

    this.testState.value = op.btoi(Txn.applicationArgs(0))

    return true
  }
}
