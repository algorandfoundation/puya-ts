import { gtxn, internal } from '@algorandfoundation/algo-ts'
import { lazyContext } from '../context-helpers/internal-context'
import {
  ApplicationTransaction,
  ApplicationTransactionFields,
  AssetConfigTransaction,
  AssetFreezeTransaction,
  AssetTransferTransaction,
  KeyRegistrationTransaction,
  PaymentTransaction,
  TxnFields,
} from '../impl/transactions'
import { asBigInt } from '../util'

export class TxnValueGenerator {
  applicationCall(fields?: ApplicationTransactionFields): gtxn.ApplicationTxn {
    const params = fields ?? {}
    if (params.appId && !lazyContext.ledger.applicationDataMap.has(asBigInt(params.appId.id))) {
      internal.errors.internalError(`Application ID ${params.appId.id} not found in test context`)
    }
    if (!params.appId) {
      params.appId = lazyContext.any.application()
    }

    return ApplicationTransaction(params)
  }

  payment(fields?: TxnFields<gtxn.PaymentTxn>): gtxn.PaymentTxn {
    return PaymentTransaction(fields ?? {})
  }

  keyRegistration(fields?: TxnFields<gtxn.KeyRegistrationTxn>): gtxn.KeyRegistrationTxn {
    return KeyRegistrationTransaction(fields ?? {})
  }

  assetConfig(fields?: TxnFields<gtxn.AssetConfigTxn>): gtxn.AssetConfigTxn {
    return AssetConfigTransaction(fields ?? {})
  }

  assetTransfer(fields?: TxnFields<gtxn.AssetTransferTxn>): gtxn.AssetTransferTxn {
    return AssetTransferTransaction(fields ?? {})
  }

  assetFreeze(fields?: TxnFields<gtxn.AssetFreezeTxn>): gtxn.AssetFreezeTxn {
    return AssetFreezeTransaction(fields ?? {})
  }
}
