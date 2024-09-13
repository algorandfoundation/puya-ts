import type { uint64, bytes } from '@algorandfoundation/algo-ts'
import { assert } from '@algorandfoundation/algo-ts'

function test(a: uint64, b: uint64, c: string, d: bytes, e: uint64) {
  const x = a || b || e
  assert(a && b && e, 'a or b')
  const y = a && b
  const z = (a && d) || y ? x || y : x && y
  if (a || (c && d)) {
    return true
  }

  let f: uint64 = 0
  if ((f = a || b)) {
    return true
  }
  return false
}
