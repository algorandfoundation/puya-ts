import type { arc4, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, assertMatch, clone, Contract, ensureBudget, FixedArray, Uint64 } from '@algorandfoundation/algorand-typescript'
import { Bool, DynamicArray, StaticArray, UintN32 } from '@algorandfoundation/algorand-typescript/arc4'

type Vector = { x: uint64; y: uint64 }
export class NativeArraysAlgo extends Contract {
  readonlyArray() {
    let myArray: readonly uint64[] = [1, 2, 3]

    myArray = myArray.concat(Uint64(5))

    myArray = [...myArray, Uint64(4)]

    // Instead of index assignment
    myArray = myArray.with(2, 3)

    assertMatch(myArray, [1, 2, 3, 5, 4])
  }

  arrayInObject() {
    type Person = Readonly<{ name: string; favouriteNumbers: uint64[] }>
    const person: Person = {
      name: 'Alice',
      favouriteNumbers: [1337],
    }
    const length: uint64 = person.favouriteNumbers.push(42)
    assert(length === 2)
  }

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
    ensureBudget(1400)
    let arr = this.buildArray()

    arr.push(5)
    assert(arr.pop()! === 5)
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

    let rArr1: readonly uint64[] = [1, 2, 3]
    rArr1 = rArr1.concat(Uint64(4))
    rArr1 = [...rArr1, Uint64(5)]
    assertMatch(rArr1, [1, 2, 3, 4, 5])

    const fArr1 = new FixedArray<uint64, 4>()
    const fArr2 = fArr1.concat(fArr1)
    assertMatch(fArr1, [0, 0, 0, 0])
    assertMatch(fArr2, [0, 0, 0, 0, 0, 0, 0, 0])

    const arr3 = rArr1.concat(fArr2)
    assertMatch(arr3, [1, 2, 3, 4, 5, 0, 0, 0, 0, 0, 0, 0, 0])

    const arr4 = rArr1.concat(arr)
    assertMatch(arr4, [1, 2, 3, 4, 5, 1, 10, 3, 4, 1, 10, 3, 4, 11, 12, 13])

    const arr5 = fArr1.concat(rArr1)
    assertMatch(arr5, [0, 0, 0, 0, 1, 2, 3, 4, 5])

    const arr6 = fArr1.concat(arr)
    assertMatch(arr6, [0, 0, 0, 0, 1, 10, 3, 4, 1, 10, 3, 4, 11, 12, 13])

    const arr7 = arr.concat(rArr1)
    assert(arr7.length === 16)
    assertMatch(arr7, [1, 10, 3, 4, 1, 10, 3, 4, 11, 12, 13, 1, 2, 3, 4, 5])

    const arr8 = arr.concat(fArr1)
    assert(arr8.length === 15)
    assertMatch(arr8, [1, 10, 3, 4, 1, 10, 3, 4, 11, 12, 13, 0, 0, 0, 0])
  }

  fixedArray(y: FixedArray<uint64, 50>) {
    const x = new FixedArray<uint64, 4>(1, 2, 3, 4)
    x[0] = 0

    assert(x[0] === y[0])
    assertMatch(x, [{ lessThan: 1 }, 2, 3, 4])
    assertMatch(y, { 49: { greaterThanEq: 0 } })

    const myVectors: FixedArray<Vector, 2> = new FixedArray<Vector, 2>({ x: 1, y: 2 }, { x: 3, y: 4 })
    assertMatch(myVectors, [
      { x: 1, y: 2 },
      { x: 3, y: 4 },
    ])

    const myObject: { a: FixedArray<Vector, 1> } = { a: new FixedArray<Vector, 1>({ x: 5, y: 6 }) }
    assertMatch(myObject.a, [{ x: 5, y: 6 }])

    const z1 = new FixedArray<uint64, 4>()
    assert(z1.length === 4)
    assertMatch(z1, [0, 0, 0, 0])
    z1[0] = 1
    z1[1] = 2
    z1[2] = 3
    z1[3] = 4
    assertMatch(z1, [{ lessThanEq: 1 }, 2, 3, 4])

    const z2 = new FixedArray<boolean, 3>()
    assert(z2[0] === false)

    const z3 = new FixedArray<FixedArray<uint64, 2>, 4>()
    assert(z3.length === 4)

    const z4 = new FixedArray<Vector, 4>()
    assert(z4.length === 4)

    const z5 = new FixedArray<arc4.UintN<64>, 4>()
    assert(z5.length === 4)

    const z6 = new FixedArray<[uint64, boolean], 4>()
    assert(z6.length === 4)
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
    const needClone2: readonly uint64[] = clone(mutable)

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
