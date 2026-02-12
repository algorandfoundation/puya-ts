// This file is auto-generated, do not modify
import { Contract, abimethod, arc4, err, type gtxn } from '@algorandfoundation/algorand-typescript'

export class Counts extends arc4.Struct<{
  x: arc4.Uint<64>
  y: arc4.Uint<8>
}> {}

export abstract class LargeObjectsInStateAlgo extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  getMbr(): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  bootstrap(pay: gtxn.PaymentTxn): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  increaseXCount(
    index: arc4.Uint<64>,
    xCount: arc4.Uint<64>,
  ): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  getCounts(index: arc4.Uint<64>): Counts {
    err('stub only')
  }
}
