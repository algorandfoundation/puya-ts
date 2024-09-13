import type { bytes } from '@algorandfoundation/algo-ts'
import { Bytes } from '@algorandfoundation/algo-ts'

const a = Bytes('123')

function test(a: bytes) {
  if (a) {
    const a = Bytes('hmmm')
    return a
  }
}
