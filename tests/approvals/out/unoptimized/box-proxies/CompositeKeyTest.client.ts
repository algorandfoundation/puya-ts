// This file is auto-generated, do not modify
import { Contract, abimethod, arc4, err } from '@algorandfoundation/algorand-typescript'

export class ObjectACED9E72 extends arc4.Struct<{
  a: arc4.Uint<64>
  b: arc4.Uint<64>
}> {}

export abstract class CompositeKeyTest extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test(
    key: ObjectACED9E72,
    val: arc4.Str,
  ): void {
    err('stub only')
  }
}
