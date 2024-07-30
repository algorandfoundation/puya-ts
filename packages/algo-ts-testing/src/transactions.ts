import { Account, bytes, uint64, Uint64 } from '@algorandfoundation/algo-ts'

console.log('transactions')
export enum TransactionType {
  /**
   * A Payment transaction
   */
  Payment = Uint64(0),
  /**
   * A Key Registration transaction
   */
  KeyRegistration = Uint64(1),
  /**
   * An Asset Config transaction
   */
  AssetConfig = Uint64(2),
  /**
   * An Asset Transfer transaction
   */
  AssetTransfer = Uint64(3),
  /**
   * An Asset Freeze transaction
   */
  AssetFreeze = Uint64(4),
  /**
   * An Application Call transaction
   */
  ApplicationCall = Uint64(5),
}

export interface TransactionBase {
  /**
   * 32 byte address
   */
  sender: Account

  /**
   * microalgos
   */
  fee: uint64

  /**
   * round number
   */
  first_valid: uint64

  /**
   * UNIX timestamp of block before txn.FirstValid. Fails if negative
   */
  first_valid_time: uint64

  /**
   * round number
   */
  last_valid: uint64

  /**
   * Any data up to 1024 bytes
   */
  note: bytes

  /**
   * 32 byte lease value
   */
  lease: bytes

  /**
   * Transaction type as bytes
   */
  type_bytes: bytes

  /**
   * Transaction type as integer
   */
  type: TransactionType

  /**
   * Position of this transaction within an atomic group
   * A stand-alone transaction is implicitly element 0 in a group of 1
   */
  group_index: uint64

  /**
   * The computed ID for this transaction. 32 bytes.
   */
  txn_id: bytes

  /**
   * 32 byte Sender's new AuthAddr
   */
  rekey_to: Account
}
