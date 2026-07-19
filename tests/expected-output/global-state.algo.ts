import { Bytes, Contract, GlobalMap, GlobalState, type uint64 } from '@algorandfoundation/algorand-typescript'

export class TestContract extends Contract {
  // @expect-error Type unknown cannot be used for storage
  noInitial = GlobalState()

  unknownState = GlobalState<unknown>()
  unknownMap = GlobalMap<string, unknown>()

  // @expect-error Global state must have explicit key provided if not being assigned to a contract property
  incorrect = GlobalState<string>().hasValue

  // @expect-error Unsupported property type boolean. Only GlobalState, GlobalMap, LocalState, LocalMap, and Box proxies can be stored on a contract.
  incorrect2 = GlobalState<string>({ key: 'abc' }).hasValue

  test() {
    // @expect-error Not Supported: The type unknown is not supported
    this.unknownState.value = 123

    // @expect-error Not Supported: The type unknown is not supported
    this.unknownMap('key1').value = 123

    // @expect-error Global state must have explicit key provided if not being assigned to a contract property
    const proxyNoKey = GlobalState<uint64>({})

    // @expect-error Global map must have explicit key prefix provided if not being assigned to a contract property
    const mapNoKey = GlobalMap<uint64, uint64>({})

    // @expect-error Global state can only have an initial value specified if being assigned to a contract property
    const proxyInvalidInitialValue = GlobalState<uint64>({ key: Bytes('abc'), initialValue: 1 })
  }
}
