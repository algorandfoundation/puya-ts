import { assertMatch, BaseContract, Global, gtxn, Txn } from '@algorandfoundation/algorand-typescript'

function test(x: gtxn.PaymentTxn) {
  assertMatch(x, {
    amount: { between: [0, 50000] },
    sender: Txn.sender,
    receiver: Global.currentApplicationAddress,
    closeRemainderTo: Global.zeroAddress,
    firstValid: { greaterThan: 1 },
    lastValid: { lessThan: 2 ** 40 },
  })
}

export class AssertMatchContract extends BaseContract {
  public approvalProgram(): boolean {
    const txn = gtxn.PaymentTxn(1)
    test(txn)
    return true
  }
}
