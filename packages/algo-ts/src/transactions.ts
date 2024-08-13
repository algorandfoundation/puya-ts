import { OnCompleteActionStr } from './arc4'
import { bytes, uint64 } from './primitives'
import { Account, Application, Asset } from './reference'

/**
 * The different transaction types available in a transaction
 */
export enum TransactionType {
  /**
   * A Payment transaction
   */
  Payment = 1,
  /**
   * A Key Registration transaction
   */
  KeyRegistration = 2,
  /**
   * An Asset Config transaction
   */
  AssetConfig = 3,
  /**
   * An Asset Transfer transaction
   */
  AssetTransfer = 4,
  /**
   * An Asset Freeze transaction
   */
  AssetFreeze = 5,
  /**
   * An Application Call transaction
   */
  ApplicationCall = 6,
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
  firstValid: uint64

  /**
   * UNIX timestamp of block before txn.FirstValid. Fails if negative
   */
  firstValidTime: uint64

  /**
   * round number
   */
  lastValid: uint64

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
  typeBytes: bytes

  /**
   * Position of this transaction within an atomic group
   * A stand-alone transaction is implicitly element 0 in a group of 1
   */
  groupIndex: uint64

  /**
   * The computed ID for this transaction. 32 bytes.
   */
  txnId: bytes

  /**
   * 32 byte Sender's new AuthAddr
   */
  rekeyTo: Account
}

export interface PayTxn extends TransactionBase {
  /**
   * Transaction type as integer
   */
  type: TransactionType.Payment
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
  closeRemainderTo: Account
}

export interface KeyRegistrationTxn extends TransactionBase {
  /**
   * Transaction type as integer
   */
  type: TransactionType.KeyRegistration
  /**
   * 32 byte address
   */
  voteKey: bytes

  /**
   * 32 byte address
   */
  selectionKey: bytes

  /**
   * The first round that the participation key is valid.
   */
  voteFirst: uint64

  /**
   * The last round that the participation key is valid.
   */
  voteLast: uint64

  /**
   * Dilution for the 2-level participation key
   */
  voteKeyDilution: uint64

  /**
   * Marks an account nonparticipating for rewards
   */
  nonParticipation: boolean

  /**
   * 64 byte state proof public key
   */
  stateProofKey: bytes
}

export interface AssetConfigTxn extends TransactionBase {
  /**
   * Transaction type as integer
   */
  type: TransactionType.AssetConfig
  /**
   * Asset ID in asset config transaction
   */
  configAsset: Asset

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
  defaultFrozen: boolean

  /**
   * Unit name of the asset
   */
  unitName: bytes

  /**
   * The asset name
   */
  assetName: bytes

  /**
   * URL
   */
  url: bytes

  /**
   * 32 byte commitment to unspecified asset metadata
   */
  metadataHash: bytes

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
   * Transaction type as integer
   */
  type: TransactionType.AssetTransfer
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
   * Transaction type as integer
   */
  type: TransactionType.AssetFreeze
  /**
   * Asset ID being frozen or un-frozen
   */
  freezeAsset: Asset

  /**
   * 32 byte address of the account whose asset slot is being frozen or un-frozen
   */
  freezeAccount: Account

  /**
   * The new frozen value
   */
  frozen: boolean
}

export interface ApplicationTxn extends TransactionBase {
  /**
   * Transaction type as integer
   */
  type: TransactionType.ApplicationCall

  /**
   * ApplicationID from ApplicationCall transaction
   */
  appId: Application

  /**
   * ApplicationCall transaction on completion action
   */
  onCompletion: OnCompleteActionStr

  /**
   * Number of ApplicationArgs
   */
  numAppArgs: uint64

  /**
   * Number of ApplicationArgs
   */
  numAccounts: uint64

  /**
   * Approval program
   */
  approvalProgram: bytes

  /**
   * Clear State program
   */
  clearStateProgram: bytes

  /**
   * Number of Assets
   */
  numAssets: uint64

  /**
   * Number of Applications
   */
  numApps: uint64

  /**
   * Number of global state integers in ApplicationCall
   */
  globalNumUint: uint64

  /**
   * Number of global state byteslices in ApplicationCall
   */
  globalNumBytes: uint64

  /**
   * Number of local state integers in ApplicationCall
   */
  localNumUint: uint64

  /**
   * Number of local state byteslices in ApplicationCall
   */
  localNumBytes: uint64

  /**
   * Number of additional pages for each of the application's approval and clear state programs. An ExtraProgramPages of 1 means 2048 more total bytes, or 1024 for each program.
   */
  extraProgramPages: uint64

  /**
   * The last message emitted. Empty bytes if none were emitted. Application mode only
   */
  lastLog: bytes

  /**
   * Number of Approval Program pages
   */
  numApprovalProgramPages: uint64

  /**
   * Number of Clear State Program pages
   */
  numClearStateProgramPages: uint64

  /**
   * Arguments passed to the application in the ApplicationCall transaction
   * @param index
   */
  appArgs(index: uint64): bytes

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
  approvalProgramPages(index: uint64): bytes

  /**
   * Clear State Program as an array of pages
   */
  clearStateProgramPages(index: uint64): bytes
}

export type Transaction = PayTxn | KeyRegistrationTxn | AssetConfigTxn | AssetTransferTxn | AssetFreezeTxn | ApplicationTxn
