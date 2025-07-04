import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, Contract, ensureBudget, ReferenceArray } from '@algorandfoundation/algorand-typescript'

class ReferenceArraysAlgo extends Contract {
  test(length: uint64) {
    ensureBudget(2000)
    const ma = new ReferenceArray<uint64>()
    for (let i: uint64 = 0; i < length; i++) {
      ma.push(i)
    }

    assert(ma.length === length)
    assert(length, 'has length')
    const popped = ma.pop()

    assert(popped === length - 1)
    assert(ma.at(-1) === length - 2)
    assert(ma.at(1) === 1)
  }
}
