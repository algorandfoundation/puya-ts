import type { uint64 } from '@algorandfoundation/algorand-typescript'

function test(a: uint64, b: uint64) {
  const inferTuple = [a, b] as const
  const explicitTuple: [uint64, uint64] = [a, b]

  const conditionalExplicitTuple: [uint64, uint64] = a < b ? [a, b] : [b, a]

  const [c, d] = [a, b]

  //const [...f] = [a, b] as const
  const [, g] = [a, b] as const
  const [h] = [a, b] as const
}
