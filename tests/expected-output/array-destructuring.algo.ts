import type { biguint, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Bytes } from '@algorandfoundation/algorand-typescript'

function test() {
  // @expect-error Spread operator is not supported here
  const [a, ...b] = produceItems()
  // @expect-error Spread operator is not supported here
  const [c, ...d] = produceArray()
}

function produceItems(): [uint64, bytes, boolean, biguint] {
  return [5, Bytes(), false, 6n]
}

function produceArray(): uint64[] {
  return [1, 2, 3]
}
