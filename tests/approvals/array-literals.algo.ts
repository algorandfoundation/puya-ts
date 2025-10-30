import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract } from '@algorandfoundation/algorand-typescript'
import { Uint32 } from '@algorandfoundation/algorand-typescript/arc4'

export type SomeObj = {
  things: Uint32[]
}

class ArrayLiteralsAlgo extends Contract {
  test(a: uint64, b: uint64) {
    const inferTuple = [a, b] as const
    const explicitTuple: [uint64, uint64] = [a, b]

    const conditionalExplicitTuple: [uint64, uint64] = a < b ? [a, b] : [b, a]

    const [c, d] = [a, b]
    // const [...f] = [a, b] as const
    const [, g] = [a, b] as const
    const [h] = [a, b] as const
  }

  test2(): uint64 {
    const x: SomeObj = {
      things: [],
    }

    x.things.push(new Uint32(123))
    return x.things.length
  }
}
