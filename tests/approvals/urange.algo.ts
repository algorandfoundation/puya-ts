import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, urange } from '@algorandfoundation/algorand-typescript'

class UrangeAlgo extends Contract {
  testSingleArg() {
    let results: uint64[] = []
    for (const i of urange(5)) {
      results = [...results, i]
    }
    return results
  }
  testTwoArg() {
    let results: uint64[] = []
    for (const i of urange(2, 5)) {
      results = [...results, i]
    }
    return results
  }
  testThreeArg() {
    let results: uint64[] = []
    for (const i of urange(2, 10, 3)) {
      results = [...results, i]
    }
    return results
  }
}
