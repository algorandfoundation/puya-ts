import {
  assert,
  Bytes,
  Contract,
  Global,
  gtxn,
  log,
  OnCompleteAction,
  TransactionType,
  Txn,
  urange,
} from '@algorandfoundation/algorand-typescript'
import { methodSelector } from '@algorandfoundation/algorand-typescript/arc4'

export class GtxnsAlgo extends Contract {
  test() {
    assert(gtxn.PaymentTxn(0).amount > 0)
  }

  test2() {
    for (const i of urange(Global.groupSize)) {
      const txn = gtxn.Transaction(i)
      switch (txn.type) {
        case TransactionType.ApplicationCall:
          log(txn.appId.id)
          break
        case TransactionType.AssetTransfer:
          log(txn.xferAsset.id)
          break
        case TransactionType.AssetConfig:
          log(txn.configAsset.id)
          break
        case TransactionType.Payment:
          log(txn.receiver)
          break
        case TransactionType.KeyRegistration:
          log(txn.voteKey)
          break
        default:
          log(txn.freezeAsset.id)
          break
      }
    }
  }

  test3() {
    assert(Txn.onCompletion === OnCompleteAction.NoOp, 'OCA must be NoOp')
    assert(Txn.typeEnum === TransactionType.ApplicationCall)
    log('Hello test4')
  }

  test4(other: gtxn.ApplicationCallTxn) {
    assert(other.onCompletion === OnCompleteAction.NoOp, 'Other txn must be NoOp')
    assert(other.type === TransactionType.ApplicationCall)
    assert(other.lastLog === Bytes('Hello test4'))
    assert(other.appArgs(0) === methodSelector(GtxnsAlgo.prototype.test3))
    assert(other.appId === Global.currentApplicationId)
  }

  reflectAllPay(pay: gtxn.PaymentTxn) {
    return {
      sender: pay.sender.bytes,
      fee: pay.fee,
      firstValid: pay.firstValid,
      firstValidTime: pay.firstValidTime,
      lastValid: pay.lastValid,
      note: pay.note,
      lease: pay.lease,
      typeBytes: pay.typeBytes,
      groupIndex: pay.groupIndex,
      txnId: pay.txnId,
      rekeyTo: pay.rekeyTo.bytes,
      receiver: pay.receiver.bytes,
      amount: pay.amount,
      closeRemainderTo: pay.closeRemainderTo.bytes,
    }
  }
}
