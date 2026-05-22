import type { uint64 } from '@algorandfoundation/algorand-typescript'
import {
  assert,
  Global,
  LogicSig,
  logicsig,
  op,
  TemplateVar,
  TransactionType,
  Txn,
  Uint64,
} from '@algorandfoundation/algorand-typescript'
import { Address, DynamicBytes, Struct, Uint64 as ARC4Uint64 } from '@algorandfoundation/algorand-typescript/arc4'

// example: LSIG_SIMPLE_ARGS
export class EscrowRelease extends LogicSig {
  program(amount: uint64): boolean {
    const beneficiary = TemplateVar<Address>('BENEFICIARY')
    return (
      Txn.typeEnum === TransactionType.Payment &&
      Txn.receiver === beneficiary.native &&
      Txn.amount === amount &&
      Txn.fee <= Global.minTxnFee &&
      Txn.rekeyTo === Global.zeroAddress &&
      Txn.closeRemainderTo === Global.zeroAddress
    )
  }
}

// example: LSIG_SIMPLE_ARGS

// example: LSIG_STRUCT_ARGS
class Voucher extends Struct<{
  recipient: Address
  maxAmount: ARC4Uint64
  expiresAt: ARC4Uint64
}> {}

export class VoucherRedeem extends LogicSig {
  program(voucher: Voucher): boolean {
    return (
      Txn.typeEnum === TransactionType.Payment &&
      Txn.receiver === voucher.recipient.native &&
      Txn.amount <= voucher.maxAmount.asUint64() &&
      Txn.lastValid <= voucher.expiresAt.asUint64() &&
      Txn.rekeyTo === Global.zeroAddress &&
      Txn.closeRemainderTo === Global.zeroAddress
    )
  }
}

// example: LSIG_STRUCT_ARGS

// example: LSIG_MIXED_ARGS
@logicsig({ name: 'MixedArgsLsig', avmVersion: 11 })
export class MixedArgs extends LogicSig {
  program(amount: uint64, recipient: Address, note: DynamicBytes): uint64 {
    assert(Txn.typeEnum === TransactionType.Payment, 'must be a payment')
    assert(Txn.receiver === recipient.native, 'wrong recipient')
    assert(Txn.amount >= amount, 'amount too small')
    assert(Txn.note === note.native, 'wrong note')
    assert(Txn.rekeyTo === Global.zeroAddress, 'rekey not allowed')
    assert(Txn.closeRemainderTo === Global.zeroAddress, 'close not allowed')

    const digest = op.sha256(op.arg(0).concat(op.arg(1)).concat(op.arg(2)))
    assert(digest.length === 32, 'digest must be present')
    return Uint64(1)
  }
}

// example: LSIG_MIXED_ARGS

// example: LSIG_UNSAFE_ARGS
@logicsig({ validateEncoding: 'unsafe-disabled' })
export class EscrowReleaseTo extends LogicSig {
  program(payee: Address): boolean {
    const payeeA = TemplateVar<Address>('PAYEE_A')
    const payeeB = TemplateVar<Address>('PAYEE_B')
    const recipient = payee.native

    return (
      Txn.typeEnum === TransactionType.Payment &&
      (recipient === payeeA.native || recipient === payeeB.native) &&
      Txn.receiver === recipient &&
      Txn.fee <= Global.minTxnFee &&
      Txn.rekeyTo === Global.zeroAddress &&
      Txn.closeRemainderTo === Global.zeroAddress
    )
  }
}

// example: LSIG_UNSAFE_ARGS
