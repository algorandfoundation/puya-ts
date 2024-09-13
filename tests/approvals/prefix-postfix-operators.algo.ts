import type { biguint, bytes, uint64 } from '@algorandfoundation/algo-ts'

function test_uint64(x: uint64, y: uint64) {
  x++
  x--
  x = --y
  x = ++y
  y = ~y
  return !y
}
function test_biguint(x: biguint, y: biguint) {
  x++
  x--
  x = --y
  x = ++y
  return !y
}
function test_bytes(x: bytes) {
  const y = x.bitwiseInvert()
}
