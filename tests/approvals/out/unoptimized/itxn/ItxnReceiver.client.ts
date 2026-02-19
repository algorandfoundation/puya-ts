// This file is auto-generated, do not modify
import type { arc4, gtxn } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class ItxnReceiver extends Contract {
  @abimethod
  receivePay(
    a: arc4.Uint<64>,
    b: gtxn.PaymentTxn,
    c: arc4.Str,
  ): arc4.Tuple<readonly [arc4.Uint<64>, arc4.Uint<64>, arc4.Str]> {
    err('stub only')
  }
}
