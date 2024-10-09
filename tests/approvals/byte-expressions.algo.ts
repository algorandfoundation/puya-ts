import type { biguint, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, BigUint, Bytes, op, Uint64 } from '@algorandfoundation/algorand-typescript'

function test(a: uint64, b: biguint, c: string) {
  assert(Bytes().length === 0)
  assert(Bytes(a) === op.itob(a))
  assert(Bytes(Uint64(1)) === Bytes.fromHex('0000000000000001'))
  assert(Bytes(BigUint(256)) === Bytes.fromHex('0100'))
  assert(BigUint(Bytes(b)) === b)
  assert(String(Bytes(c)) === c)
  assert(Bytes(Bytes('123')) === Bytes('123'))
}
