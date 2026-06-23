import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { Bytes, Global, gtxn, LogicSig, op, TemplateVar, Txn } from '@algorandfoundation/algorand-typescript'

// example: LSIG_SELFPAYMENT
/**
 * This Delegated Account will authorize a single empty self payment,
 * valid no later than a round known ahead of time.
 */
export class SelfPayment extends LogicSig {
  program(): boolean {
    const currentTxn = gtxn.PaymentTxn(Txn.groupIndex)
    return (
      currentTxn.receiver === currentTxn.sender &&
      currentTxn.amount === 0 &&
      currentTxn.rekeyTo === Global.zeroAddress &&
      currentTxn.closeRemainderTo === Global.zeroAddress &&
      currentTxn.fee === Global.minTxnFee &&
      Global.genesisHash === TemplateVar<bytes>('TARGET_NETWORK_GENESIS') &&
      // Pinning lastValid and requiring a non-empty lease prevents replay attacks:
      // once confirmed, the (sender, lease) pair is locked until LAST_ROUND passes.
      currentTxn.lastValid === TemplateVar<uint64>('LAST_ROUND') &&
      currentTxn.lease === op.sha256(Bytes('self-payment'))
    )
  }
}

// example: LSIG_SELFPAYMENT
