import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, Uint64 } from '@algorandfoundation/algorand-typescript'

class DemoContract extends Contract {
  public testWhile(stop: uint64) {
    let i = Uint64(0)
    while (i < stop) {
      i += 1
    }

    return i
  }
}
