import type { biguint, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { arc4, assert, assertMatch, BaseContract, BigUint, Bytes, ensureBudget, Txn } from '@algorandfoundation/algorand-typescript'
import {
  Address,
  Bool,
  Byte,
  DynamicArray,
  DynamicBytes,
  encodeArc4,
  interpretAsArc4,
  StaticArray,
  StaticBytes,
  Str,
  Tuple,
  UFixedNxM,
  UintN,
  UintN128,
  UintN32,
  UintN64,
  UintN8,
} from '@algorandfoundation/algorand-typescript/arc4'
import { bzero } from '@algorandfoundation/algorand-typescript/op'

function testUFixed() {
  const a = new UFixedNxM<32, 4>('1.244')
  const c = new UFixedNxM<32, 4>('1.244')

  assert(a === c)
}

function testUintN(n: uint64, b: biguint, c: UintN<256>) {
  const x = new UintN<8>(4)
  assert(x.bytes.length === 1)
  const x2 = new UintN<8>(255n)
  assert(x2.bytes === Bytes.fromHex('ff'))

  const y = new UintN<16>()
  assert(y.bytes.length === 2)
  const z = new UintN<8>(n)
  const z_native = z.native
  assert(z_native === n)
  const big128 = new UintN128(2n ** 100n)

  const a = new UintN<128>(b)
  const a_native = a.native
  assert(a_native === b)

  assert(c.bytes.length === 256 / 8)

  const a_bytes = a.bytes
  const a_from_bytes = interpretAsArc4<UintN<128>>(a_bytes)

  assert(a_from_bytes === a)

  const aliased64 = new UintN64(12)

  assert(aliased64.native === 12)
  const aliased32 = new UintN32(50545)
  assert(BigUint(aliased32.bytes) === 50545n)

  const byte = new Byte(255)

  assert(byte.bytes.bitwiseInvert() === Bytes.fromHex('00'))
}

function testStr() {
  const s1 = new Str()
  assert(s1.bytes === new UintN<16>(0).bytes, 'Empty string should equal the uint16 length prefix')
  const s2 = new Str('Hello')
  assert(s2.native === 'Hello')

  const s2_bytes = s2.bytes

  const s2_from_bytes = interpretAsArc4<Str>(s2_bytes)

  assert(s2 === s2_from_bytes)
}

function testDynamicBytes(someBytes: bytes) {
  const db1 = new DynamicBytes()
  assert(db1.native === Bytes(), 'No args should give empty bytes')
  assert(db1.bytes === new UintN<16>(0).bytes, 'bytes prop should return length header (of 0)')
  const db2 = new DynamicBytes(someBytes)
  assert(db2.native === someBytes)

  const db3 = new DynamicBytes('hello')
  assert(db3.native === Bytes('hello'))

  const db4 = db3.concat(new DynamicBytes(' world'))
  assert(db4.native === Bytes('hello world'))
}

function testStaticBytes() {
  const s1 = new StaticBytes()
  const s2 = new StaticBytes<4>()
  const s3 = new StaticBytes<5>(Bytes.fromHex('AABBCCDDEE'))

  const s5 = new StaticArray<StaticBytes<5>, 1>(new StaticBytes<5>(Bytes.fromHex('AABBCCDDEE')))
  assert(s5[0].native === Bytes.fromHex('AABBCCDDEE'))

  const s4 = s2.concat(s3)
  assert(s4.native === Bytes.fromHex('00000000AABBCCDDEE'))
}

type ARC4Uint64 = UintN<64>
const ARC4Uint64 = UintN<64>

function testArrays(n: ARC4Uint64) {
  const myArray = new DynamicArray(n, n, n)

  myArray.push(n)

  const doubleArray = myArray.concat(myArray)

  assert(doubleArray === new DynamicArray(n, n, n, n, n, n, n, n))

  const myStatic = new StaticArray(n, n)

  assert(myStatic[0] === myArray.pop())

  myStatic[1] = new UintN<64>(50)

  const myStatic2 = new StaticArray<ARC4Uint64, 3>(n, n, n)

  const staticNative = myStatic2.native
  assertMatch(staticNative, [n, n, n])

  const dynamicNative = doubleArray.native
  assertMatch(dynamicNative, [n, n, n, n, n, n, n, n])
}

function testByte() {
  const b = new Byte()
  const b2 = new Byte(0)
  assert(b === b2)
}

function testAddress() {
  const a = new Address()
  const b = new Address(Txn.sender)

  assert(b.native === Txn.sender)

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
    ensureBudget(1400)
    const x = new ARC4Uint64()
    testStr()
    testUintN(1, 2n, new UintN<256>(4))
    testUFixed()
    testByte()
    testArrays(new UintN<64>(65))
    testAddress()
    testTuple()
    testUFixed()
    testDynamicBytes(Bytes('hmmmmmmmmm'))
    testStaticBytes()
    testZeroValues()
    const result = new arc4.DynamicArray<arc4.UintN<64>>()
    assert(result.length === 0)
    return true
  }
}

function testZeroValues() {
  assert(new StaticArray<UintN8, 4>().bytes === new StaticArray(new UintN8(0), new UintN8(0), new UintN8(0), new UintN8(0)).bytes)
  assert(new StaticArray<Bool, 4>().bytes === new StaticArray(new Bool(false), new Bool(false), new Bool(false), new Bool(false)).bytes)
  assert(
    new StaticArray<Bool, 9>().bytes ===
      new StaticArray(
        new Bool(false),
        new Bool(false),
        new Bool(false),
        new Bool(false),
        new Bool(false),
        new Bool(false),
        new Bool(false),
        new Bool(false),
        new Bool(false),
      ).bytes,
  )
  assert(new DynamicArray<UintN8>().bytes === bzero(2))
  assert(
    new Tuple<[Bool, Bool, Bool, Bool, Bool, Bool, Bool, Bool, Bool]>().bytes ===
      encodeArc4([false, false, false, false, false, false, false, false, false]),
  )
  assert(new Str().bytes === bzero(2))
  assert(new DynamicBytes().bytes === bzero(2))
  assert(new StaticBytes<5>().bytes === bzero(5))
  assert(new Address().bytes === bzero(32))
  assert(new UFixedNxM<32, 4>().bytes === bzero(32 / 8))
  assert(new Bool().bytes === bzero(1))
  assert(new UintN32().bytes === bzero(32 / 8))
}
