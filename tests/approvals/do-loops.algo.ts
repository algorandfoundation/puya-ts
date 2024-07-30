import { Uint64, uint64 } from '@algorandfoundation/algo-ts'

function test_do(stop: uint64) {
  let i = Uint64(0)
  do {
    i += 1
  } while (i < stop)
}
