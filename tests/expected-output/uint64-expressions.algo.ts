import { Uint64 } from '@algorandfoundation/algorand-typescript'

function test() {
  // @expect-error uint64 overflow or underflow...
  Uint64(-1)
  // @expect-error uint64 overflow or underflow...
  Uint64(-1n)
  // @expect-error Cannot convert abc to an integer
  Uint64('abc')
  // @expect-error Cannot convert 0.1 to an integer
  Uint64('0.1')
  // @expect-error uint64 overflow or underflow...
  Uint64('-1')
  // @expect-error uint64 overflow or underflow...
  Uint64(18446744073709551617n)
  // @expect-error uint64 overflow or underflow...
  Uint64('18446744073709551616')
  const varStr = '123'
  // @expect-error Expected constant of type string
  Uint64(varStr)
}
