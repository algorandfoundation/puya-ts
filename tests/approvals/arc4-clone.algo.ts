import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { arc4, assert, clone, Contract, Uint64 } from '@algorandfoundation/algorand-typescript'

// This struct is shared
class SharedStruct extends arc4.Struct<{
  foo: arc4.DynamicBytes
  bar: arc4.Uint8
}> {}

class TopLevelStruct extends arc4.Struct<{
  a: arc4.Uint64
  b: arc4.Str
  shared: SharedStruct
}> {}

export class Arc4CloneAlgo extends Contract {
  aliasing(mutable: uint64[]) {
    const needClone = clone(mutable)

    const needClone2: readonly uint64[] = clone(mutable)

    const tupleOfMutable: readonly [uint64[], uint64] = [clone(mutable), 1]

    const [x] = clone(tupleOfMutable)

    const mutableTupleOfMutable: [uint64[]] = [[1, 2, 3]]

    const [y] = clone(mutableTupleOfMutable)
    let z: uint64[]
    this.receive((z = clone(mutable)))

    this.receiveReadonly(mutable)

    // This is fine since spread is a shallow clone
    const m2 = [...mutable]

    const nestedMutables = [[Uint64(1)]]

    const nestedMutables2 = [clone(mutable), [Uint64(2)]]

    const m3 = [...clone(nestedMutables)]

    const m4 = clone(nestedMutables).concat([Uint64(123)])

    // This is fine because there are no nested mutables
    const m5 = mutable.concat(mutable)
  }

  receive(mutable: uint64[]) {}

  receiveReadonly(a: readonly uint64[]) {}

  structReturn(arg: TopLevelStruct): SharedStruct {
    // this throws an error in python and requires `_HasAssignmentVisitor.check(expr.condition)` in arc4 copy validator
    assert(arg.shared === echo(arg.shared), "this won't error")
    return arg.shared
  }
}

function echo(s: SharedStruct): SharedStruct {
  return s
}
/*


./TELUS-606088783-2024-01-13.pdf ./TELUS-606088783-2024-02-13.pdf ./TELUS-606088783-2024-03-13.pdf ./TELUS-606088783-2024-04-13.pdf ./TELUS-606088783-2024-05-13.pdf ./TELUS-606088783-2024-06-13.pdf ./TELUS-606088783-2024-07-13.pdf ./TELUS-606088783-2024-08-13.pdf ./TELUS-606088783-2024-09-13.pdf ./TELUS-606088783-2024-10-13.pdf ./TELUS-606088783-2024-11-13.pdf ./TELUS-606088783-2024-12-13.pdf

 */
