// This file is auto-generated, do not modify
import { Contract, abimethod, err, type arc4, type gtxn } from '@algorandfoundation/algorand-typescript'

export abstract class AssertMatchContract extends Contract {
  @abimethod({ allowActions: ['NoOp'], onCreate: 'require' })
  testPay(pay: gtxn.PaymentTxn): arc4.Bool {
    err('stub only')
  }
}
