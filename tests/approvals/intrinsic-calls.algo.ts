import type { bytes, uint64 } from '@algorandfoundation/algo-ts'
import { op } from '@algorandfoundation/algo-ts'

function test(a: uint64, b: bytes) {
  const x = op.setbit(a, 8, 1)
  const y = op.setbit(b, 12, 9)
}
