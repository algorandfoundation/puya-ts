import { Uint64, uint64 } from '@algorandfoundation/algo-ts'

function test_for_loop(start: uint64, stop: uint64, step: uint64) {
  let total = Uint64(0)
  for (let i = start; i < stop; i += step) {
    total += i
  }
  return total
}
