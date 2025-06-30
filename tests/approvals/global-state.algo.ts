import type { biguint, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import {
  arc4,
  assert,
  BaseContract,
  Bytes,
  contract,
  Contract,
  GlobalState,
  op,
  Txn,
  Uint64,
} from '@algorandfoundation/algorand-typescript'

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

type Data = { a: string; b: uint64; c: boolean; d: arc4.Str }

export class TestTuple extends Contract {
  t1 = GlobalState<[string, uint64, boolean]>()
  t2 = GlobalState<[string, [string, biguint, boolean]]>()

  t3 = GlobalState<{ a: string; b: uint64; c: boolean }>()
  t4 = GlobalState<[string, { a: string; b: biguint; c: boolean }]>()

  t5 = GlobalState<Data>()

  testTuple() {
    this.t1.value = ['hello', 123, true]
    assert(this.t1.value[0] === 'hello', 'Tuple value should be set')
    assert(this.t1.value[1] === 123, 'Tuple value should be set')
    assert(this.t1.value[2] === true, 'Tuple value should be set')

    this.t2.value = ['a', ['b', 456n, true]]
    assert(this.t2.value[0] === 'a', 'Tuple value should be set')
    assert(this.t2.value[1][0] === 'b', 'Tuple value should be set')
    assert(this.t2.value[1][1] === 456n, 'Tuple value should be set')
    assert(this.t2.value[1][2] === true, 'Tuple value should be set')

    this.t3.value = { a: 'hello', b: 123, c: true }
    assert(this.t3.value.a === 'hello', 'Object value should be set')
    assert(this.t3.value.b === 123, 'Object value should be set')
    assert(this.t3.value.c === true, 'Object value should be set')

    this.t4.value = ['a', { a: 'b', b: 456n, c: true }]
    assert(this.t4.value[0] === 'a', 'Tuple value should be set')
    assert(this.t4.value[1].a === 'b', 'Tuple value should be set')
    assert(this.t4.value[1].b === 456n, 'Tuple value should be set')
    assert(this.t4.value[1].c === true, 'Tuple value should be set')

    this.t5.value = { a: 'hello', b: 123, c: true, d: new arc4.Str('World') }
    assert(this.t5.value.a === 'hello', 'Mutable object value should be set')
    assert(this.t5.value.b === 123, 'Mutable object value should be set')
    assert(this.t5.value.c === true, 'Mutable object value should be set')
    assert(this.t5.value.d.native === 'World', 'Mutable object value should be set')
  }
}
