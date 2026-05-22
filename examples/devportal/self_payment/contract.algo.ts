import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import {
  Bytes,
  Global,
  LogicSig,
  op,
  TemplateVar,
  TransactionType,
  Txn,
} from '@algorandfoundation/algorand-typescript'

// example: LSIG_SELFPAYMENT
export class SelfPayment extends LogicSig {
  program(): boolean {
    return (
      Txn.typeEnum === TransactionType.Payment &&
      Txn.receiver === Txn.sender &&
      Txn.amount === 0 &&
      Txn.rekeyTo === Global.zeroAddress &&
      Txn.closeRemainderTo === Global.zeroAddress &&
      Txn.fee === Global.minTxnFee &&
      Global.genesisHash === TemplateVar<bytes>('TARGET_NETWORK_GENESIS') &&
      Txn.lastValid === TemplateVar<uint64>('LAST_ROUND') &&
      Txn.lease === op.sha256(Bytes('self-payment'))
    )
  }
}

// example: LSIG_SELFPAYMENT
