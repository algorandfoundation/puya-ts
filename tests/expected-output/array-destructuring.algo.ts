import type { biguint, bytes, uint64 } from '@algorandfoundation/algo-ts'
import { Bytes } from '@algorandfoundation/algo-ts'

function test() {
  // @expect-error Spread operator is not supported
  const [a, ...b] = produceItems()
}

function produceItems(): [uint64, bytes, boolean, biguint] {
  return [5, Bytes(), false, 6n]
}
