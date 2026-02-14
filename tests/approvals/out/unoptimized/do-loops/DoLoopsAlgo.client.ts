// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class DoLoopsAlgo extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  testDo(stop: arc4.Uint<64>): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  testDoBreak(
    stop: arc4.Uint<64>,
    breakMod: arc4.Uint<64>,
  ): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  testDoContinue(
    stop: arc4.Uint<64>,
    mod: arc4.Uint<64>,
  ): arc4.Uint<64> {
    err('stub only')
  }
}
