import type { biguint, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, BigUint, Contract } from '@algorandfoundation/algorand-typescript'
import { getBit } from '@algorandfoundation/algorand-typescript/op'

const x = 123

const z: uint64 = 4

const unsafeNumber = 2 ** 63

const unsafeUint64 = 2 ** 128

const a = 2n ** 256n

class ConstLiteralsAlgo extends Contract {
  test(): uint64 {
    return x
  }

  test2() {
    const test = z
    return test
  }

  test3(): uint64 {
    const x = 4
    const y = 3

    return x * y
  }

  test4(): uint64 {
    assert(getBit(unsafeNumber, 63))
    return unsafeNumber
  }

  test5() {
    return BigUint(unsafeUint64)
  }

  test6(): biguint {
    return a
  }
}
