import type { biguint } from '@algorandfoundation/algorand-typescript'
/* eslint-disable no-loss-of-precision */

// @expect-error This number will lose precision at runtime. Use the Uint64 constructor with a bigint or string literal for very large integers.
const x = 123123123123123123

/* eslint-disable prefer-const */
function test_uint64() {
  // @expect-error `number` is not valid as a variable, parameter, return, or property type. Please use an algo-ts type such as `biguint` or `uint64`
  let x = 4 * 100 + 10
}

function test_biguint() {
  // @expect-error `bigint` is not valid as a variable, parameter, return, or property type. Please use an algo-ts type such as `biguint` or `uint64`
  let x: bigint = 5n
  const y: biguint = 5n
  // @expect-error Not Supported: BigUint binary operator '**'
  const z: biguint = y ** 2n
}
