import type { biguint, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Bytes } from '@algorandfoundation/algorand-typescript'

function test() {
  // @expect-error Spread operator is not supported here
  const { a: h, ...j } = produceItems()
  // @expect-error The target of an assignment must have the same type as the source...
  const x: { a: uint64; d: biguint } = produceItems()
}

function produceItems(): { a: uint64; b: bytes; c: boolean; d: biguint } {
  return {
    a: 1,
    b: Bytes(''),
    c: false,
    d: 999n,
  }
}
