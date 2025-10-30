import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, Contract, op, Txn } from '@algorandfoundation/algorand-typescript'
import { methodSelector } from '@algorandfoundation/algorand-typescript/arc4'
import * as op2 from '@algorandfoundation/algorand-typescript/op'
import { bzero, GTxn } from '@algorandfoundation/algorand-typescript/op'

class MyContract extends Contract {
  test() {
    const a = bzero(8).bitwiseInvert()
    const b = op2.btoi(a)
    assert(b === 2 ** 64 - 1)

    const c = op.shr(b, 32)

    assert(c === 2 ** 32 - 1)

    assert(GTxn.applicationId(Txn.groupIndex) === Txn.applicationId)

    assert(Txn.applicationArgs(0) === methodSelector('test()void'))
    assert(GTxn.applicationArgs(Txn.groupIndex, 0) === methodSelector(MyContract.prototype.test))
  }

  test2(size: uint64) {
    const a = bzero(size)
    assert(a.length === size)
  }
}
