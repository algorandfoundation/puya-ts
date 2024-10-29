import type { biguint, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, BaseContract, Txn } from '@algorandfoundation/algorand-typescript'
import { Address, Byte, DynamicArray, StaticArray, UintN } from '@algorandfoundation/algorand-typescript/arc4'

function test(n: uint64, b: biguint, c: UintN<256>) {
  const x = new UintN<8>(4)
  const x2 = new UintN<8>(255n)
  const y = new UintN<16>()
  const z = new UintN<8>(n)
  const z_native = z.native
  const a = new UintN<128>(b)
  const a_native = a.native
}

type ARC4Uint64 = UintN<64>

function testArrays(n: ARC4Uint64) {
  const myArray = new DynamicArray(n, n, n)

  const myStatic = new StaticArray(n, n)

  const myStatic2 = new StaticArray<ARC4Uint64, 3>(n, n, n)
}

function test_bytes() {
  const b = new Byte()
  const b2 = new Byte(0)
  assert(b.equals(b2))
}

function testAddress() {
  const a = new Address()
  const b = new Address(Txn.sender)

  assert(!a.equals(b), 'Zero address should not match sender')
  assert(a.equals(new Address()), 'Two zero addresses should match')
}

export class Arc4TypesTestContract extends BaseContract {
  public getArc4Values(): [Byte, UintN<8>, Address] {
    return [new Byte(), new UintN(255), new Address()]
  }

  public approvalProgram(): boolean {
    test(1, 2n, new UintN<256>(4))
    testArrays(new UintN<64>(65))
    testAddress()

    return true
  }
}
