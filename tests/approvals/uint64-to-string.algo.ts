import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, Contract } from '@algorandfoundation/algorand-typescript'

class Uint64ToStringAlgo extends Contract {
  test(x: uint64): string {
    const y: uint64 = 123

    assert(y.toString() === '123')

    assert(`${y}` === '123')

    return x.toString()
  }
}
