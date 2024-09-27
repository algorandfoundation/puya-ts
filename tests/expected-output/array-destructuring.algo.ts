import type { biguint, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Bytes } from '@algorandfoundation/algorand-typescript'

function test() {
  // @expect-error Spread operator is not supported
  const [a, ...b] = produceItems()
}

function produceItems(): [uint64, bytes, boolean, biguint] {
  return [5, Bytes(), false, 6n]
}
