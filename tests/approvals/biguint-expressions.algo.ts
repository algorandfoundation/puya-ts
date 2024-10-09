import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { BigUint } from '@algorandfoundation/algorand-typescript'

function test(a: uint64, b: boolean, c: bytes) {
  BigUint()
  BigUint(true)
  BigUint(false)
  BigUint(0)
  BigUint(1)
  BigUint(0n)
  BigUint(1n)
  BigUint(2n ** 512n - 1n)
  BigUint('1231232134123123')
  BigUint(a)
  BigUint(a * a)
  BigUint(b)
  BigUint(c)
}
