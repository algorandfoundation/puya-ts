import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Uint64 } from '@algorandfoundation/algorand-typescript'

function test_do(stop: uint64) {
  let i = Uint64(0)
  do {
    i += 1
  } while (i < stop)
}
