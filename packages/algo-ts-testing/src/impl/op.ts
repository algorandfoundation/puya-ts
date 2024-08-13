import { Account, Application, Asset, Bytes, bytes, gtxn, internal, Uint64, uint64 } from '@algorandfoundation/algo-ts'
import { getTestExecutionContext } from '../util'

export const GTxn: internal.opTypes.GTxnType = {
  sender(_t: uint64): Account {
    throw new Error('TODO')
  },
  fee(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  firstValid(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  firstValidTime(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  lastValid(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  note(_t: uint64): bytes {
    throw new Error('TODO')
  },
  lease(_t: uint64): bytes {
    throw new Error('TODO')
  },
  receiver(_t: uint64): Account {
    throw new Error('TODO')
  },
  amount(t: uint64): uint64 {
    const i = internal.primitives.Uint64Cls.getNumber(t)
    const context = getTestExecutionContext()
    const currentTransactionGroup = context.txn.activeGroup.transactions
    return (currentTransactionGroup[i] as gtxn.PayTxn).amount
  },
  closeRemainderTo(_t: uint64): Account {
    throw new Error('TODO')
  },
  votePk(_t: uint64): bytes {
    throw new Error('TODO')
  },
  selectionPk(_t: uint64): bytes {
    throw new Error('TODO')
  },
  voteFirst(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  voteLast(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  voteKeyDilution(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  type(_t: uint64): bytes {
    throw new Error('TODO')
  },
  typeEnum(t: uint64): uint64 {
    const i = internal.primitives.Uint64Cls.getNumber(t)
    const context = getTestExecutionContext()
    const currentTransactionGroup = context.txn.activeGroup.transactions
    return currentTransactionGroup[i].type
  },
  xferAsset(_t: uint64): Asset {
    throw new Error('TODO')
  },
  assetAmount(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  assetSender(_t: uint64): Account {
    throw new Error('TODO')
  },
  assetReceiver(_t: uint64): Account {
    throw new Error('TODO')
  },
  assetCloseTo(_t: uint64): Account {
    throw new Error('TODO')
  },
  groupIndex(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  txId(_t: uint64): bytes {
    throw new Error('TODO')
  },
  applicationId(_t: uint64): Application {
    throw new Error('TODO')
  },
  onCompletion(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  applicationArgs(_a: uint64, _b: uint64): bytes {
    throw new Error('TODO')
  },
  numAppArgs(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  accounts(_a: uint64, _b: uint64): Account {
    throw new Error('TODO')
  },
  numAccounts(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  approvalProgram(_t: uint64): bytes {
    throw new Error('TODO')
  },
  clearStateProgram(_t: uint64): bytes {
    throw new Error('TODO')
  },
  rekeyTo(_t: uint64): Account {
    throw new Error('TODO')
  },
  configAsset(_t: uint64): Asset {
    throw new Error('TODO')
  },
  configAssetTotal(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  configAssetDecimals(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  configAssetDefaultFrozen(_t: uint64): boolean {
    throw new Error('TODO')
  },
  configAssetUnitName(_t: uint64): bytes {
    throw new Error('TODO')
  },
  configAssetName(_t: uint64): bytes {
    throw new Error('TODO')
  },
  configAssetUrl(_t: uint64): bytes {
    throw new Error('TODO')
  },
  configAssetMetadataHash(_t: uint64): bytes {
    throw new Error('TODO')
  },
  configAssetManager(_t: uint64): Account {
    throw new Error('TODO')
  },
  configAssetReserve(_t: uint64): Account {
    throw new Error('TODO')
  },
  configAssetFreeze(_t: uint64): Account {
    throw new Error('TODO')
  },
  configAssetClawback(_t: uint64): Account {
    throw new Error('TODO')
  },
  freezeAsset(_t: uint64): Asset {
    throw new Error('TODO')
  },
  freezeAssetAccount(_t: uint64): Account {
    throw new Error('TODO')
  },
  freezeAssetFrozen(_t: uint64): boolean {
    throw new Error('TODO')
  },
  assets(_a: uint64, _b: uint64): Asset {
    throw new Error('TODO')
  },
  numAssets(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  applications(_a: uint64, _b: uint64): Application {
    throw new Error('TODO')
  },
  numApplications(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  globalNumUint(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  globalNumByteSlice(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  localNumUint(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  localNumByteSlice(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  extraProgramPages(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  nonparticipation(_t: uint64): boolean {
    throw new Error('TODO')
  },
  logs(_a: uint64, _b: uint64): bytes {
    throw new Error('TODO')
  },
  numLogs(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  createdAssetId(_t: uint64): Asset {
    throw new Error('TODO')
  },
  createdApplicationId(_t: uint64): Application {
    throw new Error('TODO')
  },
  lastLog(_t: uint64): bytes {
    throw new Error('TODO')
  },
  stateProofPk(_t: uint64): bytes {
    throw new Error('TODO')
  },
  approvalProgramPages(_a: uint64, _b: uint64): bytes {
    throw new Error('TODO')
  },
  numApprovalProgramPages(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  clearStateProgramPages(_a: uint64, _b: uint64): bytes {
    throw new Error('TODO')
  },
  numClearStateProgramPages(_t: uint64): uint64 {
    throw new Error('TODO')
  },
}

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

export const Global: internal.opTypes.GlobalType = {
  /**
   * microalgos
   */
  get minTxnFee(): uint64 {
    throw new Error('TODO')
  },

  /**
   * microalgos
   */
  get minBalance(): uint64 {
    throw new Error('TODO')
  },

  /**
   * rounds
   */
  get maxTxnLife(): uint64 {
    throw new Error('TODO')
  },

  /**
   * 32 byte address of all zero bytes
   */
  get zeroAddress(): Account {
    throw new Error('TODO')
  },

  /**
   * Number of transactions in this atomic transaction group. At least 1
   */
  get groupSize(): uint64 {
    const context = getTestExecutionContext()
    const currentTransactionGroup = context.txn.activeGroup.transactions
    return Uint64(currentTransactionGroup.length)
  },

  /**
   * Maximum supported version
   */
  get logicSigVersion(): uint64 {
    throw new Error('TODO')
  },

  /**
   * Current round number. Application mode only.
   */
  get round(): uint64 {
    throw new Error('TODO')
  },

  /**
   * Last confirmed block UNIX timestamp. Fails if negative. Application mode only.
   */
  get latestTimestamp(): uint64 {
    throw new Error('TODO')
  },

  /**
   * ID of current application executing. Application mode only.
   */
  get currentApplicationId(): Application {
    throw new Error('TODO')
  },

  /**
   * Address of the creator of the current application. Application mode only.
   */
  get creatorAddress(): Account {
    throw new Error('TODO')
  },

  /**
   * Address that the current application controls. Application mode only.
   */
  get currentApplicationAddress(): Account {
    throw new Error('TODO')
  },

  /**
   * ID of the transaction group. 32 zero bytes if the transaction is not part of a group.
   */
  get groupId(): bytes {
    throw new Error('TODO')
  },

  /**
   * The remaining cost that can be spent by opcodes in this program.
   */
  get opcodeBudget(): uint64 {
    throw new Error('TODO')
  },

  /**
   * The application ID of the application that called this application. 0 if this application is at the top-level. Application mode only.
   */
  get callerApplicationId(): uint64 {
    throw new Error('TODO')
  },

  /**
   * The application address of the application that called this application. ZeroAddress if this application is at the top-level. Application mode only.
   */
  get callerApplicationAddress(): Account {
    throw new Error('TODO')
  },

  /**
   * The additional minimum balance required to create (and opt-in to) an asset.
   */
  get assetCreateMinBalance(): uint64 {
    throw new Error('TODO')
  },

  /**
   * The additional minimum balance required to opt-in to an asset.
   */
  get assetOptInMinBalance(): uint64 {
    throw new Error('TODO')
  },

  /**
   * The Genesis Hash for the network.
   */
  get genesisHash(): bytes {
    throw new Error('TODO')
  },
}
