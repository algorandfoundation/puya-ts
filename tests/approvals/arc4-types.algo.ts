import type { biguint, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, BaseContract, Bytes, Txn } from '@algorandfoundation/algorand-typescript'
import { Address, Byte, DynamicArray, StaticArray, UintN } from '@algorandfoundation/algorand-typescript/arc4'

function test(n: uint64, b: biguint, c: UintN<256>) {
  const x = new UintN<8>(4)
  assert(x.bytes.length === 1)
  const x2 = new UintN<8>(255n)
  assert(x2.bytes === Bytes.fromHex('ff'))

  const y = new UintN<16>()
  assert(y.bytes.length === 2)
  const z = new UintN<8>(n)
  const z_native = z.native
  assert(z_native === n)
  const a = new UintN<128>(b)
  const a_native = a.native
  assert(a_native === b)
}

type ARC4Uint64 = UintN<64>

function testArrays(n: ARC4Uint64) {
  const myArray = new DynamicArray(n, n, n)

  myArray.push(n)

  const myStatic = new StaticArray(n, n)

  assert(myStatic[0].equals(myArray.pop()))

  myStatic[1] = new UintN<64>(50)

  // const myStatic2 = new StaticArray<ARC4Uint64, 3>(n, n, n)
}

function testByte() {
  const b = new Byte()
  const b2 = new Byte(0)
  assert(b.equals(b2))
}

function testAddress() {
  const a = new Address()
  const b = new Address(Txn.sender)

  assert(!a.equals(b), 'Zero address should not match sender')
  assert(a.equals(new Address()), 'Two zero addresses should match')
  assert(a[0].equals(new Byte()), 'Zero address should start with zero byte')
}

export class Arc4TypesTestContract extends BaseContract {
  public getArc4Values(): [Byte, UintN<8>, Address] {
    return [new Byte(), new UintN(255), new Address()]
  }

  public approvalProgram(): boolean {
    test(1, 2n, new UintN<256>(4))
    testByte()
    testArrays(new UintN<64>(65))
    testAddress()

    return true
  }
}
