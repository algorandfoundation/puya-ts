import type { biguint, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, assertMatch, Bytes, clone, Contract, MutableObject } from '@algorandfoundation/algorand-typescript'

class Coordinate extends MutableObject<{ x: uint64; y: uint64 }> {}
class Vector extends MutableObject<{ c1: Coordinate; c2: Coordinate }> {}

function testPartialDestructure(arg: { x: uint64; y: uint64; z: biguint }) {
  const { x } = arg
  const {
    nested: { y },
  } = { nested: arg }
  return [x, y] as const
}

function testPartialDestructureMutableObject(arg: Vector) {
  const {
    c1: { x },
  } = arg
  const {
    nested: {
      c1: { y },
    },
  } = { nested: clone(arg) }
  return [x, y] as const
}

function test() {
  const { a, b, c, d } = produceItems()
  const { d: e } = produceItems()
  let g: uint64, i: biguint
  const f = ({ a: g, d: i } = produceItems())
  receivePartial(produceItems())
}

function testMutableObject() {
  const {
    c1: { x, y },
    c2,
  } = produceVector()
  const {
    c1: { y: b },
  } = produceVector()
  let g: uint64, i: Coordinate
  const f = ({
    c1: { x: g },
    c2: i,
  } = produceVector())
  receivePartialMutableObject(produceVector())
}

function produceItems(): { a: uint64; b: bytes; c: boolean; d: biguint } {
  return {
    a: 1,
    b: Bytes(''),
    c: false,
    d: 999n,
  }
}

function produceVector(): Vector {
  return new Vector({ c1: new Coordinate({ x: 1, y: 2 }), c2: new Coordinate({ x: 4, y: 1 }) })
}

function receivePartial(x: { a: uint64; d: biguint }) {}

function receivePartialMutableObject(a: { c1: { x: uint64; y: uint64 } }) {}

function testLiteralToLiteral() {
  const a: uint64 = 4
  const b: uint64 = 1
  let c: uint64
  let d: uint64

  const { b: f, a: e } = ({ a: c, b: d } = { a, b })
  return [e, f, c, d]
}

function testNumericResolution() {
  let y: { a: uint64 }
  const x: { a: uint64 } = (y = { a: 434 })
  assertMatch([x.a, y.a], [434, 434])
}

function test2(args: { x: boolean; y: boolean; z: readonly [string, string] }) {
  const {
    a,
    b,
    args: { x, y },
  } = { a: true, b: false, args }
  assert(a && !b)
  const args2 = { ...args, x: true, y: true }

  assert(args2.x && args2.y)
}

class ObjectDestructuringAlgo extends Contract {
  test() {
    const res = testPartialDestructure({ x: 1, y: 4, z: 123n })
    assertMatch(res, [1, 4])

    const res2 = testPartialDestructureMutableObject(
      new Vector({ c1: new Coordinate({ x: 10, y: 20 }), c2: new Coordinate({ x: 20, y: 30 }) }),
    )
    assertMatch(res2, [10, 20])

    testNumericResolution()

    const res3 = testLiteralToLiteral()
    assertMatch(res3, [4, 1, 4, 1])

    test()

    testMutableObject()
  }
}
