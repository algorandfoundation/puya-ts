import { Account, Application, Asset, Bytes, bytes, gtxn, internal, Uint64, uint64 } from '@algorandfoundation/algo-ts'
import { getTestExecutionContext } from '../util'

export const Txn: internal.opTypes.TxnType = {
  get sender(): Account {
    const context = getTestExecutionContext()
    const currentTransaction = context.txn.activeTransaction
    return currentTransaction.sender
  },

  /**
   * microalgos
   */
  get fee(): uint64 {
    throw new Error('TODO')
  },

  /**
   * round number
   */
  get firstValid(): uint64 {
    throw new Error('TODO')
  },

  /**
   * UNIX timestamp of block before txn.FirstValid. Fails if negative
   */
  get firstValidTime(): uint64 {
    throw new Error('TODO')
  },

  /**
   * round number
   */
  get lastValid(): uint64 {
    throw new Error('TODO')
  },

  /**
   * Any data up to 1024 bytes
   */
  get note(): bytes {
    throw new Error('TODO')
  },

  /**
   * 32 byte lease value
   */
  get lease(): bytes {
    throw new Error('TODO')
  },

  /**
   * 32 byte address
   */
  get receiver(): Account {
    throw new Error('TODO')
  },

  /**
   * microalgos
   */
  get amount(): uint64 {
    throw new Error('TODO')
  },

  /**
   * 32 byte address
   */
  get closeRemainderTo(): Account {
    throw new Error('TODO')
  },

  /**
   * 32 byte address
   */
  get votePk(): bytes {
    throw new Error('TODO')
  },

  /**
   * 32 byte address
   */
  get selectionPk(): bytes {
    throw new Error('TODO')
  },

  /**
   * The first round that the participation key is valid.
   */
  get voteFirst(): uint64 {
    throw new Error('TODO')
  },

  /**
   * The last round that the participation key is valid.
   */
  get voteLast(): uint64 {
    throw new Error('TODO')
  },

  /**
   * Dilution for the 2-level participation key
   */
  get voteKeyDilution(): uint64 {
    throw new Error('TODO')
  },

  /**
   * Transaction type as bytes
   */
  get type(): bytes {
    throw new Error('TODO')
  },

  /**
   * Transaction type as integer
   */
  get typeEnum(): uint64 {
    throw new Error('TODO')
  },

  /**
   * Asset ID
   */
  get xferAsset(): Asset {
    throw new Error('TODO')
  },

  /**
   * value in Asset's units
   */
  get assetAmount(): uint64 {
    throw new Error('TODO')
  },

  /**
   * 32 byte address. Source of assets if Sender is the Asset's Clawback address.
   */
  get assetSender(): Account {
    throw new Error('TODO')
  },

  /**
   * 32 byte address
   */
  get assetReceiver(): Account {
    throw new Error('TODO')
  },

  /**
   * 32 byte address
   */
  get assetCloseTo(): Account {
    throw new Error('TODO')
  },

  /**
   * Position of this transaction within an atomic transaction group. A stand-alone transaction is implicitly element 0 in a group of 1
   */
  get groupIndex(): uint64 {
    throw new Error('TODO')
  },

  /**
   * The computed ID for this transaction. 32 bytes.
   */
  get txId(): bytes {
    throw new Error('TODO')
  },

  /**
   * ApplicationID from ApplicationCall transaction
   */
  get applicationId(): Application {
    throw new Error('TODO')
  },

  /**
   * ApplicationCall transaction on completion action
   */
  get onCompletion(): uint64 {
    throw new Error('TODO')
  },

  /**
   * Arguments passed to the application in the ApplicationCall transaction
   */
  applicationArgs(a: uint64): bytes {
    const context = getTestExecutionContext()
    const currentTransaction = context.txn.activeTransaction
    if (currentTransaction.type === gtxn.TransactionType.ApplicationCall) {
      return currentTransaction.appArgs(internal.primitives.Uint64Cls.getNumber(a))
    }
    return Bytes()
  },

  /**
   * Number of ApplicationArgs
   */
  get numAppArgs(): uint64 {
    const context = getTestExecutionContext()
    const currentTransaction = context.txn.activeTransaction
    if (currentTransaction.type === gtxn.TransactionType.ApplicationCall) {
      return currentTransaction.numAppArgs
    }
    return Uint64(0)
  },

  /**
   * Accounts listed in the ApplicationCall transaction
   */
  accounts(_a: uint64): Account {
    throw new Error('TODO')
  },

  /**
   * Number of Accounts
   */
  get numAccounts(): uint64 {
    throw new Error('TODO')
  },

  /**
   * Approval program
   */
  get approvalProgram(): bytes {
    throw new Error('TODO')
  },

  /**
   * Clear state program
   */
  get clearStateProgram(): bytes {
    throw new Error('TODO')
  },

  /**
   * 32 byte Sender's new AuthAddr
   */
  get rekeyTo(): Account {
    throw new Error('TODO')
  },

  /**
   * Asset ID in asset config transaction
   */
  get configAsset(): Asset {
    throw new Error('TODO')
  },

  /**
   * Total number of units of this asset created
   */
  get configAssetTotal(): uint64 {
    throw new Error('TODO')
  },

  /**
   * Number of digits to display after the decimal place when displaying the asset
   */
  get configAssetDecimals(): uint64 {
    throw new Error('TODO')
  },

  /**
   * Whether the asset's slots are frozen by default or not, 0 or 1
   */
  get configAssetDefaultFrozen(): boolean {
    throw new Error('TODO')
  },

  /**
   * Unit name of the asset
   */
  get configAssetUnitName(): bytes {
    throw new Error('TODO')
  },

  /**
   * The asset name
   */
  get configAssetName(): bytes {
    throw new Error('TODO')
  },

  /**
   * URL
   */
  get configAssetUrl(): bytes {
    throw new Error('TODO')
  },

  /**
   * 32 byte commitment to unspecified asset metadata
   */
  get configAssetMetadataHash(): bytes {
    throw new Error('TODO')
  },

  /**
   * 32 byte address
   */
  get configAssetManager(): Account {
    throw new Error('TODO')
  },

  /**
   * 32 byte address
   */
  get configAssetReserve(): Account {
    throw new Error('TODO')
  },

  /**
   * 32 byte address
   */
  get configAssetFreeze(): Account {
    throw new Error('TODO')
  },

  /**
   * 32 byte address
   */
  get configAssetClawback(): Account {
    throw new Error('TODO')
  },

  /**
   * Asset ID being frozen or un-frozen
   */
  get freezeAsset(): Asset {
    throw new Error('TODO')
  },

  /**
   * 32 byte address of the account whose asset slot is being frozen or un-frozen
   */
  get freezeAssetAccount(): Account {
    throw new Error('TODO')
  },

  /**
   * The new frozen value, 0 or 1
   */
  get freezeAssetFrozen(): boolean {
    throw new Error('TODO')
  },

  /**
   * Foreign Assets listed in the ApplicationCall transaction
   */
  assets(_a: uint64): Asset {
    throw new Error('TODO')
  },

  /**
   * Number of Assets
   */
  get numAssets(): uint64 {
    throw new Error('TODO')
  },

  /**
   * Foreign Apps listed in the ApplicationCall transaction
   */
  applications(_a: uint64): Application {
    throw new Error('TODO')
  },

  /**
   * Number of Applications
   */
  get numApplications(): uint64 {
    throw new Error('TODO')
  },

  /**
   * Number of global state integers in ApplicationCall
   */
  get globalNumUint(): uint64 {
    throw new Error('TODO')
  },

  /**
   * Number of global state byteslices in ApplicationCall
   */
  get globalNumByteSlice(): uint64 {
    throw new Error('TODO')
  },

  /**
   * Number of local state integers in ApplicationCall
   */
  get localNumUint(): uint64 {
    throw new Error('TODO')
  },

  /**
   * Number of local state byteslices in ApplicationCall
   */
  get localNumByteSlice(): uint64 {
    throw new Error('TODO')
  },

  /**
   * Number of additional pages for each of the application's approval and clear state programs. An ExtraProgramPages of 1 means 2048 more total bytes, or 1024 for each program.
   */
  get extraProgramPages(): uint64 {
    throw new Error('TODO')
  },

  /**
   * Marks an account nonparticipating for rewards
   */
  get nonparticipation(): boolean {
    throw new Error('TODO')
  },

  /**
   * Log messages emitted by an application call (only with `itxn` in v5). Application mode only
   */
  logs(_a: uint64): bytes {
    throw new Error('TODO')
  },

  /**
   * Number of Logs (only with `itxn` in v5). Application mode only
   */
  get numLogs(): uint64 {
    throw new Error('TODO')
  },

  /**
   * Asset ID allocated by the creation of an ASA (only with `itxn` in v5). Application mode only
   */
  get createdAssetId(): Asset {
    throw new Error('TODO')
  },

  /**
   * ApplicationID allocated by the creation of an application (only with `itxn` in v5). Application mode only
   */
  get createdApplicationId(): Application {
    throw new Error('TODO')
  },

  /**
   * The last message emitted. Empty bytes if none were emitted. Application mode only
   */
  get lastLog(): bytes {
    throw new Error('TODO')
  },

  /**
   * 64 byte state proof public key
   */
  get stateProofPk(): bytes {
    throw new Error('TODO')
  },

  /**
   * Approval Program as an array of pages
   */
  approvalProgramPages(_a: uint64): bytes {
    throw new Error('TODO')
  },

  /**
   * Number of Approval Program pages
   */
  get numApprovalProgramPages(): uint64 {
    throw new Error('TODO')
  },

  /**
   * ClearState Program as an array of pages
   */
  clearStateProgramPages(_a: uint64): bytes {
    throw new Error('TODO')
  },

  /**
   * Number of ClearState Program pages
   */
  get numClearStateProgramPages(): uint64 {
    throw new Error('TODO')
  },
}
