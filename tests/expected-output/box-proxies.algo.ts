import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Box } from '@algorandfoundation/algorand-typescript'

function test() {
  const b = Box<string>({ key: 'b' })
  // @expect-warning string does not have a minimum byte size. Box will be created with length of 0
  b.create()

  const b2 = Box<bytes>({ key: 'b2' })
  // @expect-warning bytes does not have a minimum byte size. Box will be created with length of 0
  b2.create()

  // @expect-error Objects of type {a:uint64,b:uint64} cannot be stored in a box
  const bObj = Box<{ a: uint64; b: uint64 }>({ key: 'bObj' })
}
