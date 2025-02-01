import { BigUint } from '@algorandfoundation/algorand-typescript'

function testErrors(b: string) {
  // @expect-error Arg 0 of BigUInt has an incorrect type of -1. Expected boolean | string | bytes | biguint | uint64
  BigUint(-1)
  // @expect-error Arg 0 of BigUInt has an incorrect type of -1n. Expected boolean | string | bytes | biguint | uint64
  BigUint(-1n)
  // @expect-error biguint overflow or underflow...
  BigUint(2n ** 512n)
  // @expect-error Only compile time constant string values are supported
  BigUint(b)
}
