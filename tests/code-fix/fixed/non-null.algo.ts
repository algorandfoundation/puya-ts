import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract } from '@algorandfoundation/algorand-typescript'

class TestContract extends Contract {
  test(x: uint64[]) {
    const notNeeded = x[0]

    x.pop()
  }
}

