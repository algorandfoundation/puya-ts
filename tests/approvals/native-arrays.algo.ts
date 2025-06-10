import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, assertMatch, clone, Contract, FixedArray, Uint64 } from '@algorandfoundation/algorand-typescript'
import { Bool, DynamicArray, StaticArray, UintN32 } from '@algorandfoundation/algorand-typescript/arc4'

type Vector = { x: uint64; y: uint64 }
export class NativeArraysAlgo extends Contract {
  buildArray(): Array<uint64> {
    return [1, 2, 3, 4]
  }

  arrayFromCtor(): Array<uint64> {
    return new Array<uint64>(1, 2, 3)
  }

  buildReadonly(): ReadonlyArray<uint64> {
    return [1, 2, 3, 4]
  }

  doThings() {
    let arr = this.buildArray()

    assertMatch(arr, [1, 2, 3, 4])

    // read
    assert(arr[0] === 1)
    assert(arr.at(-1)! === 4)

    // append
    arr.push(Uint64(5))

    assertMatch(arr, [1, 2, 3, 4, 5])

    // pop
    const top = arr.pop()!
    assert(top === 5)

    assertMatch(arr, [1, 2, 3, 4])

    // replace
    arr[1] = 10

    const arr2 = arr.with(1, 5)

    assertMatch(arr, [1, 10, 3, 4])
    assertMatch(arr2, [1, 5, 3, 4])

    // concat
    const t1: [uint64, uint64] = [12, 13]
    arr = arr.concat(arr).concat(11).concat(t1)

    assertMatch(arr, [1, 10, 3, 4, 1, 10, 3, 4, 11, 12, 13])
  }

  fixedArray(y: FixedArray<uint64, 1024>) {
    const x = new FixedArray<uint64, 4>(1, 2, 3, 4)
    x[0] = 0
    assert(x[0] === y[0])
    assertMatch(x, [{ lessThan: 1 }, 2, 3, 4])
    assertMatch(y, { 1024: { greaterThanEq: 0 } })
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

  booleans() {
    return [true, false, true]
  }

  booleansStatic() {
    return [true, false, true] as const
  }

  arc4Booleans() {
    return [new Bool(true), new Bool(false), new Bool(true)]
  }

  arc4BooleansStatic() {
    return [new Bool(true), new Bool(false), new Bool(true)] as const
  }

  aliasing(mutable: uint64[], readOnly: readonly uint64[]) {
    // Existing arc4 copy checking picks up this alias of a mutable type and asks for a copy
    const needClone = clone(mutable)
    needClone[0] = 5

    // No issue with aliasing an immutable type
    const noNeedClone = readOnly

    // This should require a clone, otherwise updates to mutable will be visible in `needClone2`
    const needClone2: readonly uint64[] = mutable

    mutable[1] += 2

    assert(mutable[1] !== needClone2[1], 'These should not match')

    // Magic parameter auto return handles this
    this.receiveMutable(mutable)
    // Mutable type needs to be reinterpreted/converted to immutable, but otherwise no copy required
    this.receiveReadonly(mutable)

    // Typescript captures this as being invalid
    // this.receiveMutable(readOnly)

    this.receiveReadonly(readOnly)
  }

  receiveMutable(a: uint64[]) {
    a[0] = 1
  }

  receiveReadonly(a: readonly uint64[]) {}
}
