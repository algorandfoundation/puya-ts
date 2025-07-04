import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, assertMatch, BaseContract } from '@algorandfoundation/algorand-typescript'
import { encodeArc4 } from '@algorandfoundation/algorand-typescript/arc4'

type BthenA = Readonly<{ b: uint64; a: uint64 }>

function test_assign_from_var(x: Readonly<{ a: uint64; b: uint64 }>) {
  assert(x.a !== x.b, 'For the purpose of this test, a should not equal b')
  const obj: BthenA = x
  const xEncoded = encodeArc4(x)
  const objEncoded = encodeArc4(obj)
  assert(xEncoded === objEncoded.slice(8).concat(objEncoded.slice(0, 8)), 'Encoded order should be swapped')
}

function test_assign_from_literal(x: uint64) {
  let b: uint64
  const obj: { a: uint64; z: uint64 } = {
    z: (b = x * 2),
    a: b,
  }
  assertMatch(obj, {
    z: x * 2,
    a: x * 2,
  })
}

export class Demo extends BaseContract {
  public approvalProgram(): boolean {
    test_assign_from_literal(4)

    test_assign_from_var({ a: 3, b: 4 })

    return true
  }
}
