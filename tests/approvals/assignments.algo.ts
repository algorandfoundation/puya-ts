import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, clone, Contract, log } from '@algorandfoundation/algorand-typescript'

type MutableObj = { a: uint64; b: uint64 }
type ImmutableObj = { readonly a: uint64; readonly b: uint64 }

export class AssignmentsAlgo extends Contract {
  testPrimitives(u: uint64) {
    const p1 = u
    let p2: uint64 = 2
    p2 += 1
  }

  testArrayDestructure(i_a: ReadonlyArray<uint64>, u: uint64, m_a: uint64[]) {
    const [, a1] = i_a
    let a2: uint64, a3: uint64
    const a5 = ([a2, a3] = [logAndReturn(u), logAndReturn(u), logAndReturn(u)])
    assert(a5.length === 3, 'a5 length should be 3')
    const [a4]: [uint64] = [1]
    const [c, d] = [logAndReturn(u), logAndReturn(u), logAndReturn(u)]
    const [a6, a7] = m_a
  }

  testArrayNarrowing(m_a: uint64[], u: uint64) {
    const direct = clone(m_a)

    const narrowed: readonly uint64[] = clone(m_a)
    let fromLit: readonly uint64[]
    const result = (fromLit = [u, u, u])

    const fromLit2: readonly uint64[] = [u, u, u]
  }

  testNested(i_a: ReadonlyArray<ReadonlyArray<uint64>>) {
    const [[a]] = i_a
  }

  testDestructureObj(m: { a: uint64; b: string }, i: Readonly<{ a: uint64; b: string }>) {
    const { a: a1, b: b1 } = m
    const { a: a2, b: b2 } = i
  }

  testObjLiteralNarrowing(a: uint64, b: uint64) {
    const mObj: MutableObj = { a, b }
    const imObj: ImmutableObj = { a, b }

    const mObj2: MutableObj = { a: 123, b: 456 }
    const imObj2: ImmutableObj = { a: 456, b }

    // TODO: Verify getVal only called once
    const mObj3: MutableObj = { ...getVal() }
    // TODO: Verify getVal called once (even though its values aren't used)
    const mObj4: MutableObj = { ...getVal(), a, b }
  }

  testMixed(m: Array<{ a: [uint64] }>) {
    const [
      {
        a: [a1],
      },
    ] = m
    m = [{ a: [213] }]
  }
}

function getVal(): ImmutableObj {
  // Maybe side effects
  return {
    a: 1,
    b: 2,
  }
}

function logAndReturn(u: uint64): uint64 {
  log(u)
  return u
}
