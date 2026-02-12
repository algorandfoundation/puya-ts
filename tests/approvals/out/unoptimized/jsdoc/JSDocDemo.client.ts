// This file is auto-generated, do not modify
import { Contract, abimethod, arc4, err } from '@algorandfoundation/algorand-typescript'

export class DemoStruct extends arc4.Struct<{
  a: arc4.Uint<64>
}> {}

export class DemoType extends arc4.Struct<{
  a: arc4.DynamicBytes
}> {}

/**
 * This is the description for the contract
 */
export abstract class JSDocDemo extends Contract {
  /**
   * This is the description of the method
   */
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test(
    a: arc4.Uint<64>,
    b: arc4.DynamicBytes,
  ): DemoStruct {
    err('stub only')
  }

  /**
   * This is the description of the method
   */
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test2(a: arc4.DynamicBytes): DemoType {
    err('stub only')
  }
}
