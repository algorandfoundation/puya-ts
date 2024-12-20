import type { uint64 } from '@algorandfoundation/algorand-typescript'

function test(x: uint64, y: uint64) {
  // @expect-error Expression of type `1 | 2` must be explicitly converted to an algo-ts type...
  const d: uint64 = (y % 2 ? 2 : 1) + (x < 4 ? x : y)
  // @expect-error Expression of type `1 | 2` must be explicitly converted to an algo-ts type...
  const f = (y % 2 ? 2 : 1) === (x < 4 ? x : y)
}
