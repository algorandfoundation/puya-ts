import { Uint64, uint64 } from '@algorandfoundation/algo-ts'

function test(x: uint64, y: uint64) {
  // @expect-error '+' is not supported on a conditional expression with ambiguous typing.
  const d: uint64 = (y % 2 ? 2 : 1) + (x < 4 ? x : y)
}
