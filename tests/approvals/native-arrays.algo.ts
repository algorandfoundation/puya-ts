import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, assertMatch, Contract, Uint64 } from '@algorandfoundation/algorand-typescript'

export class NativeArraysAlgo extends Contract {
  buildArray(): uint64[] {
    return [1, 2, 3, 4]
  }

  doThings() {
    let arr = this.buildArray()

    assertMatch(arr, [1, 2, 3, 4])

    // append
    arr = [...arr, Uint64(5)]

    assertMatch(arr, [1, 2, 3, 4, 5])

    // pop
    const top = arr[arr.length - 1]
    assert(top === 5)
    arr = arr.slice(0, -1)

    assertMatch(arr, [1, 2, 3, 4])

    // replace
    arr = arr.with(1, 10)

    assertMatch(arr, [1, 10, 3, 4])
  }
}
