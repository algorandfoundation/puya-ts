import type { biguint, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, BaseContract, BigUint, Bytes, op } from '@algorandfoundation/algorand-typescript'
import { itob } from '@algorandfoundation/algorand-typescript/op'

function testConstructor(a: uint64, b: boolean, c: bytes) {
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
    testConstructor(1, false, itob(4))
    testOps(500n, 1000n)
    return true
  }
}
