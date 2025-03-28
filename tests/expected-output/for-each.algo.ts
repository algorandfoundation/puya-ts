import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract } from '@algorandfoundation/algorand-typescript'

class ForEachAlgo extends Contract {
  test(someArray: uint64[]) {
    let sum: uint64 = 0
    someArray.forEach((x) => (sum += x))
    return sum
  }
  test2(someArray: uint64[]) {
    let sum: uint64 = 0
    someArray.forEach((x) => {
      sum += x
    })
    return sum
  }
}
