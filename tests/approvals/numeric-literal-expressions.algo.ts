import { biguint, uint64 } from '@algorandfoundation/algo-ts'

function test_uint64() {
  const x: uint64 = 4 * 100 + 10
  const y: uint64 = 100 / x
  const z: uint64 = x ** 2
  if (x === 4 || 2 <= y) {
    return true
  }
  return false
}

function test_biguint() {
  const x: biguint = 4n * 100n + 10n
  const y: biguint = 100n / x
  const z: biguint = 5n ** 2n
}
