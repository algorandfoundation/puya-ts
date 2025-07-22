import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, FixedArray, Uint64 } from '@algorandfoundation/algorand-typescript'
import { DynamicArray, StaticArray, Uint8 } from '@algorandfoundation/algorand-typescript/arc4'

export class Arc4CloneAlgo extends Contract {
  aliasing(mutable: uint64[], mutObj: { a: uint64 }, immutableArr: readonly uint64[], immutableObj: { readonly a: uint64 }) {
    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being assigned to another variable
    const needClone = mutable

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being assigned to another variable
    const needClone2: readonly uint64[] = mutable

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being used in an array literal
    const tupleOfMutable: readonly [uint64[], uint64] = [mutable, 1]

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being assigned to another variable
    const [x] = tupleOfMutable

    const mutableTupleOfMutable: [uint64[]] = [[1, 2, 3]]

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being assigned to another variable
    const [y] = mutableTupleOfMutable
    let z: uint64[]
    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being assigned to another variable
    this.receive((z = mutable))

    // This is fine since spread is a shallow clone
    const m2 = [...mutable]

    const nestedMutables = [[Uint64(1)]]

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being assigned to another variable
    const aliasOfNested = nestedMutables[0]

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being used in an array literal
    const nestedMutables2 = [mutable, [Uint64(2)]]

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being spread into an array literal
    const m3 = [...nestedMutables]

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when when being concatenated
    const m4 = nestedMutables.concat([Uint64(123)])

    // This is fine because there are no nested mutables
    const m5 = mutable.concat(mutable)

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being assigned to another variable
    const o = mutObj

    // This is fine because there are no nested mutables
    const o2 = { ...mutObj }

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being used in an object literal
    const o3 = { x: mutObj }

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being used in an object literal
    const o4 = { ...o3 }

    const m6 = new DynamicArray(new Uint8(1))

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being passed to a DynamicArray constructor
    const m7 = new DynamicArray(m6)

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being passed to a FixedArray constructor
    const m8 = new FixedArray(mutObj)

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being passed to a StaticArray constructor
    const m10 = new StaticArray(m6)

    // This is fine, nested object is immutable
    const m9 = new FixedArray(immutableObj)

    // This is fine, no nested mutable objects
    for (const x of m6) {
      noop()
    }

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when when being iterated
    for (const temp of nestedMutables) {
      const [x] = temp
      noop()
    }
  }

  receive(mutable: uint64[]) {}
}

function noop() {}
