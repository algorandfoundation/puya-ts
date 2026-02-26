/**
 * Example 09: Array Playground
 *
 * This example demonstrates native arrays, FixedArray, ReferenceArray, and iteration patterns.
 *
 * Features:
 * - Native uint64[] — mutable array literal with .push(), .pop(), .at(), .length
 * - FixedArray<T, N> — fixed-length array with index access and .entries()
 * - ReferenceArray<T> — mutable, resizable in-memory reference array
 * - clone() — deep copy to prevent aliasing
 * - urange() — uint64 range iterator (1, 2, and 3 argument forms)
 * - for...of iteration and .entries() index+value iteration
 *
 * Prerequisites: LocalNet
 */
import type { uint64 } from '@algorandfoundation/algorand-typescript'
// Contract: ABI-routed base; assert: runtime check; clone: deep copy; FixedArray: fixed-length array;
// ReferenceArray: mutable reference array; Uint64: factory; urange: uint64 range iterator
import { assert, clone, Contract, FixedArray, ReferenceArray, Uint64, urange } from '@algorandfoundation/algorand-typescript'

// Free subroutine: sum all elements in a native array using for...of
function sumArray(arr: uint64[]): uint64 {
  let total: uint64 = 0
  // for...of iterates over each element of the array
  for (const val of arr) {
    total += val
  }
  return total
}

// Free subroutine: sum elements of a FixedArray using .entries() for index+value pairs
function sumFixedWithEntries(arr: FixedArray<uint64, 4>): uint64 {
  let total: uint64 = 0
  // .entries() yields [index, value] pairs as [uint64, TItem]
  for (const [_idx, val] of arr.entries()) {
    total += val
  }
  return total
}

// Exported contract showcasing native arrays, FixedArray, ReferenceArray, clone, urange, and iteration
export class ArrayPlayground extends Contract {
  // Demonstrate native uint64[] — literal creation, .push(), .length, indexing, for...of
  public exploreNativeArray(a: uint64, b: uint64, c: uint64): uint64 {
    // Native array literal — creates a mutable uint64[]
    const arr: uint64[] = [a, b, c]

    // .length returns the array length as uint64
    assert(arr.length === 3)

    // .push() appends an element; returns new length
    const newLen: uint64 = arr.push(Uint64(99))
    assert(newLen === 4)

    // Index access reads elements (0-based)
    assert(arr[0] === a)
    assert(arr[3] === 99)

    // Index assignment mutates the array in place
    arr[0] = Uint64(0)
    assert(arr[0] === 0)

    // .pop() removes and returns the last element
    const popped: uint64 = arr.pop()!
    assert(popped === 99)
    assert(arr.length === 3)

    // .at() supports negative indices — .at(-1) is the last element
    assert(arr.at(-1)! === c)

    // for...of iteration via free subroutine
    const total: uint64 = sumArray(arr)
    // total = 0 + b + c
    assert(total === b + c)

    return total
  }

  // Demonstrate FixedArray<T, N> — construction, indexing, .length, .entries()
  public exploreFixedArray(x: uint64, y: uint64): uint64 {
    // FixedArray: fixed-length array with compile-time size; initialized with values
    const fixed = new FixedArray<uint64, 4>(x, y, Uint64(10), Uint64(20))

    // .length is always the declared size
    assert(fixed.length === 4)

    // Index access and assignment
    assert(fixed[0] === x)
    fixed[2] = Uint64(100)
    assert(fixed[2] === 100)

    // .at() with negative index — last element (requires ! non-null assertion)
    assert(fixed.at(-1)! === 20)

    // .entries() iteration via free subroutine
    const total: uint64 = sumFixedWithEntries(fixed)
    return total
  }

  // Demonstrate ReferenceArray<T> — dynamic sizing with .push(), .pop(), .at(), .length, for...of
  public exploreReferenceArray(n: uint64): uint64 {
    // ReferenceArray: mutable, resizable in-memory array
    const ra = new ReferenceArray<uint64>()

    // .push() adds elements — build array dynamically
    for (let i: uint64 = 0; i < n; i++) {
      ra.push(i)
    }

    // .length tracks current size
    assert(ra.length === n)

    // .at() with positive and negative indices
    assert(ra.at(0) === 0)
    assert(ra.at(-1) === n - 1)

    // .pop() removes and returns the last element
    const last: uint64 = ra.pop()
    assert(last === n - 1)
    assert(ra.length === n - 1)

    // for...of iteration over ReferenceArray
    let total: uint64 = 0
    for (const val of ra) {
      total += val
    }

    return total
  }

  // Demonstrate clone() — deep copy prevents aliasing
  public exploreClone(a: uint64, b: uint64): uint64 {
    // Original mutable array
    const original: uint64[] = [a, b]

    // clone() creates an independent deep copy
    const copied: uint64[] = clone(original)

    // Mutating the copy does not affect the original
    copied[0] = Uint64(999)
    assert(original[0] === a, 'original unchanged after clone mutation')
    assert(copied[0] === 999)

    return original[0]
  }

  // Demonstrate urange() — uint64 range iteration with 1, 2, and 3 args
  public exploreUrange(): uint64 {
    let count: uint64 = 0

    // urange(stop): iterates 0, 1, 2, 3, 4
    for (const _i of urange(5)) {
      count += 1
    }
    assert(count === 5)

    // urange(start, stop): iterates 2, 3, 4
    let sum: uint64 = 0
    for (const i of urange(2, 5)) {
      sum += i
    }
    assert(sum === 9) // 2 + 3 + 4

    // urange(start, stop, step): iterates 0, 3, 6, 9
    let stepped: uint64 = 0
    for (const i of urange(0, 10, 3)) {
      stepped += i
    }
    assert(stepped === 18) // 0 + 3 + 6 + 9

    return stepped
  }

  // Demonstrate .entries() on FixedArray — yields [index, value] pairs
  public exploreEntries(a: uint64, b: uint64, c: uint64): uint64 {
    // .entries() is supported on FixedArray (not native Array)
    const arr = new FixedArray<uint64, 3>(a, b, c)

    // .entries() provides index + value as [uint64, TItem]
    let indexSum: uint64 = 0
    let valueSum: uint64 = 0
    for (const [idx, val] of arr.entries()) {
      indexSum += idx // 0 + 1 + 2 = 3
      valueSum += val // a + b + c
    }
    assert(indexSum === 3)

    return valueSum
  }
}
