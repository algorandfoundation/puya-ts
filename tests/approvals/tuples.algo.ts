import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract } from '@algorandfoundation/algorand-typescript'
import type { Uint64 } from '@algorandfoundation/algorand-typescript/arc4'
import { Tuple } from '@algorandfoundation/algorand-typescript/arc4'

class TuplesAlgo extends Contract {
  test(a: Uint64, b: Uint64, c: Uint64) {
    const readonlyTuple = [a, b, c] as const

    const mutableTuple: [Uint64, Uint64, Uint64] = [a, b, c]

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

  private receiveReadonly(arg: readonly [Uint64, Uint64, Uint64]): uint64 {
    return arg.length
  }

  private receiveMutable(arg: [Uint64, Uint64, Uint64]): uint64 {
    //arg[0] = new Uint64(4)
    return arg.length
  }
}
