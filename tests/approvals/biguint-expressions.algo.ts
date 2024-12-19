import type { biguint, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, BaseContract, BigUint, Bytes, op } from '@algorandfoundation/algorand-typescript'
import { itob } from '@algorandfoundation/algorand-typescript/op'

function testConstructor(a: uint64, a_b: biguint, b: boolean, b_b: biguint, c: bytes, c_b: biguint) {
  assert(BigUint() === 0n)
  assert(BigUint(true) === 1n)
  assert(BigUint(false) === 0n)
  assert(BigUint(0) === 0n)
  assert(BigUint(1) === 1n)
  assert(BigUint(0n) === 0n)
  assert(BigUint(1n) === 1n)
  assert(BigUint(2n ** 512n - 1n) === 2n ** 512n - 1n)
  assert(BigUint('1231232134123123') === 1231232134123123n)
  assert(BigUint(a) === a_b)
  assert(BigUint(a * a) === a_b * a_b)
  assert(BigUint(b) === b_b)
  assert(BigUint(c) === c_b)
}

function testOps(smaller: biguint, larger: biguint) {
  assert(smaller < larger)
  assert(smaller <= smaller)
  assert(larger > smaller)
  assert(larger >= larger)
  assert(smaller === BigUint(smaller))
  assert(smaller === BigUint(op.bzero(4).concat(Bytes(smaller))), 'Leading zeros should be ignored in equality')
}

class DemoContract extends BaseContract {
  public approvalProgram() {
    testConstructor(12312312, 12312312n, false, 0n, itob(4), 4n)
    testOps(500n, 1000n)
    return true
  }
}
