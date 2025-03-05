import { assert, Contract, gtxn } from '@algorandfoundation/algorand-typescript'

export class GtxnsAlgo extends Contract {
  test() {
    assert(gtxn.PaymentTxn(0).amount > 0)
  }
}
