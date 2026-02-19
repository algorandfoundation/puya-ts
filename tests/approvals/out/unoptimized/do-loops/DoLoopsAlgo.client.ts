// This file is auto-generated, do not modify
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class DoLoopsAlgo extends Contract {
  @abimethod
  testDo(stop: arc4.Uint<64>): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod
  testDoBreak(
    stop: arc4.Uint<64>,
    breakMod: arc4.Uint<64>,
  ): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod
  testDoContinue(
    stop: arc4.Uint<64>,
    mod: arc4.Uint<64>,
  ): arc4.Uint<64> {
    err('stub only')
  }
}
