import type { biguint, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Bytes, MutableObject } from '@algorandfoundation/algorand-typescript'

class Vector extends MutableObject<{ x: uint64; y: uint64 }> {}
class Coordinate extends MutableObject<{ v: Vector; z: biguint }> {}

function testPartialDestructure(arg: { x: uint64; y: uint64; z: biguint }) {
  const { x } = arg
  const {
    nested: { y },
  } = { nested: arg }
}

function testPartialDestructureMutableObject(arg: Coordinate) {
  const {
    v: { x },
  } = arg
  const {
    nested: {
      v: { y },
    },
  } = { nested: arg.copy() }
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
    v: { x, y },
    z,
  } = produceCoordinates()
  const {
    v: { y: b },
  } = produceCoordinates()
  let g: uint64, i: biguint
  const f = ({
    v: { x: g },
    z: i,
  } = produceCoordinates())
  receivePartialMutableObject(produceCoordinates())
}

function produceItems(): { a: uint64; b: bytes; c: boolean; d: biguint } {
  return {
    a: 1,
    b: Bytes(''),
    c: false,
    d: 999n,
  }
}

function produceCoordinates(): Coordinate {
  return new Coordinate({ v: new Vector({ x: 1, y: 2 }), z: 3n })
}

function receivePartial(x: { a: uint64; d: biguint }) {}

function receivePartialMutableObject(a: { v: { x: uint64; y: uint64 } }) {}

function testLiteralToLiteral() {
  const a: uint64 = 4
  const b: uint64 = 1
  let c: uint64
  let d: uint64

  const { a: e, b: f } = ({ a: c, b: d } = { a, b })
}

function testNumericResolution() {
  let y: { a: uint64 }
  const x: { a: uint64 } = (y = { a: 434 })
}

function test2(args: { x: boolean; y: boolean; z: readonly [string, string] }) {
  const {
    a,
    b,
    args: { x, y },
  } = { a: true, b: false, args }

  const args2 = { ...args, x: true, y: true }
}
