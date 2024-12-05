import type { biguint, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, BaseContract, BigUint, Bytes, op, Uint64 } from '@algorandfoundation/algorand-typescript'

function test(a: uint64, b: biguint, c: string) {
  assert(Bytes().length === 0, 'Empty bytes has length of 0')
  assert(Bytes(a) === op.itob(a), 'Bytes(uint64) is equivalent to itob')
  assert(Bytes(Uint64(1)) === Bytes.fromHex('0000000000000001'), 'Bytes(uint64) returns an 8 byte encoding')
  assert(Bytes(BigUint(256)) === Bytes.fromHex('0100'))
  assert(BigUint(Bytes(b)) === b, 'Round trip of biguint to bytes and back results in the same value')
  assert(String(Bytes(c)) === c)
  assert(Bytes(Bytes('123')) === Bytes('123'))
  assert(Bytes([1, 2, 3, 4]) === Bytes.fromHex('01020304'))
}

class DemoContract extends BaseContract {
  public approvalProgram() {
    test(1, 50n, 'things')
    return true
  }
}
