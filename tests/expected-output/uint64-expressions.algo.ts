import { Uint64 } from '@algorandfoundation/algorand-typescript'

/* eslint-disable no-loss-of-precision */

function test() {
  // @expect-error Arg 0 of Uint64 has an incorrect type of -1. Expected uint64 | boolean | string
  Uint64(-1)
  // @expect-error Arg 0 of Uint64 has an incorrect type of -1n. Expected uint64 | boolean | string
  Uint64(-1n)
  // @expect-error Cannot convert abc to an integer
  Uint64('abc')
  // @expect-error Cannot convert 0.1 to an integer
  Uint64('0.1')
  // @expect-error uint64 overflow or underflow: -1
  Uint64('-1')
  // @expect-error uint64 overflow or underflow...
  Uint64(18446744073709551617n)
  // @expect-error This number will lose precision...
  Uint64(1844674407370955161)
  // @expect-error uint64 overflow or underflow...
  Uint64('18446744073709551616')
}
