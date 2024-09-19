import { Account, Application, arc4, Asset, bytes, gtxn, internal, uint64 } from '@algorandfoundation/algo-ts'
import { lazyContext } from '../context-helpers/internal-context'
import { asNumber, asUint64, asUint64Cls } from '../util'

const getActiveTransaction = <T extends gtxn.Transaction>(): T => {
  return lazyContext.activeGroup.activeTransaction as T
}

export const gaid = (a: internal.primitives.StubUint64Compat): uint64 => {
  const group = lazyContext.activeGroup
  const transaction = group.transactions[asNumber(a)]
  if (transaction.type === gtxn.TransactionType.ApplicationCall) {
    return transaction.createdApp.id
  } else if (transaction.type === gtxn.TransactionType.AssetConfig) {
    return transaction.createdAsset.id
  } else {
    throw new internal.errors.InternalError(`transaction at index ${asNumber(a)} is not an Application Call or Asset Config`)
  }
}

export const Txn: internal.opTypes.TxnType = {
  get sender(): Account {
    return getActiveTransaction().sender
  },

  /**
   * microalgos
   */
  get fee(): uint64 {
    return getActiveTransaction().fee
  },

  /**
   * round number
   */
  get firstValid(): uint64 {
    return getActiveTransaction().firstValid
  },

  /**
   * UNIX timestamp of block before txn.FirstValid. Fails if negative
   */
  get firstValidTime(): uint64 {
    return getActiveTransaction().firstValidTime
  },

  /**
   * round number
   */
  get lastValid(): uint64 {
    return getActiveTransaction().lastValid
  },

  /**
   * Any data up to 1024 bytes
   */
  get note(): bytes {
    return getActiveTransaction().note
  },

  /**
   * 32 byte lease value
   */
  get lease(): bytes {
    return getActiveTransaction().lease
  },

  /**
   * 32 byte address
   */
  get receiver(): Account {
    return getActiveTransaction<gtxn.PaymentTxn>().receiver
  },

  /**
   * microalgos
   */
  get amount(): uint64 {
    return getActiveTransaction<gtxn.PaymentTxn>().amount
  },

  /**
   * 32 byte address
   */
  get closeRemainderTo(): Account {
    return getActiveTransaction<gtxn.PaymentTxn>().closeRemainderTo
  },

  /**
   * 32 byte address
   */
  get votePk(): bytes {
    return getActiveTransaction<gtxn.KeyRegistrationTxn>().voteKey
  },

  /**
   * 32 byte address
   */
  get selectionPk(): bytes {
    return getActiveTransaction<gtxn.KeyRegistrationTxn>().selectionKey
  },

  /**
   * The first round that the participation key is valid.
   */
  get voteFirst(): uint64 {
    return getActiveTransaction<gtxn.KeyRegistrationTxn>().voteFirst
  },

  /**
   * The last round that the participation key is valid.
   */
  get voteLast(): uint64 {
    return getActiveTransaction<gtxn.KeyRegistrationTxn>().voteLast
  },

  /**
   * Dilution for the 2-level participation key
   */
  get voteKeyDilution(): uint64 {
    return getActiveTransaction<gtxn.KeyRegistrationTxn>().voteKeyDilution
  },

  /**
   * Transaction type as bytes
   */
  get type(): bytes {
    return asUint64Cls(getActiveTransaction().type).toBytes().asAlgoTs()
  },

  /**
   * Transaction type as integer
   */
  get typeEnum(): uint64 {
    return asUint64(getActiveTransaction().type)
  },

  /**
   * Asset ID
   */
  get xferAsset(): Asset {
    return getActiveTransaction<gtxn.AssetTransferTxn>().xferAsset
  },

  /**
   * value in Asset's units
   */
  get assetAmount(): uint64 {
    return getActiveTransaction<gtxn.AssetTransferTxn>().assetAmount
  },

  /**
   * 32 byte address. Source of assets if Sender is the Asset's Clawback address.
   */
  get assetSender(): Account {
    return getActiveTransaction<gtxn.AssetTransferTxn>().assetSender
  },

  /**
   * 32 byte address
   */
  get assetReceiver(): Account {
    return getActiveTransaction<gtxn.AssetTransferTxn>().assetReceiver
  },

  /**
   * 32 byte address
   */
  get assetCloseTo(): Account {
    return getActiveTransaction<gtxn.AssetTransferTxn>().assetCloseTo
  },

  /**
   * Position of this transaction within an atomic transaction group. A stand-alone transaction is implicitly element 0 in a group of 1
   */
  get groupIndex(): uint64 {
    return getActiveTransaction().groupIndex
  },

  /**
   * The computed ID for this transaction. 32 bytes.
   */
  get txId(): bytes {
    return getActiveTransaction().txnId
  },

  /**
   * ApplicationID from ApplicationCall transaction
   */
  get applicationId(): Application {
    return getActiveTransaction<gtxn.ApplicationTxn>().appId
  },

  /**
   * ApplicationCall transaction on completion action
   */
  get onCompletion(): uint64 {
    const onCompletionStr = getActiveTransaction<gtxn.ApplicationTxn>().onCompletion
    return asUint64(arc4.OnCompleteAction[onCompletionStr])
  },

  /**
   * Arguments passed to the application in the ApplicationCall transaction
   */
  applicationArgs(a: internal.primitives.StubUint64Compat): bytes {
    return getActiveTransaction<gtxn.ApplicationTxn>().appArgs(asUint64(a))
  },

  /**
   * Number of ApplicationArgs
   */
  get numAppArgs(): uint64 {
    return getActiveTransaction<gtxn.ApplicationTxn>().numAppArgs
  },

  /**
   * Accounts listed in the ApplicationCall transaction
   */
  accounts(a: internal.primitives.StubUint64Compat): Account {
    return getActiveTransaction<gtxn.ApplicationTxn>().accounts(asUint64(a))
  },

  /**
   * Number of Accounts
   */
  get numAccounts(): uint64 {
    return getActiveTransaction<gtxn.ApplicationTxn>().numAccounts
  },

  /**
   * Approval program
   */
  get approvalProgram(): bytes {
    return getActiveTransaction<gtxn.ApplicationTxn>().approvalProgram
  },

  /**
   * Clear state program
   */
  get clearStateProgram(): bytes {
    return getActiveTransaction<gtxn.ApplicationTxn>().clearStateProgram
  },

  /**
   * 32 byte Sender's new AuthAddr
   */
  get rekeyTo(): Account {
    return getActiveTransaction().rekeyTo
  },

  /**
   * Asset ID in asset config transaction
   */
  get configAsset(): Asset {
    return getActiveTransaction<gtxn.AssetConfigTxn>().configAsset
  },

  /**
   * Total number of units of this asset created
   */
  get configAssetTotal(): uint64 {
    return getActiveTransaction<gtxn.AssetConfigTxn>().total
  },

  /**
   * Number of digits to display after the decimal place when displaying the asset
   */
  get configAssetDecimals(): uint64 {
    return getActiveTransaction<gtxn.AssetConfigTxn>().decimals
  },

  /**
   * Whether the asset's slots are frozen by default or not, 0 or 1
   */
  get configAssetDefaultFrozen(): boolean {
    return getActiveTransaction<gtxn.AssetConfigTxn>().defaultFrozen
  },

  /**
   * Unit name of the asset
   */
  get configAssetUnitName(): bytes {
    return getActiveTransaction<gtxn.AssetConfigTxn>().unitName
  },

  /**
   * The asset name
   */
  get configAssetName(): bytes {
    return getActiveTransaction<gtxn.AssetConfigTxn>().assetName
  },

  /**
   * URL
   */
  get configAssetUrl(): bytes {
    return getActiveTransaction<gtxn.AssetConfigTxn>().url
  },

  /**
   * 32 byte commitment to unspecified asset metadata
   */
  get configAssetMetadataHash(): bytes {
    return getActiveTransaction<gtxn.AssetConfigTxn>().metadataHash
  },

  /**
   * 32 byte address
   */
  get configAssetManager(): Account {
    return getActiveTransaction<gtxn.AssetConfigTxn>().manager
  },

  /**
   * 32 byte address
   */
  get configAssetReserve(): Account {
    return getActiveTransaction<gtxn.AssetConfigTxn>().reserve
  },

  /**
   * 32 byte address
   */
  get configAssetFreeze(): Account {
    return getActiveTransaction<gtxn.AssetConfigTxn>().freeze
  },

  /**
   * 32 byte address
   */
  get configAssetClawback(): Account {
    return getActiveTransaction<gtxn.AssetConfigTxn>().clawback
  },

  /**
   * Asset ID being frozen or un-frozen
   */
  get freezeAsset(): Asset {
    return getActiveTransaction<gtxn.AssetFreezeTxn>().freezeAsset
  },

  /**
   * 32 byte address of the account whose asset slot is being frozen or un-frozen
   */
  get freezeAssetAccount(): Account {
    return getActiveTransaction<gtxn.AssetFreezeTxn>().freezeAccount
  },

  /**
   * The new frozen value, 0 or 1
   */
  get freezeAssetFrozen(): boolean {
    return getActiveTransaction<gtxn.AssetFreezeTxn>().frozen
  },

  /**
   * Foreign Assets listed in the ApplicationCall transaction
   */
  assets(a: internal.primitives.StubUint64Compat): Asset {
    return getActiveTransaction<gtxn.ApplicationTxn>().assets(asUint64(a))
  },

  /**
   * Number of Assets
   */
  get numAssets(): uint64 {
    return getActiveTransaction<gtxn.ApplicationTxn>().numAssets
  },

  /**
   * Foreign Apps listed in the ApplicationCall transaction
   */
  applications(a: internal.primitives.StubUint64Compat): Application {
    return getActiveTransaction<gtxn.ApplicationTxn>().apps(asUint64(a))
  },

  /**
   * Number of Applications
   */
  get numApplications(): uint64 {
    return getActiveTransaction<gtxn.ApplicationTxn>().numApps
  },

  /**
   * Number of global state integers in ApplicationCall
   */
  get globalNumUint(): uint64 {
    return getActiveTransaction<gtxn.ApplicationTxn>().globalNumUint
  },

  /**
   * Number of global state byteslices in ApplicationCall
   */
  get globalNumByteSlice(): uint64 {
    return getActiveTransaction<gtxn.ApplicationTxn>().globalNumBytes
  },

  /**
   * Number of local state integers in ApplicationCall
   */
  get localNumUint(): uint64 {
    return getActiveTransaction<gtxn.ApplicationTxn>().localNumUint
  },

  /**
   * Number of local state byteslices in ApplicationCall
   */
  get localNumByteSlice(): uint64 {
    return getActiveTransaction<gtxn.ApplicationTxn>().localNumBytes
  },

  /**
   * Number of additional pages for each of the application's approval and clear state programs. An ExtraProgramPages of 1 means 2048 more total bytes, or 1024 for each program.
   */
  get extraProgramPages(): uint64 {
    return getActiveTransaction<gtxn.ApplicationTxn>().extraProgramPages
  },

  /**
   * Marks an account nonparticipating for rewards
   */
  get nonparticipation(): boolean {
    return getActiveTransaction<gtxn.KeyRegistrationTxn>().nonParticipation
  },

  /**
   * Log messages emitted by an application call (only with `itxn` in v5). Application mode only
   */
  logs(a: internal.primitives.StubUint64Compat): bytes {
    return getActiveTransaction<gtxn.ApplicationTxn>().logs(asUint64(a))
  },

  /**
   * Number of Logs (only with `itxn` in v5). Application mode only
   */
  get numLogs(): uint64 {
    return getActiveTransaction<gtxn.ApplicationTxn>().numLogs
  },

  /**
   * Asset ID allocated by the creation of an ASA (only with `itxn` in v5). Application mode only
   */
  get createdAssetId(): Asset {
    return getActiveTransaction<gtxn.AssetConfigTxn>().createdAsset
  },

  /**
   * ApplicationID allocated by the creation of an application (only with `itxn` in v5). Application mode only
   */
  get createdApplicationId(): Application {
    return getActiveTransaction<gtxn.ApplicationTxn>().createdApp
  },

  /**
   * The last message emitted. Empty bytes if none were emitted. Application mode only
   */
  get lastLog(): bytes {
    return getActiveTransaction<gtxn.ApplicationTxn>().lastLog
  },

  /**
   * 64 byte state proof public key
   */
  get stateProofPk(): bytes {
    return getActiveTransaction<gtxn.KeyRegistrationTxn>().stateProofKey
  },

  /**
   * Approval Program as an array of pages
   */
  approvalProgramPages(a: internal.primitives.StubUint64Compat): bytes {
    return getActiveTransaction<gtxn.ApplicationTxn>().approvalProgramPages(asUint64(a))
  },

  /**
   * Number of Approval Program pages
   */
  get numApprovalProgramPages(): uint64 {
    return getActiveTransaction<gtxn.ApplicationTxn>().numApprovalProgramPages
  },

  /**
   * ClearState Program as an array of pages
   */
  clearStateProgramPages(a: internal.primitives.StubUint64Compat): bytes {
    return getActiveTransaction<gtxn.ApplicationTxn>().clearStateProgramPages(asUint64(a))
  },

  /**
   * Number of ClearState Program pages
   */
  get numClearStateProgramPages(): uint64 {
    return getActiveTransaction<gtxn.ApplicationTxn>().numClearStateProgramPages
  },
}
