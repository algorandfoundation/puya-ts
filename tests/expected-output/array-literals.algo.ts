import type { uint64 } from '@algorandfoundation/algorand-typescript'

function test(a: uint64, b: uint64) {
  // @expect-error Spread operator is not supported here
  const [...e] = [a, b]
  // @expect-error Spread operator is not supported here
  const [...f] = [a, b] as const
  const [, g] = [a, b] as const
  const [h] = [a, b] as const
}
