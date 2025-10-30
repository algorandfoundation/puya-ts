import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, assertMatch, clone, contract, Contract, Global, log, op } from '@algorandfoundation/algorand-typescript'

type MutableObj = { a: uint64; b: uint64 }
type ImmutableObj = { readonly a: uint64; readonly b: uint64 }

const countSlot = 0
function resetCount() {
  op.Scratch.store(countSlot, 0)
}
function getCount() {
  return op.Scratch.loadUint64(countSlot)
}

function incCount() {
  op.Scratch.store(countSlot, op.Scratch.loadUint64(countSlot) + 1)
}

@contract({ scratchSlots: [countSlot] })
export class AssignmentsAlgo extends Contract {
  testPrimitives(u: uint64) {
    const p1 = u
    let p2: uint64 = 2
    p2 += 1
    assert(p2 === 3)
    assert(p1 === u)
  }

  testAccountDestructure() {
    const { balance, minBalance } = Global.currentApplicationAddress
    return { balance, minBalance }
  }

  testArrayDestructure(i_a: ReadonlyArray<uint64>, u: uint64, m_a: uint64[]) {
    const [, a1] = i_a
    assert(a1 === i_a[1])
    let a2: uint64, a3: uint64
    resetCount()
    const a5 = ([a2, a3] = [logAndReturn(u), logAndReturn(u), logAndReturn(u)])
    assert(getCount() === 3, 'logAndReturn called 3 times')
    assert(a2 === u)
    assert(a3 === u)
    assertMatch(a5, [u, u, u])
    assert(a5.length === 3, 'a5 length should be 3')
    const [a4]: [uint64] = [1]
    assert(a4 === 1)
    const [c, d] = [logAndReturn(u), logAndReturn(u), logAndReturn(u)]
    assertMatch([c, d], [u, u])
    const [a6, a7] = m_a
    assert(a6 === m_a[0])
    assert(a7 === m_a[1])
  }

  testArrayNarrowing(m_a: uint64[], u: uint64) {
    const direct = clone(m_a)
    m_a[0] += 1
    direct[0] += 2
    assert(m_a[0] !== direct[0])

    const narrowed: readonly uint64[] = clone(m_a)
    const narrowed2 = narrowed
    let fromLit: readonly uint64[]
    const result = (fromLit = [u, u, u])

    const fromLit2: readonly uint64[] = [u, u, u]
  }

  testTupleToArray(m_t: [uint64, uint64], i_t: readonly [uint64, uint64]) {
    const m_a: uint64[] = clone(m_t)
    assertMatch(m_a, m_t)
    const i_a: readonly uint64[] = clone(m_t)
    assertMatch(i_a, m_t)

    const i_a2: readonly uint64[] = i_t
    assertMatch(i_a2, i_t)
  }

  testNested(i_a: ReadonlyArray<ReadonlyArray<uint64>>) {
    const [[a]] = i_a
    assert(a === i_a[0][0])
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

    resetCount()
    const mObj3: MutableObj = { ...getVal() }
    assert(getCount() === 1, 'getVal should only be called once')

    const mObj4: MutableObj = { ...getVal(), a, b }
    assert(getCount() === 2, 'getVal should still be called once even though its result is not used')
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
  incCount()
  // Maybe side effects
  return {
    a: 1,
    b: 2,
  }
}

function logAndReturn(u: uint64): uint64 {
  incCount()
  log(u)
  return u
}
