import {
  assert,
  Contract,
  Global,
  gtxn,
  log,
  OnCompleteAction,
  TransactionType,
  Txn,
  urange,
} from '@algorandfoundation/algorand-typescript'

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
  }

  test4(other: gtxn.ApplicationTxn) {
    assert(other.onCompletion === OnCompleteAction.NoOp, 'Other txn must be NoOp')
    assert(other.type === TransactionType.ApplicationCall)
  }
}
