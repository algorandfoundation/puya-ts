// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4, type gtxn } from '@algorandfoundation/algorand-typescript'

export abstract class ItxnComposeAlgo extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  distribute(
    addresses: arc4.DynamicArray<arc4.Address>,
    funds: gtxn.PaymentTxn,
    verifier: arc4.Uint<64>,
  ): void {
    err('stub only')
  }

  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  conditionalBegin(count: arc4.Uint<64>): void {
    err('stub only')
  }
}
