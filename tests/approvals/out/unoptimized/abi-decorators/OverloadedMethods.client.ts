// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class OverloadedMethods extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  doThing(x: arc4.Uint<64>): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ name: 'doThing', allowActions: ['NoOp'], onCreate: 'require' })
  doThing2(
    x: arc4.Uint<64>,
    y: arc4.Uint<64>,
  ): arc4.Uint<64> {
    err('stub only')
  }
}
