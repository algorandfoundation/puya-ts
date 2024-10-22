import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, Uint64 } from '@algorandfoundation/algorand-typescript'

function test() {
  const items = [
    { a: Uint64(1), b: Uint64(2) },
    { a: Uint64(2), b: Uint64(2) },
    { a: Uint64(3), b: Uint64(2) },
  ] as const
  let total: uint64 = 0
  for (const { a } of items) {
    total += a
  }
  assert(total === 6)
}
