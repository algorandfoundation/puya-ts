import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract } from '@algorandfoundation/algorand-typescript'

class Uint64ToStringAlgo extends Contract {
  test(x: uint64): string {
    // @expect-error the radix parameter is not supported
    return x.toString(10)
  }
}
