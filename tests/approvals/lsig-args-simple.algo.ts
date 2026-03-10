import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, Bytes, LogicSig, op, Uint64 } from '@algorandfoundation/algorand-typescript'
import { DynamicBytes, Uint64 as ARC4Uint64 } from '@algorandfoundation/algorand-typescript/arc4'

export class ArgsSimple extends LogicSig {
  program(arg0: uint64, arg1: bytes, arg2: boolean): uint64 {
    // verify args match raw op.arg values
    assert(arg0 === ARC4Uint64.fromBytes(op.arg(0)).native)
    assert(arg1 === DynamicBytes.fromBytes(op.arg(1)).native)
    assert(arg2 === (op.btoi(op.arg(2)) !== 0))

    // mutate all
    let mutableArg0 = arg0
    let mutableArg1 = arg1
    let mutableArg2 = arg2
    if (mutableArg0 < 10) {
      mutableArg0 = Uint64(10)
    }
    mutableArg1 = mutableArg1.concat(Bytes('suffix'))
    mutableArg2 = !mutableArg2

    // assert all
    assert(mutableArg0 >= 10)
    assert(mutableArg1.length > 0)

    // some random cross-arg operations
    if (mutableArg2) {
      mutableArg0 += mutableArg1.length
    }
    return mutableArg0
  }
}
