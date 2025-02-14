import type { uint64 } from '@algorandfoundation/algorand-typescript'

function test(a: uint64, b: uint64) {
  // @expect-error Spread operator is not supported in assignment expressions where the resulting type is a variadic array
  const [...e] = [a, b]
  // @expect-error Spread operator is not currently supported with tuple expressions
  const [...f] = [a, b] as const
  const [, g] = [a, b] as const
  const [h] = [a, b] as const
}
