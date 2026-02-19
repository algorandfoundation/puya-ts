// This file is auto-generated, do not modify
import type { arc4, gtxn } from '@algorandfoundation/algorand-typescript'
import { Contract, abimethod, err } from '@algorandfoundation/algorand-typescript'

export abstract class AssertMatchContract extends Contract {
  @abimethod
  testPay(pay: gtxn.PaymentTxn): arc4.Bool {
    err('stub only')
  }
}
