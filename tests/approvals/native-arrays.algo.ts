import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, assertMatch, Contract, Uint64 } from '@algorandfoundation/algorand-typescript'
import { DynamicArray, StaticArray, UintN32 } from '@algorandfoundation/algorand-typescript/arc4'

type Vector = { x: uint64; y: uint64 }
export class NativeArraysAlgo extends Contract {
  buildArray(): uint64[] {
    return [1, 2, 3, 4]
  }

  doThings() {
    let arr = this.buildArray()

    assertMatch(arr, [1, 2, 3, 4])

    // append
    arr = [...arr, Uint64(5)]

    assertMatch(arr, [1, 2, 3, 4, 5])

    // pop
    const top = arr[arr.length - 1]
    assert(top === 5)
    // TODO: Uncomment this once puya supports array slicing
    //arr = arr.slice(0, -1)
    arr = [1, 2, 3, 4]

    assertMatch(arr, [1, 2, 3, 4])

    // replace
    arr = arr.with(1, 10)

    assertMatch(arr, [1, 10, 3, 4])

    // concat
    const t1: [uint64, uint64] = [12, 13]
    arr = arr.concat(arr, 11, t1)

    assertMatch(arr, [1, 10, 3, 4, 1, 10, 3, 4, 11, 12, 13])
  }

  arc4Interop() {
    const u1 = new UintN32(123)

    const da1 = new DynamicArray(u1, u1)
    const sa1 = new StaticArray(u1, u1)
    let a1 = [u1, u1]

    a1 = [...a1, ...da1, ...sa1]

    assertMatch(a1, [u1, u1, u1, u1, u1, u1])
  }

  structs({ x, y }: Vector) {
    let myVectors: Vector[] = []

    myVectors = [{ x, y }]

    assertMatch(myVectors, [{ x, y }])
    return myVectors
  }
}
