// This file is auto-generated, do not modify
import { Contract, abimethod, arc4, err } from '@algorandfoundation/algorand-typescript'

export class TestObj extends arc4.Struct<{
  a: arc4.Uint<64>
  b: arc4.DynamicBytes
}> {}

export abstract class Arc4EncodeDecode extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  testEncoding(
    a: arc4.Uint<64>,
    b: arc4.Bool,
    c: arc4.Uint<512>,
    d: arc4.DynamicBytes,
    e: arc4.Str,
    f: arc4.Address,
    g: arc4.StaticArray<arc4.Byte, 12>,
  ): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  testDecoding(
    a: arc4.Uint<64>,
    a_bytes: arc4.DynamicBytes,
    b: arc4.Bool,
    b_bytes: arc4.DynamicBytes,
    c: arc4.Uint<512>,
    c_bytes: arc4.DynamicBytes,
    d: arc4.Str,
    d_bytes: arc4.DynamicBytes,
    e: TestObj,
    e_bytes: arc4.DynamicBytes,
    f: arc4.Address,
    f_bytes: arc4.DynamicBytes,
    g: arc4.StaticArray<arc4.Byte, 12>,
    g_bytes: arc4.DynamicBytes,
  ): void {
    err('stub only')
  }
}
