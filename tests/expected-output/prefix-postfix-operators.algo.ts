import { biguint, bytes, uint64 } from '@algorandfoundation/algo-ts'

function test_uint64(x: uint64, y: uint64) {
  // @expect-error Not Supported: Prefix Unary - op on uint64
  const a = -y
}
function test_biguint(x: biguint, y: biguint) {
  // @expect-error Not Supported: Prefix Unary - op on biguint
  const a = -y
  // @expect-error Bitwise inversion of biguint is not supported as the bit size is indeterminate
  y = ~y
  return !y
}
function test_bytes(x: bytes) {
  // @expect-error The '~' bytes operator coerces the target value to a number type. Use {bytes expression}.bitwiseInvert() instead
  const y: uint64 = ~x
}
