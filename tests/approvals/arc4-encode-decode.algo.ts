import type { biguint, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, assertMatch, Contract } from '@algorandfoundation/algorand-typescript'
import type { StaticArray } from '@algorandfoundation/algorand-typescript/arc4'
import {
  arc4EncodedLength,
  Bool,
  decodeArc4,
  DynamicBytes,
  encodeArc4,
  Str,
  Struct,
  UintN,
  UintN64,
} from '@algorandfoundation/algorand-typescript/arc4'

class TestStruct extends Struct<{ a: UintN64; b: DynamicBytes }> {}
type TestObj = { a: UintN64; b: DynamicBytes }
export class Arc4EncodeDecode extends Contract {
  testEncoding(a: uint64, b: boolean, c: biguint, d: bytes, e: string) {
    assert(encodeArc4(a) === new UintN64(a).bytes)
    assert(encodeArc4(b) === new Bool(b).bytes)
    assert(encodeArc4(c) === new UintN<512>(c).bytes)
    assert(encodeArc4(d) === new DynamicBytes(d).bytes)
    assert(encodeArc4(e) === new Str(e).bytes)
    assert(encodeArc4({ a, b: d }) === new TestStruct({ a: new UintN64(a), b: new DynamicBytes(d) }).bytes)

    assert(arc4EncodedLength<uint64>() === 8)
    assert(arc4EncodedLength<boolean>() === 1)
    assert(arc4EncodedLength<UintN<512>>() === 64)
    assert(arc4EncodedLength<[uint64, uint64, boolean]>() === 17)
    assert(arc4EncodedLength<[uint64, uint64, boolean, boolean]>() === 17)
    assert(arc4EncodedLength<[StaticArray<Bool, 10>, boolean, boolean]>() === 3)
    assert(
      arc4EncodedLength<
        [[boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean, boolean], boolean, boolean]
      >() === 3,
    )
  }

  testDecoding(
    a: uint64,
    a_bytes: bytes,
    b: boolean,
    b_bytes: bytes,
    c: biguint,
    c_bytes: bytes,
    d: string,
    d_bytes: bytes,
    e: TestObj,
    e_bytes: bytes,
  ) {
    assert(decodeArc4<uint64>(a_bytes) === a)
    assert(decodeArc4<boolean>(b_bytes) === b)
    assert(decodeArc4<biguint>(c_bytes) === c)
    assert(decodeArc4<string>(d_bytes) === d)

    assertMatch(decodeArc4<TestObj>(e_bytes), e)
  }
}
