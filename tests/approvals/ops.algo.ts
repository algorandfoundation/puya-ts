import { assert, Contract, op } from '@algorandfoundation/algorand-typescript'
import * as op2 from '@algorandfoundation/algorand-typescript/op'
import { bzero } from '@algorandfoundation/algorand-typescript/op'

class MyContract extends Contract {
  test() {
    const a = bzero(8).bitwiseInvert()
    const b = op2.btoi(a)
    assert(b === 2 ** 64 - 1)

    const c = op.shr(b, 32)

    assert(c === 2 ** 32 - 1)
  }
}
