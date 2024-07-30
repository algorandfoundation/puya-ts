import { biguint, uint64 } from '@algorandfoundation/algo-ts'

function test_uint64() {
  // @expect-error number is not valid as a variable, parameter, or property type.
  const x = 4 * 100 + 10
}

function test_biguint() {
  // @expect-error bigint is not valid as a variable, parameter, or property type.
  const x: bigint = 5n
  const y: biguint = 5n
  // @expect-error Not Supported: BigUint binary operator '**'
  const z: biguint = y ** 2n
}
