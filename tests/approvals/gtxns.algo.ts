import { assert, Contract, Global, gtxn, log, TransactionType, urange } from '@algorandfoundation/algorand-typescript'

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
}
