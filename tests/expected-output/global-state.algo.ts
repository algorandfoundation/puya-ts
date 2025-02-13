import { Bytes, Contract, GlobalState, type uint64 } from '@algorandfoundation/algorand-typescript'

export class TestContract extends Contract {
  // @expect-error unknown is not a valid type for storage
  noInitial = GlobalState()

  // @expect-error Global state must have explicit key provided if not being assigned to a contract property
  incorrect = GlobalState<string>().hasValue

  // @expect-error Unsupported property type boolean. Only GlobalState, LocalState, and Box proxies can be stored on a contract.
  incorrect2 = GlobalState<string>({ key: 'abc' }).hasValue

  test() {
    // @expect-error Global state must have explicit key provided if not being assigned to a contract property
    const proxyNoKey = GlobalState<uint64>({})

    // @expect-error Global state can only have an initial value specified if being assigned to a contract property
    const proxyInvalidInitialValue = GlobalState<uint64>({ key: Bytes('abc'), initialValue: 1 })
  }
}
