import type { biguint, bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Contract } from '@algorandfoundation/algorand-typescript'
import type { DynamicBytes, UintN64 } from '@algorandfoundation/algorand-typescript/arc4'
import { arc4EncodedLength, Struct } from '@algorandfoundation/algorand-typescript/arc4'

class TestStruct extends Struct<{ a: UintN64; b: DynamicBytes }> {}
type TestObj = { a: UintN64; b: DynamicBytes }
export class Arc4EncodeDecode extends Contract {
  testEncoding(a: uint64, b: boolean, c: biguint, d: bytes, e: string) {
    // @expect-error Target type must encode to a fixed size...
    arc4EncodedLength<TestObj>()
    // @expect-error Target type must encode to a fixed size...
    arc4EncodedLength<string>()
    // @expect-error Target type must encode to a fixed size...
    arc4EncodedLength<uint64[]>()
    // @expect-error Target type must encode to a fixed size...
    arc4EncodedLength<TestStruct>()
  }
}
