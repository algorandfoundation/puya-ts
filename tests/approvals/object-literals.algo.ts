import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, Uint64 } from '@algorandfoundation/algorand-typescript'

class ObjectLiteralsAlgo extends Contract {
  test() {
    let i: uint64 = 0

    const o1: {
      readonly k: uint64
      readonly j: uint64
      readonly i: uint64
    } = {
      i,
      j: (i += 2),
      k: i,
    }

    const o2 = {
      a: o1,
      b: {
        x: Uint64(1),
      },
    }

    const o3: { b: { x: uint64 } } = {
      b: {
        x: 1,
      },
    }
  }
}
