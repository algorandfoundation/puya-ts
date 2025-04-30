import type { bytes } from '@algorandfoundation/algorand-typescript'
import { Box } from '@algorandfoundation/algorand-typescript'
import type { DynamicArray, UintN8 } from '@algorandfoundation/algorand-typescript/arc4'

function test() {
  const b = Box<string>({ key: 'b' })
  // @expect-error string does not have a fixed byte size. Please specify a size argument.
  b.create()

  const b2 = Box<bytes>({ key: 'b2' })
  // @expect-error bytes does not have a fixed byte size. Please specify a size argument.
  b2.create()

  // @expect-error DynamicArray<UintN<8>> does not have a fixed byte size. Please specify a size argument.
  Box<DynamicArray<UintN8>>({ key: 'b3' }).create()
}
