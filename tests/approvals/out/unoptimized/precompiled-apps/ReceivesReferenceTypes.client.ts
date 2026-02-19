// This file is auto-generated, do not modify
import type { arc4 } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class ReceivesReferenceTypes extends Contract {
  @abimethod
  receivesReferenceTypes(
    app: arc4.Uint<64>,
    acc: arc4.Address,
    asset: arc4.Uint<64>,
  ): void {
    err('stub only')
  }
}
