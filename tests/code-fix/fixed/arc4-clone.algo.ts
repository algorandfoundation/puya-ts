import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { clone, Contract, FixedArray, GlobalState, LocalState, Txn, Uint64 } from '@algorandfoundation/algorand-typescript'
import { DynamicArray, StaticArray, Uint8 } from '@algorandfoundation/algorand-typescript/arc4'

export class Arc4CloneAlgo extends Contract {
  aliasing(mutable: uint64[], mutObj: { a: uint64 }, immutableArr: readonly uint64[], immutableObj: { readonly a: uint64 }) {
    const hasClone = clone(mutable)

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being assigned to another variable
    const needClone = clone(mutable)

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being assigned to another variable
    const needClone2: readonly uint64[] = clone(mutable)

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being used in an array literal
    const tupleOfMutable: readonly [uint64[], uint64] = [clone(mutable), 1]

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being assigned to another variable
    const [x] = clone(tupleOfMutable)

    const mutableTupleOfMutable: [uint64[]] = [[1, 2, 3]]

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being assigned to another variable
    const [y] = clone(mutableTupleOfMutable)
    let z: uint64[]
    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being assigned to another variable
    this.receive((z = clone(mutable)))

    // This is fine since spread is a shallow clone
    const m2 = [...mutable]

    const nestedMutables = [[Uint64(1)]]

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being assigned to another variable
    const aliasOfNested = clone(nestedMutables[0])

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being used in an array literal
    const nestedMutables2 = [clone(mutable), [Uint64(2)]]

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being spread into an array literal
    const m3 = [...clone(nestedMutables)]

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when when being concatenated
    const m4 = clone(nestedMutables).concat([Uint64(123)])

    // This is fine because there are no nested mutables
    const m5 = mutable.concat(mutable)

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being assigned to another variable
    const o = clone(mutObj)

    // This is fine because there are no nested mutables
    const o2 = { ...mutObj }

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being used in an object literal
    const o3 = { x: clone(mutObj) }

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being used in an object literal
    const o4 = { ...clone(o3) }

    const m6 = new DynamicArray(new Uint8(1))

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being passed to a DynamicArray constructor
    const m7 = new DynamicArray(clone(m6))

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being passed to a FixedArray constructor
    const m8 = new FixedArray(clone(mutObj))

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being passed to a StaticArray constructor
    const m10 = new StaticArray(clone(m6))

    // This is fine, nested object is immutable
    const m9 = new FixedArray(immutableObj)

    // This is fine, no nested mutable objects
    for (const x of m6) {
      noop()
    }

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when when being iterated
    for (const temp of clone(nestedMutables)) {
      const [x] = temp
      noop()
    }

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being assigned to another variable
    const m11 = clone(LocalState<string[]>({ key: 'abc' })(Txn.sender).value)

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being assigned to another variable
    const m12 = clone(GlobalState<uint64[]>({ key: 'def' }).value)
  }

  receive(mutable: uint64[]) {}
}

function noop() {}

