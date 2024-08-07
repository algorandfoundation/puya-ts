import { ctxMgr } from './execution-context'
import { BytesCls, StubBytesCompat, StubUint64Compat, Uint64Cls } from './impl/primitives'
import { BtoiType, Ed25519verifyBareType, GlobalType, GTxnType, ItobType, TxnType } from './op-types'
import { Bytes, bytes, Uint64, uint64 } from './primitives'
import { Account, Application, Asset } from './reference'
import { PayTxn, TransactionType } from './transactions'

export const btoi: BtoiType = (bytes: StubBytesCompat): uint64 => {
  return BytesCls.fromCompat(bytes).toUint64().asAlgoTs()
}
export const itob: ItobType = (value: StubUint64Compat): bytes => {
  return Uint64Cls.fromCompat(value).toBytes().asAlgoTs()
}
export const GTxn: GTxnType = {
  sender(t: uint64): Account {
    throw new Error('TODO')
  },
  fee(t: uint64): uint64 {
    throw new Error('TODO')
  },
  firstValid(t: uint64): uint64 {
    throw new Error('TODO')
  },
  firstValidTime(t: uint64): uint64 {
    throw new Error('TODO')
  },
  lastValid(t: uint64): uint64 {
    throw new Error('TODO')
  },
  note(t: uint64): bytes {
    throw new Error('TODO')
  },
  lease(t: uint64): bytes {
    throw new Error('TODO')
  },
  receiver(t: uint64): Account {
    throw new Error('TODO')
  },
  amount(t: uint64): uint64 {
    const i = Uint64Cls.getNumber(t)
    return (ctxMgr.instance.currentTransactionGroup[i] as PayTxn).amount
  },
  closeRemainderTo(t: uint64): Account {
    throw new Error('TODO')
  },
  votePk(t: uint64): bytes {
    throw new Error('TODO')
  },
  selectionPk(t: uint64): bytes {
    throw new Error('TODO')
  },
  voteFirst(t: uint64): uint64 {
    throw new Error('TODO')
  },
  voteLast(t: uint64): uint64 {
    throw new Error('TODO')
  },
  voteKeyDilution(t: uint64): uint64 {
    throw new Error('TODO')
  },
  type(t: uint64): bytes {
    throw new Error('TODO')
  },
  typeEnum(t: uint64): uint64 {
    const i = Uint64Cls.getNumber(t)
    return ctxMgr.instance.currentTransactionGroup[i].type
  },
  xferAsset(t: uint64): Asset {
    throw new Error('TODO')
  },
  assetAmount(t: uint64): uint64 {
    throw new Error('TODO')
  },
  assetSender(t: uint64): Account {
    throw new Error('TODO')
  },
  assetReceiver(t: uint64): Account {
    throw new Error('TODO')
  },
  assetCloseTo(t: uint64): Account {
    throw new Error('TODO')
  },
  groupIndex(t: uint64): uint64 {
    throw new Error('TODO')
  },
  txId(t: uint64): bytes {
    throw new Error('TODO')
  },
  applicationId(t: uint64): Application {
    throw new Error('TODO')
  },
  onCompletion(t: uint64): uint64 {
    throw new Error('TODO')
  },
  applicationArgs(a: uint64, b: uint64): bytes {
    throw new Error('TODO')
  },
  numAppArgs(t: uint64): uint64 {
    throw new Error('TODO')
  },
  accounts(a: uint64, b: uint64): Account {
    throw new Error('TODO')
  },
  numAccounts(t: uint64): uint64 {
    throw new Error('TODO')
  },
  approvalProgram(t: uint64): bytes {
    throw new Error('TODO')
  },
  clearStateProgram(t: uint64): bytes {
    throw new Error('TODO')
  },
  rekeyTo(t: uint64): Account {
    throw new Error('TODO')
  },
  configAsset(t: uint64): Asset {
    throw new Error('TODO')
  },
  configAssetTotal(t: uint64): uint64 {
    throw new Error('TODO')
  },
  configAssetDecimals(t: uint64): uint64 {
    throw new Error('TODO')
  },
  configAssetDefaultFrozen(t: uint64): boolean {
    throw new Error('TODO')
  },
  configAssetUnitName(t: uint64): bytes {
    throw new Error('TODO')
  },
  configAssetName(t: uint64): bytes {
    throw new Error('TODO')
  },
  configAssetUrl(t: uint64): bytes {
    throw new Error('TODO')
  },
  configAssetMetadataHash(t: uint64): bytes {
    throw new Error('TODO')
  },
  configAssetManager(t: uint64): Account {
    throw new Error('TODO')
  },
  configAssetReserve(t: uint64): Account {
    throw new Error('TODO')
  },
  configAssetFreeze(t: uint64): Account {
    throw new Error('TODO')
  },
  configAssetClawback(t: uint64): Account {
    throw new Error('TODO')
  },
  freezeAsset(t: uint64): Asset {
    throw new Error('TODO')
  },
  freezeAssetAccount(t: uint64): Account {
    throw new Error('TODO')
  },
  freezeAssetFrozen(t: uint64): boolean {
    throw new Error('TODO')
  },
  assets(a: uint64, b: uint64): Asset {
    throw new Error('TODO')
  },
  numAssets(t: uint64): uint64 {
    throw new Error('TODO')
  },
  applications(a: uint64, b: uint64): Application {
    throw new Error('TODO')
  },
  numApplications(t: uint64): uint64 {
    throw new Error('TODO')
  },
  globalNumUint(t: uint64): uint64 {
    throw new Error('TODO')
  },
  globalNumByteSlice(t: uint64): uint64 {
    throw new Error('TODO')
  },
  localNumUint(t: uint64): uint64 {
    throw new Error('TODO')
  },
  localNumByteSlice(t: uint64): uint64 {
    throw new Error('TODO')
  },
  extraProgramPages(t: uint64): uint64 {
    throw new Error('TODO')
  },
  nonparticipation(t: uint64): boolean {
    throw new Error('TODO')
  },
  logs(a: uint64, b: uint64): bytes {
    throw new Error('TODO')
  },
  numLogs(t: uint64): uint64 {
    throw new Error('TODO')
  },
  createdAssetId(t: uint64): Asset {
    throw new Error('TODO')
  },
  createdApplicationId(t: uint64): Application {
    throw new Error('TODO')
  },
  lastLog(t: uint64): bytes {
    throw new Error('TODO')
  },
  stateProofPk(t: uint64): bytes {
    throw new Error('TODO')
  },
  approvalProgramPages(a: uint64, b: uint64): bytes {
    throw new Error('TODO')
  },
  numApprovalProgramPages(t: uint64): uint64 {
    throw new Error('TODO')
  },
  clearStateProgramPages(a: uint64, b: uint64): bytes {
    throw new Error('TODO')
  },
  numClearStateProgramPages(t: uint64): uint64 {
    throw new Error('TODO')
  },
}
export const Txn: TxnType = {
  get sender(): Account {
    return ctxMgr.instance.currentTransaction.sender
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
    const currentTransaction = ctxMgr.instance.currentTransaction
    if (currentTransaction.type === TransactionType.ApplicationCall) {
      return currentTransaction.appArgs(Uint64Cls.getNumber(a))
    }
    return Bytes()
  },

  /**
   * Number of ApplicationArgs
   */
  get numAppArgs(): uint64 {
    const currentTransaction = ctxMgr.instance.currentTransaction
    if (currentTransaction.type === TransactionType.ApplicationCall) {
      return currentTransaction.numAppArgs
    }
    return Uint64(0)
  },

  /**
   * Accounts listed in the ApplicationCall transaction
   */
  accounts(a: uint64): Account {
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
  assets(a: uint64): Asset {
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
  applications(a: uint64): Application {
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
  logs(a: uint64): bytes {
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
  approvalProgramPages(a: uint64): bytes {
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
  clearStateProgramPages(a: uint64): bytes {
    throw new Error('TODO')
  },

  /**
   * Number of ClearState Program pages
   */
  get numClearStateProgramPages(): uint64 {
    throw new Error('TODO')
  },
}
export const Global: GlobalType = {
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
    return Uint64(ctxMgr.instance.currentTransactionGroup.length)
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
export const ed25519verifyBare: Ed25519verifyBareType = (a: bytes, b: bytes, c: bytes) => {
  throw new Error('TODO')
}
