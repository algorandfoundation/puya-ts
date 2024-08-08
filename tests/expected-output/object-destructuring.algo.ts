import type { biguint, bytes, uint64 } from '@algorandfoundation/algo-ts'
import { Bytes } from '@algorandfoundation/algo-ts'

function test() {
  // @expect-error Spread operator is not supported
  const { a: h, ...j } = produceItems()
}

function produceItems(): { a: uint64; b: bytes; c: boolean; d: biguint } {
  return {
    a: 1,
    b: Bytes(''),
    c: false,
    d: 999n,
  }
}
