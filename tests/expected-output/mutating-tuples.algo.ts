import type { uint64 } from '@algorandfoundation/algorand-typescript'

/* eslint-disable @typescript-eslint/ban-ts-comment */

function test(a: uint64) {
  const t1: readonly [uint64, uint64, uint64] = [a, a, a]
  let t2 = { a, b: a, c: a }

  a *= 2

  // @expect-error Expression is not a valid assignment target - object is immutable
  // @ts-expect-error
  t1[0] = a

  // @expect-error Expression is not a valid assignment target - object is immutable
  t2.a = a

  t2 = { ...t2, a }
}
