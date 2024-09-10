import { Account, Application, Asset } from './reference'
import { bytes, Uint64, uint64 } from './primitives'
import { OnCompleteAction } from './arc4'

/**
 * The different transaction types available in a transaction
 */
enum TransactionType {
  /**
   * A Payment transaction
   */
  Payment = Uint64(1),
  /**
   * A Key Registration transaction
   */
  KeyRegistration = Uint64(2),
  /**
   * An Asset Config transaction
   */
  AssetConfig = Uint64(3),
  /**
   * An Asset Transfer transaction
   */
  AssetTransfer = Uint64(4),
  /**
   * An Asset Freeze transaction
   */
  AssetFreeze = Uint64(5),
  /**
   * An Application Call transaction
   */
  ApplicationCall = Uint64(6),
}

interface TransactionBase {
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

export interface PayTxn extends TransactionBase {
  /**
   * 32 byte address
   */
  receiver: Account

  /**
   * microalgos
   */
  amount: uint64

  /**
   * 32 byte address
   */
  close_remainder_to: Account
}

export interface KeyRegistrationTxn extends TransactionBase {
  /**
   * 32 byte address
   */
  vote_key: bytes

  /**
   * 32 byte address
   */
  selection_key: bytes

  /**
   * The first round that the participation key is valid.
   */
  vote_first: uint64

  /**
   * The last round that the participation key is valid.
   */
  vote_last: uint64

  /**
   * Dilution for the 2-level participation key
   */
  vote_key_dilution: uint64

  /**
   * Marks an account nonparticipating for rewards
   */
  non_participation: boolean

  /**
   * 64 byte state proof public key
   */
  state_proof_key: bytes
}

export interface AssetConfigTxn extends TransactionBase {
  /**
   * Asset ID in asset config transaction
   */
  config_asset: Asset

  /**
   * Total number of units of this asset created
   */
  total: uint64

  /**
   * Number of digits to display after the decimal place when displaying the asset
   */
  decimals: uint64

  /**
   * Whether the asset's slots are frozen by default or not, 0 or 1
   */
  default_frozen: boolean

  /**
   * Unit name of the asset
   */
  unit_name: bytes

  /**
   * The asset name
   */
  asset_name: bytes

  /**
   * URL
   */
  url: bytes

  /**
   * 32 byte commitment to unspecified asset metadata
   */
  metadata_hash: bytes

  /**
   * 32 byte address
   */
  manager: Account

  /**
   * 32 byte address
   */
  reserve: Account

  /**
   * 32 byte address
   */
  freeze: Account

  /**
   * 32 byte address
   */
  clawback: Account
}

export interface AssetTransferTxn extends TransactionBase {
  /**
   * Asset ID
   */
  xferAsset: Asset

  /**
   * value in Asset's units
   */
  assetAmount: uint64

  /**
   * 32 byte address. Source of assets if Sender is the Asset's Clawback address.
   */
  assetSender: Account

  /**
   * 32 byte address
   */
  assetReceiver: Account

  /**
   * 32 byte address
   */
  assetCloseTo: Account
}

export interface AssetFreezeTxn extends TransactionBase {
  /**
   * Asset ID being frozen or un-frozen
   */
  freeze_asset: Asset

  /**
   * 32 byte address of the account whose asset slot is being frozen or un-frozen
   */
  freeze_account: Account

  /**
   * The new frozen value
   */
  frozen: boolean
}

export interface ApplicationTxn extends TransactionBase {
  /**
   * ApplicationID from ApplicationCall transaction
   */
  app_id: Application

  /**
   * ApplicationCall transaction on completion action
   */
  on_completion: OnCompleteAction

  /**
   * Number of ApplicationArgs
   */
  num_app_args: uint64

  /**
   * Number of ApplicationArgs
   */
  num_accounts: uint64

  /**
   * Approval program
   */
  approval_program: bytes

  /**
   * Clear State program
   */
  clear_state_program: bytes

  /**
   * Number of Assets
   */
  num_assets: uint64

  /**
   * Number of Applications
   */
  num_apps: uint64

  /**
   * Number of global state integers in ApplicationCall
   */
  global_num_uint: uint64

  /**
   * Number of global state byteslices in ApplicationCall
   */
  global_num_bytes: uint64

  /**
   * Number of local state integers in ApplicationCall
   */
  local_num_uint: uint64

  /**
   * Number of local state byteslices in ApplicationCall
   */
  local_num_bytes: uint64

  /**
   * Number of additional pages for each of the application's approval and clear state programs. An ExtraProgramPages of 1 means 2048 more total bytes, or 1024 for each program.
   */
  extra_program_pages: uint64

  /**
   * The last message emitted. Empty bytes if none were emitted. Application mode only
   */
  last_log: bytes

  /**
   * Number of Approval Program pages
   */
  num_approval_program_pages: uint64

  /**
   * Number of Clear State Program pages
   */
  num_clear_state_program_pages: uint64

  /**
   * Arguments passed to the application in the ApplicationCall transaction
   * @param index
   */
  app_args(index: uint64): bytes

  /**
   * Accounts listed in the ApplicationCall transaction
   */
  accounts(index: uint64): Account

  /**
   * Foreign Assets listed in the ApplicationCall transaction
   */
  assets(index: uint64): Asset

  /**
   * Foreign Apps listed in the ApplicationCall transaction
   */
  apps(index: uint64): Application

  /**
   * Approval Program as an array of pages
   */
  approval_program_pages(index: uint64): bytes

  /**
   * Clear State Program as an array of pages
   */
  clear_state_program_pages(index: uint64): bytes
}
