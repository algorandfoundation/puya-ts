import { assert, LogicSig, Txn, Uint64 } from '@algorandfoundation/algorand-typescript'

export class AlwaysAllow extends LogicSig {
  program() {
    return true
  }
}

function feeIsZero() {
  assert(Txn.fee === 0, 'Fee must be zero')
}

export class AllowNoFee extends LogicSig {
  program() {
    feeIsZero()
    return Uint64(1)
  }
}
