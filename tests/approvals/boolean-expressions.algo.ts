import { uint64, bytes, assert } from '@algorandfoundation/algo-ts'

function test(a: uint64, b: uint64, c: string, d: bytes, e: uint64) {
  a || b
  a || b || e

  const x = a || b || e
  //assert(a || b || a, 'a or b')
  const y = a && b
  //const z = (a && d) || y ? x || y : x && y
  if (a || (c && d)) {
    return true
  }
  return false
}
