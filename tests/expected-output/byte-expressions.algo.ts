import { Bytes } from '@algorandfoundation/algorand-typescript'

function testUnsupported() {
  // @expect-error Expression of type `number` must be explicitly converted to an algo-ts type...
  Bytes(1)
  // @expect-error Expression of type `bigint` must be explicitly converted to an algo-ts type...
  Bytes(1n)
}
