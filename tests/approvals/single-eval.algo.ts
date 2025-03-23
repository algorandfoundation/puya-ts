import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, Contract, GlobalState } from '@algorandfoundation/algorand-typescript'

class SingleEvalAlgo extends Contract {
  myState = GlobalState<uint64>()

  private a() {
    this.myState.value += 1
    return 'a'
  }

  private b() {
    return 'b'
  }

  test() {
    this.myState.value = 0
    const result = this.a() || this.b()
    assert(this.myState.value === 1, 'a() should only be called once')
    assert(result === 'a', 'Result should be "a"')
  }
}
