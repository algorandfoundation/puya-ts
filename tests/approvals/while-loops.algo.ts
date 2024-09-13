import type { uint64 } from '@algorandfoundation/algo-ts'
import { Uint64 } from '@algorandfoundation/algo-ts'

function test_while(stop: uint64) {
  let i = Uint64(0)
  while (i < stop) {
    i += 1
  }
}
