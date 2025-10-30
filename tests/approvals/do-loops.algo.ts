import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, Uint64 } from '@algorandfoundation/algorand-typescript'

export class DoLoopsAlgo extends Contract {
  testDo(stop: uint64) {
    let i = Uint64(0)
    do {
      i += 1
    } while (i < stop)
    return i
  }
  testDoBreak(stop: uint64, breakMod: uint64) {
    let total = Uint64(0)
    let i = Uint64(0)
    do {
      if (i > 0 && i % breakMod === 0) break

      i += 1
      total += i
    } while (i < stop)
    return total
  }
  testDoContinue(stop: uint64, mod: uint64) {
    let i = Uint64(0)
    let total = Uint64(0)
    do {
      if (i > 0 && i % mod === 0) {
        total += 2
        i += 1
        continue
      }
      total += 1
      i += 1
    } while (i < stop)
    return total
  }
}
