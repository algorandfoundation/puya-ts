import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract, Uint64 } from '@algorandfoundation/algorand-typescript'

export class Arc4CloneAlgo extends Contract {
  aliasing(mutable: uint64[]) {
    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being assigned to another variable
    const needClone = mutable

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being assigned to another variable
    const needClone2: readonly uint64[] = mutable

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being passed to a tuple expression
    const tupleOfMutable: readonly [uint64[], uint64] = [mutable, 1]

    // @expect-error tuples containing a reference to a mutable stack type cannot be destructured, use index access with clone(...) instead
    const [x] = tupleOfMutable

    const mutableTupleOfMutable: [uint64[]] = [[1, 2, 3]]

    // Ideally this would be the same error as above, but because we translate mutable destructuring into comma expressions it's impossible to reliably
    // detect that the original expression was a destructuring one, from the AWST alone.
    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being assigned to another variable
    const [y] = mutableTupleOfMutable
    let z: uint64[]
    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being assigned to another variable
    this.receive((z = mutable))

    // This is fine since spread is a shallow clone
    const m2 = [...mutable]

    const nestedMutables = [[Uint64(1)]]

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being passed to an array constructor
    const nestedMutables2 = [mutable, [Uint64(2)]]

    // @expect-error cannot create multiple references to a mutable stack type, the value must be copied using clone(...) when being assigned to another variable
    const m3 = [...nestedMutables]

    // @expect-error expression containing a reference to value with nested mutable types must be cloned when being concatenated
    const m4 = nestedMutables.concat([Uint64(123)])

    // This is fine because there are no nested mutables
    const m5 = mutable.concat(mutable)
  }

  receive(mutable: uint64[]) {}
}
