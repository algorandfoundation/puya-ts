import { BigUint } from '@algorandfoundation/algorand-typescript'

function testErrors(b: string) {
  // @expect-error biguint overflow or underflow: -1
  BigUint(-1)
  // @expect-error biguint overflow or underflow: -1
  BigUint(-1n)
  // @expect-error biguint overflow or underflow: 13407807929942597099574024998205846127479365820592393377723561443721764030073546976801874298166903427690031858186486050853753882811946569946433649006084096
  BigUint(2n ** 512n)
  // @expect-error Only compile time constant string values are supported
  BigUint(b)
}
