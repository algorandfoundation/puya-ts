import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Bytes, op } from '@algorandfoundation/algorand-typescript'

function testUnsupported(i: uint64) {
  // @expect-error Argument b must be bytes<1232>
  op.falconVerify(Bytes(), Bytes().toFixed({ length: 32, strategy: 'unsafe-cast' }), op.bzero(1793))
  // @expect-error Expression of type `number` must be explicitly converted to an algo-ts type...
  Bytes(1)
  // @expect-error Expression of type `bigint` must be explicitly converted to an algo-ts type...
  Bytes(1n)
  // @expect-error A compile time constant value between 0 and 255 is expected here...
  Bytes([500])
  // @expect-error Invalid length for base16 string
  Bytes.fromHex('f')
  // @expect-error Invalid bytes constant length of 1, expected 2
  Bytes.fromHex('ff').toFixed({ length: 2 })
  // @expect-error Invalid bytes constant length of 12, expected 2
  Bytes.fromBase64('ffffffffffffffff').toFixed({ length: 2 })
  // @expect-error Invalid length for base64 string.
  Bytes.fromBase64('@').toFixed({ length: 2 })
  // @expect-error Invalid character @ at position 0
  Bytes.fromBase64('@@').toFixed({ length: 2 })
  // @expect-error Arg 0 for toFixed has an incorrect type for property 'length' of uint64. Expected numeric literal
  Bytes('abc').toFixed({ length: i })
  // @expect-error Invalid bytes constant length of 3, expected 1
  Bytes('abc').toFixed({ length: 1 })
}
