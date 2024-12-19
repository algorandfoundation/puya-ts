import type { gtxn } from '@algorandfoundation/algorand-typescript'
import { assertMatch, Contract, Global, Txn } from '@algorandfoundation/algorand-typescript'

export class AssertMatchContract extends Contract {
  public testPay(pay: gtxn.PaymentTxn): boolean {
    assertMatch(pay, {
      amount: { between: [100_000, 105_000] },
      sender: Txn.sender,
      receiver: Global.currentApplicationAddress,
      closeRemainderTo: Global.zeroAddress,
      firstValid: { greaterThan: 1 },
      lastValid: { lessThan: 2 ** 40 },
    })
    return true
  }
}
