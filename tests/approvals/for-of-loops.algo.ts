import type { FixedArray, uint64 } from '@algorandfoundation/algorand-typescript'
import { clone, Contract, ReferenceArray } from '@algorandfoundation/algorand-typescript'
import type { DynamicArray, StaticArray, Uint64 } from '@algorandfoundation/algorand-typescript/arc4'

const stopNumber: uint64 = 42
type Point = { x: uint64; y: uint64 }

export class ForOfLoopsAlgo extends Contract {
  test_for_of_loop_tuple(items: readonly [uint64, uint64, uint64]) {
    let total: uint64 = 0
    for (const item of items) {
      total += item
      if (item === stopNumber) break
    }
    return total
  }

  test_for_of_loop_destructured_tuple(items: DynamicArray<Uint64>) {
    let total: uint64 = 0
    for (const [index, v] of items.entries()) {
      total += v.asUint64()
      if (total >= stopNumber) break
    }
    return total
  }

  test_for_of_loop_destructured_object(items: Point[]) {
    let total: uint64 = 0
    for (const { x, y } of clone(items)) {
      total += x + y
      if (total >= stopNumber) break
    }
    return total
  }

  test_for_of_loop_arc4_dynamic_array(items: DynamicArray<Uint64>) {
    let total: uint64 = 0
    for (const item of items) {
      total += item.asUint64()
      if (item.asUint64() === stopNumber) break
    }
    return total
  }

  test_for_of_loop_arc4_static_array(items: StaticArray<Uint64, 5>) {
    let total: uint64 = 0
    for (const item of items) {
      total += item.asUint64()
      if (item.asUint64() === stopNumber) break
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
    const mutable = new ReferenceArray(...items)
    let total: uint64 = 0
    for (const item of mutable) {
      total += item
      if (item === stopNumber) break
    }
    return total
  }

  test_iterable_props(static_array: StaticArray<Uint64, 3>, fixed_array: FixedArray<uint64, 3>, dyn_array: DynamicArray<Uint64>) {
    let i: uint64 = 0
    for (const a of static_array.keys()) {
      i++
    }
    for (const a of static_array.entries()) {
      i++
    }
    for (const a of fixed_array.keys()) {
      i++
    }
    for (const a of fixed_array.entries()) {
      i++
    }
    for (const a of dyn_array.keys()) {
      i++
    }
    for (const a of dyn_array.entries()) {
      i++
    }
    return i
  }
}
