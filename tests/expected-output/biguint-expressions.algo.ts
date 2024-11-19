import { BigUint } from '@algorandfoundation/algorand-typescript'

function testErrors(b: string) {
  // @expect-error biguint overflow or underflow...
  BigUint(-1)
  // @expect-error biguint overflow or underflow...
  BigUint(-1n)
  // @expect-error biguint overflow or underflow...
  BigUint(2n ** 512n)
  // @expect-error Only compile time constant string values are supported
  BigUint(b)
}
