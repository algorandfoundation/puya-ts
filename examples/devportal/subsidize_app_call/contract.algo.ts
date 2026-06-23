import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Global, gtxn, LogicSig, TemplateVar, Txn } from '@algorandfoundation/algorand-typescript'

// example: LSIG_SUBSIDIZEAPPCALL
export class SubsidizeAppCall extends LogicSig {
  /**
   * This Contract Account will subsidize the fees for any AppCall transaction directed to a known
   * application.
   *
   * The `gtxn.ApplicationCallTxn(index)` form binds to a transaction in the group and asserts its
   * type: `previousAppCall` here is the transaction immediately *preceding* the signed transaction
   * (`Txn.groupIndex - 1`), and the compiler asserts it is an ApplicationCall.
   */
  program(): boolean {
    const previousAppCall = gtxn.ApplicationCallTxn(Txn.groupIndex - 1)

    // this will assert the current transaction is a payment
    // it's exactly equivalent to using the `Txn` object,
    // just a bit more explicit
    const currentTxn = gtxn.PaymentTxn(Txn.groupIndex)

    return (
      // is it safe to pay for the fees of the previous transaction?
      currentTxn.receiver === currentTxn.sender &&
      currentTxn.amount === 0 &&
      currentTxn.rekeyTo === Global.zeroAddress &&
      currentTxn.closeRemainderTo === Global.zeroAddress &&
      currentTxn.fee === 2 * Global.minTxnFee &&
      currentTxn.lastValid <= TemplateVar<uint64>('EXPIRATION_ROUND') &&
      Global.genesisHash === TemplateVar<bytes>('TARGET_NETWORK_GENESIS') &&
      // does the previous transaction (already asserted to be an app call by
      // the typed lookup) target the known app, paying no fee itself?
      previousAppCall.appId.id === TemplateVar<uint64>('KNOWN_APP') &&
      previousAppCall.fee === 0
    )
  }
}

// example: LSIG_SUBSIDIZEAPPCALL
