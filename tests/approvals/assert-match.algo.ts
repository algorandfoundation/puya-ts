import type { gtxn } from '@algorandfoundation/algo-ts'
import { assertMatch, Global, Txn } from '@algorandfoundation/algo-ts'

function test(x: gtxn.PayTxn) {
  assertMatch(x, {
    amount: { between: [0, 50000] },
    sender: Txn.sender,
    receiver: Global.currentApplicationAddress,
    closeRemainderTo: Global.zeroAddress,
    firstValid: { greaterThan: 1 },
    lastValid: { lessThan: 2 ** 40 },
  })
}
