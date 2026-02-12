// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4 } from '@algorandfoundation/algorand-typescript'

export abstract class ReceivesReferenceTypes extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  receivesReferenceTypes(
    app: arc4.Uint<64>,
    acc: arc4.Address,
    asset: arc4.Uint<64>,
  ): void {
    err('stub only')
  }
}
