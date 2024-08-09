import { UintN } from '@algorandfoundation/algo-ts/arc4'
import type { biguint, uint64 } from '@algorandfoundation/algo-ts'

function test(n: uint64, b: biguint, c: UintN<256>) {
  const x = new UintN<8>(4)
  const x2 = new UintN<8>(255n)
  const y = new UintN<16>()
  const z = new UintN<8>(n)
  const a = new UintN(b)
}
