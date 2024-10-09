import { BigUint } from '@algorandfoundation/algorand-typescript'

function testErrors(b: string) {
  // @expect-error Arg 0 of BigUInt has an incorrect type of -1...
  BigUint(-1)
  // @expect-error Arg 0 of BigUInt has an incorrect type of -1...
  BigUint(-1n)
  // @expect-error Arg 0 of BigUInt has an incorrect type of 13407807929...
  BigUint(2n ** 512n)
  // @expect-error Only compile time constant string values are supported
  BigUint(b)
}
