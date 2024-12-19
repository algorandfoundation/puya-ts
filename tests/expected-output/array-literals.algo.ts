import type { uint64 } from '@algorandfoundation/algorand-typescript'

function test(a: uint64, b: uint64) {
  // @expect-error `Array<uint64>` is not valid as a variable, parameter, return, or property type...
  const inferArray = [a, b]

  const inferTuple = [a, b] as const

  const explicitTuple: [uint64, uint64] = [a, b]

  // @expect-error `Array<uint64>` is not valid as a variable, parameter, return, or property type...
  const conditionalInferArray = a < b ? [a, b] : [b, a]
  const conditionalExplicitTuple: [uint64, uint64] = a < b ? [a, b] : [b, a]

  const [c, d] = [a, b]

  // @expect-error `Array<uint64>` is not valid as a variable, parameter, return, or property type...
  const [...e] = [a, b]
  // @expect-error Spread operator is not currently supported with tuple expressions
  const [...f] = [a, b] as const
  const [, g] = [a, b] as const
  const [h] = [a, b] as const
}
