import type { uint64 } from '@algorandfoundation/algo-ts'

function test_for_of_loop(items: readonly [uint64, uint64, uint64]) {
  let total: uint64 = 0
  for (const item of items) {
    total += item
  }
  return total
}
