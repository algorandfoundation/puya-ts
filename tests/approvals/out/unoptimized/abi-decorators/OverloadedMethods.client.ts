// This file is auto-generated, do not modify
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class OverloadedMethods extends Contract {
  @abimethod
  doThing(x: arc4.Uint<64>): arc4.Uint<64> {
    err('stub only')
  }

  @abimethod({ name: 'doThing' })
  doThing2(
    x: arc4.Uint<64>,
    y: arc4.Uint<64>,
  ): arc4.Uint<64> {
    err('stub only')
  }
}
