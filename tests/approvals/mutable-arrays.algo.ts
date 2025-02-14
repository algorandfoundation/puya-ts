import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, Contract, ensureBudget, MutableArray } from '@algorandfoundation/algorand-typescript'

class MutableArraysAlgo extends Contract {
  test(length: uint64) {
    ensureBudget(2000)
    const ma = new MutableArray<uint64>()
    for (let i: uint64 = 0; i < length; i++) {
      ma.push(i)
    }

    assert(ma.length === length)
    assert(length, 'has length')
    const popped = ma.pop()
    assert(length, 'has length')

    assert(popped === length - 1)
  }
}
