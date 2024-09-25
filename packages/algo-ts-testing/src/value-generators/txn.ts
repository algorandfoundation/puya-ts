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
  applicationCall(fields?: ApplicationTransactionFields): ApplicationTransaction {
    const params = fields ?? {}
    if (params.appId && !lazyContext.ledger.applicationDataMap.has(asBigInt(params.appId.id))) {
      internal.errors.internalError(`Application ID ${params.appId.id} not found in test context`)
    }
    if (!params.appId) {
      params.appId = lazyContext.any.application()
    }

    return ApplicationTransaction.create(params)
  }

  payment(fields?: TxnFields<gtxn.PaymentTxn>): PaymentTransaction {
    return PaymentTransaction.create(fields ?? {})
  }

  keyRegistration(fields?: TxnFields<gtxn.KeyRegistrationTxn>): KeyRegistrationTransaction {
    return KeyRegistrationTransaction.create(fields ?? {})
  }

  assetConfig(fields?: TxnFields<gtxn.AssetConfigTxn>): AssetConfigTransaction {
    return AssetConfigTransaction.create(fields ?? {})
  }

  assetTransfer(fields?: TxnFields<gtxn.AssetTransferTxn>): AssetTransferTransaction {
    return AssetTransferTransaction.create(fields ?? {})
  }

  assetFreeze(fields?: TxnFields<gtxn.AssetFreezeTxn>): AssetFreezeTransaction {
    return AssetFreezeTransaction.create(fields ?? {})
  }
}
