import type { arc4, biguint } from '@algorandfoundation/algorand-typescript'
import { FixedArray, type uint64 } from '@algorandfoundation/algorand-typescript'

function test(a: uint64, b: uint64) {
  // @expect-error Spread operator is not supported here
  const [...e] = [a, b]
  // @expect-error Spread operator is not supported here
  const [...f] = [a, b] as const
  const [, g] = [a, b] as const
  const [h] = [a, b] as const

  // @expect-error Zero arg constructor can only be used for fixed arrays with a fixed size encoding.
  const x1 = new FixedArray<string, 4>()
  // @expect-error Zero arg constructor can only be used for fixed arrays with a fixed size encoding.
  const x2 = new FixedArray<biguint, 4>()
  // @expect-error Zero arg constructor can only be used for fixed arrays with a fixed size encoding.
  const x3 = new FixedArray<arc4.Str, 4>()
  // @expect-error Zero arg constructor can only be used for fixed arrays with a fixed size encoding.
  const x4 = new FixedArray<uint64[], 4>()
}
