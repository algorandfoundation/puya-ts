import type { Account, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, assert, BoxMap, Contract, Global, Txn, Uint64 } from '@algorandfoundation/algorand-typescript'

// example: REFERENCE_BOX_EXAMPLE
// Box MBR (minimum balance requirement) is a protocol-defined function of
// key + value size, so for a fixed box layout it is a compile-time constant.
const BOX_MBR_BASE = 2_500 // microAlgo flat cost per box
const BOX_MBR_PER_BYTE = 400 // microAlgo per byte of key + value
const COUNTER_BOX_KEY_LENGTH = 7 + 32 // len(b"counter") key prefix + 32-byte account address
const COUNTER_BOX_VALUE_LENGTH = 8 // one uint64
const COUNTER_BOX_MBR = BOX_MBR_BASE + (COUNTER_BOX_KEY_LENGTH + COUNTER_BOX_VALUE_LENGTH) * BOX_MBR_PER_BYTE

/**
 * Per-account counters held in box storage. The first increment for an
 * account is funded by a grouped payment covering the box MBR; the contract
 * then creates or increments the box on the caller's behalf. Every box an
 * app call touches must be declared in the transaction's box reference
 * array at call time (the AlgoKit client typically handles this
 * automatically).
 */
export class ReferenceBox extends Contract {
  accountBoxCounter = BoxMap<Account, uint64>({ keyPrefix: 'counter' })

  /**
   * Increment the sender's counter, creating their box on first use.
   * The grouped payment must fund the box MBR when the box is first
   * created; later increments may pass a zero-amount payment.
   */
  @abimethod()
  incrementBoxCounter(payMbr: gtxn.PaymentTxn): uint64 {
    const [counter, exists] = this.accountBoxCounter(Txn.sender).maybe()
    if (!exists) {
      assert(payMbr.amount >= COUNTER_BOX_MBR, 'Payment must cover the box MBR')
      assert(payMbr.receiver === Global.currentApplicationAddress, 'Payment must be to the contract')
    }

    // first use starts from 0, so the new value is 1; otherwise increment
    const newCount: uint64 = exists ? counter + 1 : Uint64(1)
    this.accountBoxCounter(Txn.sender).value = newCount
    return newCount
  }

  /** The sender's counter, or 0 if not yet set. */
  @abimethod({ readonly: true })
  getBoxCounter(): uint64 {
    return this.accountBoxCounter(Txn.sender).get({ default: Uint64(0) })
  }

  /** The given account's counter, or 0 if not yet set. */
  @abimethod({ readonly: true })
  getBoxCounterForAccount(account: Account): uint64 {
    return this.accountBoxCounter(account).get({ default: Uint64(0) })
  }

  /**
   * The MBR a caller must fund before their first increment — a
   * compile-time constant clients can quote without hard-coding it.
   */
  @abimethod({ readonly: true })
  getBoxMbr(): uint64 {
    return Uint64(COUNTER_BOX_MBR)
  }
}
// example: REFERENCE_BOX_EXAMPLE
