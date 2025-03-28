import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, BaseContract, Bytes, contract, Contract, GlobalState, op, Txn, Uint64 } from '@algorandfoundation/algorand-typescript'

export abstract class BaseTestContract extends BaseContract {
  baseTestState = GlobalState({ initialValue: 'testing 123' })
}

export class TestContract extends BaseTestContract {
  noInitial = GlobalState<bytes>()
  noInitialInt = GlobalState<uint64>()
  testState = GlobalState({ initialValue: Uint64(2) })
  testState2 = GlobalState({ initialValue: Uint64(5), key: Bytes('TESTSTATE') })

  constructor() {
    const someValue: uint64 = 2 ** 56
    super()
    assert(this.baseTestState.value === 'testing 123', 'Base class state should be initialized after super call')
    this.noInitialInt.value = someValue * this.testState.value
  }

  public approvalProgram(): boolean {
    assert(this.testState.hasValue, 'State should have value')
    assert(this.testState.value === 2, 'Value should equal 2')

    this.testState.value = op.btoi(Txn.applicationArgs(0))

    this.noInitial.value = Bytes('abc')

    return true
  }
}

@contract({ stateTotals: { globalUints: 5 } })
export class TestArc4 extends Contract {
  setState(key: string, value: uint64) {
    const proxy = GlobalState<uint64>({ key })

    proxy.value = value
  }

  deleteState(key: string) {
    GlobalState<uint64>({ key }).delete()
  }
}
