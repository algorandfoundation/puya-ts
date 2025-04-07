import type { biguint, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, BigUint, Bytes, Contract, op, Uint64 } from '@algorandfoundation/algorand-typescript'
import { btoi, itob } from '@algorandfoundation/algorand-typescript/op'

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

function test2(a: bytes<8>, b: bytes<8>) {
  assert(btoi(a) === 5, 'a must be bytes for 5')
  assert(btoi(b) === 12, 'b must be bytes for 12')

  assert(btoi(a.bitwiseAnd(b)) === 4, 'a & b is 4')
  assert(btoi(a.bitwiseOr(b)) === 13, 'a | b is 13')
  assert(btoi(a.bitwiseXor(b)) === 9, 'a ^ b is 9')

  assert(btoi(a.bitwiseInvert()) === Uint64.MAX_VALUE - 5, '!a is MAX_VALUE - 5')
  assert(btoi(b.bitwiseInvert()) === Uint64.MAX_VALUE - 12, '!b is MAX_VALUE - 12')

  assert(a.slice(0, 4) === b.slice(0, 4), 'first four bytes should match')

  assert(a.concat(b) === Bytes.fromHex('0000000000000005000000000000000C'))
}

class DemoContract extends Contract {
  public test() {
    test(1, 50n, 'things')
    test2(itob(5), itob(12))
    return true
  }
}
