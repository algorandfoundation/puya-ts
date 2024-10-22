import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { BaseContract } from '@algorandfoundation/algorand-typescript'

type BthenA = { b: uint64; a: uint64 }

function test_assign_from_var(x: { a: uint64; b: uint64 }) {
  const obj: BthenA = x
}

function test_assign_from_literal(x: uint64) {
  let b: uint64
  const obj: { a: uint64; z: uint64 } = {
    z: (b = x * 2),
    a: b,
  }
}

export class Demo extends BaseContract {
  public approvalProgram(): boolean {
    test_assign_from_literal(4)

    test_assign_from_var({ a: 3, b: 4 })

    return true
  }
}
