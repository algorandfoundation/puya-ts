import type { biguint, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, Bytes, Uint64 } from '@algorandfoundation/algorand-typescript'

function test() {
  const [a, b, c, d] = produceItems()
  const [, , e] = produceItems()

  let g: uint64, i: biguint
  const f = ([g, , , i] = produceItems())
}

function produceItems(): [uint64, bytes, boolean, biguint] {
  return [5, Bytes(), false, 6n]
}

function testLiteralDestructuring() {
  let a = Uint64(1)
  let b = Uint64(2)

  const [x, y] = ([b, a] = [a, b])

  assert(x === b)
  assert(y === a)
}
