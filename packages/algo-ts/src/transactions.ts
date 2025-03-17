import { OnCompleteActionStr } from './on-complete-action'
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
  readonly sender: Account

  /**
   * microalgos
   */
  readonly fee: uint64

  /**
   * round number
   */
  readonly firstValid: uint64

  /**
   * UNIX timestamp of block before txn.FirstValid. Fails if negative
   */
  readonly firstValidTime: uint64

  /**
   * round number
   */
  readonly lastValid: uint64

  /**
   * Any data up to 1024 bytes
   */
  readonly note: bytes

  /**
   * 32 byte lease value
   */
  readonly lease: bytes

  /**
   * Transaction type as bytes
   */
  readonly typeBytes: bytes

  /**
   * Position of this transaction within an atomic group
   * A stand-alone transaction is implicitly element 0 in a group of 1
   */
  readonly groupIndex: uint64

  /**
   * The computed ID for this transaction. 32 bytes.
   */
  readonly txnId: bytes

  /**
   * 32 byte Sender's new AuthAddr
   */
  readonly rekeyTo: Account
}

/**
 * A payment transaction
 */
export interface PaymentTxn extends TransactionBase {
  /**
   * 32 byte address
   */
  readonly receiver: Account

  /**
   * microalgos
   */
  readonly amount: uint64

  /**
   * 32 byte address
   */
  readonly closeRemainderTo: Account

  /**
   * Transaction type as integer
   */
  readonly type: TransactionType.Payment
}

export interface KeyRegistrationTxn extends TransactionBase {
  /**
   * 32 byte address
   */
  readonly voteKey: bytes

  /**
   * 32 byte address
   */
  readonly selectionKey: bytes

  /**
   * The first round that the participation key is valid.
   */
  readonly voteFirst: uint64

  /**
   * The last round that the participation key is valid.
   */
  readonly voteLast: uint64

  /**
   * Dilution for the 2-level participation key
   */
  readonly voteKeyDilution: uint64

  /**
   * Marks an account nonparticipating for rewards
   */
  readonly nonparticipation: boolean

  /**
   * 64 byte state proof public key
   */
  readonly stateProofKey: bytes
  /**
   * Transaction type as integer
   */
  readonly type: TransactionType.KeyRegistration
}

export interface AssetConfigTxn extends TransactionBase {
  /**
   * Asset ID in asset config transaction
   */
  readonly configAsset: Asset

  /**
   * Total number of units of this asset created
   */
  readonly total: uint64

  /**
   * Number of digits to display after the decimal place when displaying the asset
   */
  readonly decimals: uint64

  /**
   * Whether the asset's slots are frozen by default or not, 0 or 1
   */
  readonly defaultFrozen: boolean

  /**
   * Unit name of the asset
   */
  readonly unitName: bytes

  /**
   * The asset name
   */
  readonly assetName: bytes

  /**
   * URL
   */
  readonly url: bytes

  /**
   * 32 byte commitment to unspecified asset metadata
   */
  readonly metadataHash: bytes

  /**
   * 32 byte address
   */
  readonly manager: Account

  /**
   * 32 byte address
   */
  readonly reserve: Account

  /**
   * 32 byte address
   */
  readonly freeze: Account

  /**
   * 32 byte address
   */
  readonly clawback: Account
  /**
   * Asset ID allocated by the creation of an ASA
   */
  createdAsset: Asset

  /**
   * Transaction type as integer
   */
  readonly type: TransactionType.AssetConfig
}

export interface AssetTransferTxn extends TransactionBase {
  /**
   * Asset ID
   */
  readonly xferAsset: Asset

  /**
   * value in Asset's units
   */
  readonly assetAmount: uint64

  /**
   * 32 byte address. Source of assets if Sender is the Asset's Clawback address.
   */
  readonly assetSender: Account

  /**
   * 32 byte address
   */
  readonly assetReceiver: Account

  /**
   * 32 byte address
   */
  readonly assetCloseTo: Account
  /**
   * Transaction type as integer
   */
  readonly type: TransactionType.AssetTransfer
}

export interface AssetFreezeTxn extends TransactionBase {
  /**
   * Asset ID being frozen or un-frozen
   */
  readonly freezeAsset: Asset

  /**
   * 32 byte address of the account whose asset slot is being frozen or un-frozen
   */
  readonly freezeAccount: Account

  /**
   * The new frozen value
   */
  readonly frozen: boolean
  /**
   * Transaction type as integer
   */
  readonly type: TransactionType.AssetFreeze
}

export interface ApplicationTxn extends TransactionBase {
  /**
   * ApplicationID from ApplicationCall transaction
   */
  readonly appId: Application

  /**
   * ApplicationCall transaction on completion action
   */
  readonly onCompletion: OnCompleteActionStr

  /**
   * Number of ApplicationArgs
   */
  readonly numAppArgs: uint64

  /**
   * Number of ApplicationArgs
   */
  readonly numAccounts: uint64

  /**
   * Approval program
   */
  readonly approvalProgram: bytes

  /**
   * Clear State program
   */
  readonly clearStateProgram: bytes

  /**
   * Number of Assets
   */
  readonly numAssets: uint64

  /**
   * Number of Applications
   */
  readonly numApps: uint64

  /**
   * Number of global state integers in ApplicationCall
   */
  readonly globalNumUint: uint64

  /**
   * Number of global state byteslices in ApplicationCall
   */
  readonly globalNumBytes: uint64

  /**
   * Number of local state integers in ApplicationCall
   */
  readonly localNumUint: uint64

  /**
   * Number of local state byteslices in ApplicationCall
   */
  readonly localNumBytes: uint64

  /**
   * Number of additional pages for each of the application's approval and clear state programs. An ExtraProgramPages of 1 means 2048 more total bytes, or 1024 for each program.
   */
  readonly extraProgramPages: uint64

  /**
   * The last message emitted. Empty bytes if none were emitted. Application mode only
   */
  readonly lastLog: bytes

  /**
   * Log messages emitted by an application call
   */
  logs(index: uint64): bytes

  /**
   * Number of logs
   */
  readonly numLogs: uint64

  /**
   * ApplicationID allocated by the creation of an application
   */
  readonly createdApp: Application

  /**
   * Number of Approval Program pages
   */
  readonly numApprovalProgramPages: uint64

  /**
   * Number of Clear State Program pages
   */
  readonly numClearStateProgramPages: uint64

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
  /**
   * Transaction type as integer
   */
  readonly type: TransactionType.ApplicationCall
}

export type Transaction = PaymentTxn | KeyRegistrationTxn | AssetConfigTxn | AssetTransferTxn | AssetFreezeTxn | ApplicationTxn
