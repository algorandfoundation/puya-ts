import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, MutableArray } from '@algorandfoundation/algorand-typescript'
import type { DynamicArray, StaticArray, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'

const stopNumber: uint64 = 42

export class ForOfLoopsAlgo extends Contract {
  test_for_of_loop_tuple(items: readonly [uint64, uint64, uint64]) {
    let total: uint64 = 0
    for (const item of items) {
      total += item
      if (item === stopNumber) break
    }
    return total
  }

  test_for_of_loop_arc4_dynamic_array(items: DynamicArray<UintN64>) {
    let total: uint64 = 0
    for (const item of items) {
      total += item.native
      if (item.native === stopNumber) break
    }
    return total
  }

  test_for_of_loop_arc4_static_array(items: StaticArray<UintN64, 5>) {
    let total: uint64 = 0
    for (const item of items) {
      total += item.native
      if (item.native === stopNumber) break
    }
    return total
  }

  test_for_of_loop_native_immutable_array(items: Array<uint64>) {
    let total: uint64 = 0
    for (const item of items) {
      total += item
      if (item === stopNumber) break
    }
    return total
  }

  test_for_of_loop_native_mutable_array(items: [uint64, uint64, uint64]) {
    const mutable = new MutableArray(...items)
    let total: uint64 = 0
    for (const item of mutable) {
      total += item
      if (item === stopNumber) break
    }
    return total
  }
}
