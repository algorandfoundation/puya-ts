import type { biguint, bytes, uint64 } from '@algorandfoundation/algo-ts'
import { Bytes } from '@algorandfoundation/algo-ts'

function test() {
  const { a, b, c, d } = produceItems()
  const { d: e } = produceItems()
  let g: uint64, i: biguint
  const f = ({ a: g, d: i } = produceItems())

  const j: { a: uint64 } = produceItems()
}

function produceItems(): { a: uint64; b: bytes; c: boolean; d: biguint } {
  return {
    a: 1,
    b: Bytes(''),
    c: false,
    d: 999n,
  }
}

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
