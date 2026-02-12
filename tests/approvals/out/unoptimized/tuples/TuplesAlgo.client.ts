// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class TuplesAlgo extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  test(
    a: arc4.Uint<64>,
    b: arc4.Uint<64>,
    c: arc4.Uint<64>,
  ): void {
    err('stub only')
  }
}
