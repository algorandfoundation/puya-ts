import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Uint64 } from '@algorandfoundation/algorand-typescript'

function test_while(stop: uint64) {
  let i = Uint64(0)
  while (i < stop) {
    i += 1
  }
}
