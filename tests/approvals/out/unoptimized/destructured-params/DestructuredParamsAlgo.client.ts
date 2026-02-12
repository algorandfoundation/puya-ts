// This file is auto-generated, do not modify
import { Contract, abimethod, arc4, err } from '@algorandfoundation/algorand-typescript'

export class Object4B7314A9 extends arc4.Struct<{
  a: arc4.Uint<64>
  b: arc4.DynamicBytes
  c: arc4.Bool
}> {}

export class Arc4 extends arc4.Struct<{
  a: arc4.Uint<64>
  b: arc4.DynamicBytes
  c: arc4.Bool
}> {}

export abstract class DestructuredParamsAlgo extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test(p: Object4B7314A9): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  testMutable(p: Arc4): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  init(): void {
    err('stub only')
  }
}
