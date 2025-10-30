import type { biguint, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Bytes } from '@algorandfoundation/algorand-typescript'

function test() {
  // @expect-error Spread operator is not supported here
  const { a: h, ...j } = produceItems()
  // @expect-error Cannot resolve expression of type {readonly a:uint64,readonly b:bytes,readonly c:boolean,readonly d:biguint} to {a:uint64,d:biguint}
  const x: { a: uint64; d: biguint } = produceItems()
}

function produceItems(): Readonly<{ a: uint64; b: bytes; c: boolean; d: biguint }> {
  return {
    a: 1,
    b: Bytes(''),
    c: false,
    d: 999n,
  }
}
