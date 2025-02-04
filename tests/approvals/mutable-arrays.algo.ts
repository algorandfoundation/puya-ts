import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, Contract, MutableArray } from '@algorandfoundation/algorand-typescript'

class MutableArraysAlgo extends Contract {
  test(length: uint64) {
    const ma = new MutableArray<uint64>()
    for (let i: uint64 = 0; i < length; i++) {
      ma.push(i)
    }

    assert(ma.length === length)
    assert(ma.pop() === length - 1)
  }
}
