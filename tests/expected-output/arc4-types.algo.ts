import type { biguint, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { arc4, assert, BaseContract, Bytes, Txn } from '@algorandfoundation/algorand-typescript'
import type { Bool } from '@algorandfoundation/algorand-typescript/arc4'
import {
  Address,
  Byte,
  DynamicArray,
  DynamicBytes,
  StaticArray,
  StaticBytes,
  Str,
  Tuple,
  UFixedNxM,
  UintN,
  type UintN8,
} from '@algorandfoundation/algorand-typescript/arc4'

function testUFixed() {
  const a = new UFixedNxM<32, 4>('1.244')
  const c = new UFixedNxM<32, 4>('1.244')

  assert(a === c)
}

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

  assert(c.bytes.length === 256 / 8)
}

function testStr() {
  const s1 = new Str()
  assert(s1.bytes === new UintN<16>(0).bytes, 'Empty string should equal the uint16 length prefix')
  const s2 = new Str('Hello')
  assert(s2.native === 'Hello')
}

function testDynamicBytes(someBytes: bytes) {
  const db1 = new DynamicBytes()
  const db2 = new DynamicBytes(someBytes)
  const db3 = new DynamicBytes('hello')
}

function testStaticBytes() {
  // @expect-error StaticBytes length must be greater than or equal to 0
  const s1 = new StaticBytes<-1>()
  // @expect-error Value should have byte length of 4
  const s2 = new StaticBytes<4>('')
  // @expect-error Length generic type param for StaticBytes must be a literal number. Inferred type is uint64
  const s3 = new StaticBytes(Bytes('abc'))
}

type ARC4Uint64 = UintN<64>
const ARC4Uint64 = UintN<64>

function testArrays(n: ARC4Uint64) {
  const myArray = new DynamicArray(n, n, n)

  myArray.push(n)

  const myStatic = new StaticArray(n, n)

  assert(myStatic[0] === myArray.pop())

  myStatic[1] = new UintN<64>(50)

  // const myStatic2 = new StaticArray<ARC4Uint64, 3>(n, n, n)
}

function testByte() {
  const b = new Byte()
  const b2 = new Byte(0)
  assert(b === b2)
}

function testAddress() {
  const a = new Address()
  const b = new Address(Txn.sender)

  assert(a !== b, 'Zero address should not match sender')
  assert(a === new Address(), 'Two zero addresses should match')
  assert(a[0] === new Byte(), 'Zero address should start with zero byte')
}

function testTuple() {
  const t = new Tuple(new ARC4Uint64(34))
  const firstItem = t.at(0)
  const firstItemIndexer = t.native[0]
  assert(firstItem === firstItemIndexer)
  const t1 = new Tuple(new Address(), new Byte())
  assert(t1.length === 2)
}

export class Arc4TypesTestContract extends BaseContract {
  public getArc4Values(): [Byte, UintN<8>, Address] {
    return [new Byte(), new UintN(255), new Address()]
  }

  public approvalProgram(): boolean {
    const x = new ARC4Uint64()
    testStr()
    test(1, 2n, new UintN<256>(4))
    testByte()
    testArrays(new UintN<64>(65))
    testAddress()
    testTuple()
    testUFixed()
    testDynamicBytes(Bytes('hmmmmmmmmm'))
    testStaticBytes()
    const result = new arc4.DynamicArray<arc4.UintN<64>>()
    assert(result.length === 0)
    return true
  }
}

function testNoArg() {
  // @expect-error Zero arg constructor can only be used for static arrays with a fixed size encoding.
  const a = new StaticArray<Str, 4>()
  // @expect-error Zero arg constructor can only be used for tuples with a fixed size encoding.
  const b = new Tuple<[UintN8, Bool, Bool, Str]>()
}
