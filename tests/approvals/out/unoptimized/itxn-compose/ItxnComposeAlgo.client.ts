// This file is auto-generated, do not modify
/* eslint-disable */
import type { arc4, gtxn } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class ItxnComposeAlgo extends Contract {
  @abimethod()
  distribute(
    addresses: arc4.DynamicArray<arc4.Address>,
    funds: gtxn.PaymentTxn,
    verifier: arc4.Uint<64>,
  ): void {
    err('stub only')
  }

  @abimethod()
  conditionalBegin(count: arc4.Uint<64>): void {
    err('stub only')
  }
}
