import type { biguint, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { assert, assertMatch, Bytes, Contract, ensureBudget, log, MutableObject } from '@algorandfoundation/algorand-typescript'
import type { Address } from '@algorandfoundation/algorand-typescript/arc4'
import {
  arc4EncodedLength,
  Bool,
  decodeArc4,
  DynamicArray,
  DynamicBytes,
  encodeArc4,
  StaticArray,
  StaticBytes,
  Str,
  Struct,
  UintN,
  UintN64,
} from '@algorandfoundation/algorand-typescript/arc4'
import { itob } from '@algorandfoundation/algorand-typescript/op'

class TestStruct extends Struct<{ a: UintN64; b: DynamicBytes }> {}
class DynamicMutableObject extends MutableObject<{ a: uint64; b: DynamicBytes }> {}
class StaticMutableObject extends MutableObject<{ a: uint64; b: StaticBytes<12> }> {}
type TestObj = { a: UintN64; b: DynamicBytes }
export class Arc4EncodeDecode extends Contract {
  testEncoding(a: uint64, b: boolean, c: biguint, d: bytes, e: string, f: Address, g: bytes<12>) {
    ensureBudget(1400)
    assert(encodeArc4(a) === new UintN64(a).bytes)
    assert(encodeArc4(b) === new Bool(b).bytes)
    assert(encodeArc4(c) === new UintN<512>(c).bytes)
    assert(encodeArc4(d) === new DynamicBytes(d).bytes)
    assert(encodeArc4(e) === new Str(e).bytes)
    assert(encodeArc4({ a, b: d }) === new TestStruct({ a: new UintN64(a), b: new DynamicBytes(d) }).bytes)
    assert(encodeArc4({ a, b: d }) === encodeArc4(new DynamicMutableObject({ a, b: new DynamicBytes(d) })))
    assert(encodeArc4({ a, b: g }) === encodeArc4(new StaticMutableObject({ a, b: new StaticBytes<12>(g) })))
    assert(encodeArc4(f) === f.bytes)
    assert(encodeArc4(g) === new StaticBytes(g).bytes)

    assert(encodeArc4([a]) === new StaticArray(new UintN64(a)).bytes)
    assert(encodeArc4([b]) === new StaticArray(new Bool(b)).bytes)
    assert(encodeArc4([c]) === new StaticArray(new UintN<512>(c)).bytes)
    assert(encodeArc4([d]) === new StaticArray(new DynamicBytes(d)).bytes)
    assert(encodeArc4([e]) === new StaticArray(new Str(e)).bytes)
    assert(encodeArc4([f]) === new StaticArray(f).bytes)
    assert(encodeArc4([g]) === new StaticArray(new StaticBytes(g)).bytes)

    assert(encodeArc4<uint64[]>([a]) === new DynamicArray(new UintN64(a)).bytes)
    assert(encodeArc4<boolean[]>([b]) === new DynamicArray(new Bool(b)).bytes)
    assert(encodeArc4<biguint[]>([c]) === new DynamicArray(new UintN<512>(c)).bytes)
    assert(encodeArc4<bytes[]>([d]) === new DynamicArray(new DynamicBytes(d)).bytes)
    assert(encodeArc4<string[]>([e]) === new DynamicArray(new Str(e)).bytes)
    assert(encodeArc4<Address[]>([f]) === new DynamicArray(f).bytes)
    assert(encodeArc4<bytes<12>[]>([g]) === new DynamicArray(new StaticBytes(g)).bytes)

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
    assert(arc4EncodedLength<typeof g>() === 12)
    assert(arc4EncodedLength<StaticMutableObject>() === 20)
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
    f: Address,
    f_bytes: bytes,
    g: bytes<12>,
    g_bytes: bytes,
  ) {
    assert(decodeArc4<uint64>(a_bytes) === a)
    assert(decodeArc4<boolean>(b_bytes) === b)
    assert(decodeArc4<biguint>(c_bytes) === c)
    assert(decodeArc4<string>(d_bytes) === d)
    assertMatch(decodeArc4<TestObj>(e_bytes), e)

    const lenPrefix = itob(1).slice(6, 8)
    const offsetHeader = itob(2).slice(6, 8)
    assertMatch(decodeArc4<uint64[]>(lenPrefix.concat(a_bytes)), [a], 'Array of uint64 matches')
    assertMatch(decodeArc4<boolean[]>(lenPrefix.concat(b_bytes)), [b], 'Array of boolean matches')
    log(lenPrefix.concat(c_bytes))
    assertMatch(decodeArc4<biguint[]>(lenPrefix.concat(c_bytes)), [c], 'Array of biguint matches')
    assertMatch(decodeArc4<string[]>(Bytes`${lenPrefix}${offsetHeader}${d_bytes}`), [d], 'Array of string matches')

    assertMatch(decodeArc4<TestObj[]>(Bytes`${lenPrefix}${offsetHeader}${e_bytes}`), [e], 'Array of struct matches')
    assertMatch(decodeArc4<Address[]>(Bytes`${lenPrefix}${f_bytes}`), [f], 'Array of address matches')

    assert(decodeArc4<bytes<12>>(g_bytes) === g)
  }
}
