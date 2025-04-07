import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Bytes } from '@algorandfoundation/algorand-typescript'

function testUnsupported(i: uint64) {
  // @expect-error Expression of type `number` must be explicitly converted to an algo-ts type...
  Bytes(1)
  // @expect-error Expression of type `bigint` must be explicitly converted to an algo-ts type...
  Bytes(1n)
  // @expect-error A compile time constant value between 0 and 255 is expected here...
  Bytes([500])
  // @expect-error Invalid length for base16 string
  Bytes.fromHex('f')
  // @expect-error Expected decoded bytes value of length 2, received 1
  Bytes.fromHex<2>('ff')
  // @expect-error Expected decoded bytes value of length 2, received 12
  Bytes.fromBase64<2>('ffffffffffffffff')
  // @expect-error Invalid length for base64 string.
  Bytes.fromBase64<2>('@')
  // @expect-error Invalid character @ at position 0
  Bytes.fromBase64<2>('@@')
  // @expect-error Arg 0 for toFixed has an incorrect type for property 'length' of uint64. Expected numeric literal
  Bytes('abc').toFixed({ length: i })
  // @expect-error Invalid bytes constant length of 3, expected 1
  Bytes('abc').toFixed({ length: 1 })
}
