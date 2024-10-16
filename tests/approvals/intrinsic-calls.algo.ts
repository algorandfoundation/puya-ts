import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { op } from '@algorandfoundation/algorand-typescript'
import { itob, sha256 } from '@algorandfoundation/algorand-typescript/op'

function test(a: uint64, b: bytes) {
  const x = op.setBit(a, 8, 1)
  const y = op.setBit(b, 12, 9)

  const z = itob(x)
  const g = sha256(z)
}
