import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract } from '@algorandfoundation/algorand-typescript'
import type { UintN64 } from '@algorandfoundation/algorand-typescript/arc4'
import { Tuple } from '@algorandfoundation/algorand-typescript/arc4'

class TuplesAlgo extends Contract {
  test(a: UintN64, b: UintN64, c: UintN64) {
    const readonlyTuple = [a, b, c] as const

    const mutableTuple: [UintN64, UintN64, UintN64] = [a, b, c]

    const arc4Tuple = new Tuple(a, b, c)

    this.receiveReadonly(readonlyTuple)
    this.receiveReadonly(mutableTuple)
    this.receiveReadonly(arc4Tuple.native)

    this.receiveMutable(mutableTuple)

    const [x, y, z] = readonlyTuple

    const [d, e, f] = mutableTuple

    const [g] = readonlyTuple
    const [h] = mutableTuple
  }

  private receiveReadonly(arg: readonly [UintN64, UintN64, UintN64]): uint64 {
    return arg.length
  }

  private receiveMutable(arg: [UintN64, UintN64, UintN64]): uint64 {
    //arg[0] = new UintN64(4)
    return arg.length
  }
}
