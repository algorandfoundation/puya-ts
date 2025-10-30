import type { uint64 } from '@algorandfoundation/algorand-typescript'
import { Bytes, op, Uint64 } from '@algorandfoundation/algorand-typescript'

function testUnsupported(i: uint64) {
  const options = { length: Uint64(3) }
  // @expect-error Arg 0 for Bytes has an incorrect type for property 'length' of uint64. Expected numeric literal
  const x1 = Bytes(options)
  // @expect-error Arg 1 for Bytes has an incorrect type for property 'length' of uint64. Expected numeric literal
  const x2 = Bytes('abc', options)
  // @expect-error Arg 0 for toFixed has an incorrect type for property 'length' of uint64. Expected numeric literal
  const x3 = x2.toFixed(options)
  // @expect-error Invalid bytes constant length of 3, expected 32
  const x4 = Bytes('abc', { length: 32 })
  // @expect-error Invalid bytes constant length of 8, expected 32
  const x5 = Bytes(Uint64(1), { length: 32 })
  // @expect-error Invalid bytes constant length of 3, expected 32
  const x6 = Bytes([1, 2, 3], { length: 32 })
  // @expect-error Arg 1 for Bytes has an incorrect type for property 'length' of uint64. Expected numeric literal
  const x7 = Bytes('abc', { length: i })
  // @expect-error Arg 0 for Bytes has an incorrect type for property 'length' of uint64. Expected numeric literal
  const x8 = Bytes({ length: i })
  // @expect-error Invalid strategy value of 'unsafe-cast'. Expected 'assert-length' for constant values
  const x9 = Bytes([1, 2, 3], { length: 3, strategy: 'unsafe-cast' })
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
  // @expect-error Expected decoded bytes value of length 2, received 1
  Bytes.fromHex('ff', { length: 2 })
  // @expect-error Arg 1 for fromHex has an incorrect type for property 'length' of uint64. Expected numeric literal
  Bytes.fromHex('ff', options)
  // @expect-error Arg 1 for fromHex has an incorrect type for property 'length' of uint64. Expected numeric literal
  Bytes.fromHex('ff', { length: i })
  // @expect-error Invalid bytes constant length of 12, expected 2
  Bytes.fromBase64('ffffffffffffffff').toFixed({ length: 2 })
  // @expect-error Expected decoded bytes value of length 2, received 12
  Bytes.fromBase64('ffffffffffffffff', { length: 2 })
  // @expect-error Invalid strategy value of 'unsafe-cast'. Expected 'assert-length'
  Bytes.fromBase64('ffffffffffffffff', { length: 12, strategy: 'unsafe-cast' })
  // @expect-error Invalid length for base64 string.
  Bytes.fromBase64('@').toFixed({ length: 2 })
  // @expect-error Invalid character @ at position 0
  Bytes.fromBase64('@@').toFixed({ length: 2 })
  // @expect-error Arg 0 for toFixed has an incorrect type for property 'length' of uint64. Expected numeric literal
  Bytes('abc').toFixed(options)
  // @expect-error Arg 0 for toFixed has an incorrect type for property 'length' of uint64. Expected numeric literal
  Bytes('abc').toFixed({ length: i })
  // @expect-error Invalid bytes constant length of 3, expected 1
  Bytes('abc').toFixed({ length: 1 })
}
