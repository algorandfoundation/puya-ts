import type { bytes } from '@algorandfoundation/algorand-typescript'
import { Bytes } from '@algorandfoundation/algorand-typescript'

const a = Bytes('123')

function test(a: bytes) {
  if (a) {
    const a = Bytes('hmmm')
    return a
  }
}
