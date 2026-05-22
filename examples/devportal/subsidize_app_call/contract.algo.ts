import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import {
  Global,
  gtxn,
  LogicSig,
  TemplateVar,
  TransactionType,
  Txn,
} from '@algorandfoundation/algorand-typescript'

// example: LSIG_SUBSIDIZEAPPCALL
export class SubsidizeAppCall extends LogicSig {
  program(): boolean {
    const previousAppCall = gtxn.ApplicationCallTxn(Txn.groupIndex - 1)

    return (
      Txn.typeEnum === TransactionType.Payment &&
      Txn.receiver === Txn.sender &&
      Txn.amount === 0 &&
      Txn.rekeyTo === Global.zeroAddress &&
      Txn.closeRemainderTo === Global.zeroAddress &&
      Txn.fee === 2 * Global.minTxnFee &&
      Txn.lastValid <= TemplateVar<uint64>('EXPIRATION_ROUND') &&
      Global.genesisHash === TemplateVar<bytes>('TARGET_NETWORK_GENESIS') &&
      previousAppCall.appId.id === TemplateVar<uint64>('KNOWN_APP') &&
      previousAppCall.fee === 0
    )
  }
}

// example: LSIG_SUBSIDIZEAPPCALL
