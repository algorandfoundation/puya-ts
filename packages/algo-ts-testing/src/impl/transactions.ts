import { Account, Application, Asset, bytes, Bytes, gtxn, internal, TransactionType, uint64, Uint64 } from '@algorandfoundation/algo-ts'
import { OnCompleteActionStr } from '@algorandfoundation/algo-ts/arc4'
import { MAX_ITEMS_IN_LOG } from '../constants'
import { lazyContext } from '../context-helpers/internal-context'
import { Mutable, ObjectKeys } from '../typescript-helpers'
import { asBytes, asNumber, getRandomBytes } from '../util'

const baseDefaultFields = () => ({
  sender: lazyContext.defaultSender,
  fee: Uint64(0),
  firstValid: Uint64(0),
  firstValidTime: Uint64(0),
  lastValid: Uint64(0),
  note: Bytes(),
  lease: Bytes(),
  typeBytes: Bytes(),
  groupIndex: Uint64(0),
  txnId: getRandomBytes(32).asAlgoTs(),
  rekeyTo: Account(),
})

export type TxnFields<TTxn> = Partial<Mutable<Pick<TTxn, ObjectKeys<TTxn>>>>

abstract class TransactionBase {
  protected constructor(fields: Partial<ReturnType<typeof baseDefaultFields>>) {
    const baseDefaults = baseDefaultFields()
    this.sender = fields.sender ?? baseDefaults.sender
    this.fee = fields.fee ?? baseDefaults.fee
    this.firstValid = fields.firstValid ?? baseDefaults.firstValid
    this.firstValidTime = fields.firstValidTime ?? baseDefaults.firstValidTime
    this.lastValid = fields.lastValid ?? baseDefaults.lastValid
    this.note = fields.note ?? baseDefaults.note
    this.lease = fields.lease ?? baseDefaults.lease
    this.typeBytes = fields.typeBytes ?? baseDefaults.typeBytes
    this.groupIndex = fields.groupIndex ?? baseDefaults.groupIndex
    this.txnId = fields.txnId ?? baseDefaults.txnId
    this.rekeyTo = fields.rekeyTo ?? baseDefaults.rekeyTo
  }

  readonly sender: Account
  readonly fee: uint64
  readonly firstValid: uint64
  readonly firstValidTime: uint64
  readonly lastValid: uint64
  readonly note: bytes
  readonly lease: bytes
  readonly typeBytes: bytes
  readonly groupIndex: uint64
  readonly txnId: bytes
  readonly rekeyTo: Account
}

export class PaymentTransaction extends TransactionBase implements gtxn.PaymentTxn {
  /* @internal */
  static create(fields: TxnFields<gtxn.PaymentTxn>) {
    return new PaymentTransaction(fields)
  }

  private constructor(fields: TxnFields<gtxn.PaymentTxn>) {
    super(fields)
    this.receiver = fields.receiver ?? Account()
    this.amount = fields.amount ?? Uint64(0)
    this.closeRemainderTo = fields.closeRemainderTo ?? Account()
  }

  readonly receiver: Account
  readonly amount: uint64
  readonly closeRemainderTo: Account
  readonly type: TransactionType.Payment = TransactionType.Payment
}

export class KeyRegistrationTransaction extends TransactionBase implements gtxn.KeyRegistrationTxn {
  /* @internal */
  static create(fields: TxnFields<gtxn.KeyRegistrationTxn>) {
    return new KeyRegistrationTransaction(fields)
  }

  private constructor(fields: TxnFields<gtxn.KeyRegistrationTxn>) {
    super(fields)
    this.voteKey = fields.voteKey ?? Bytes()
    this.selectionKey = fields.selectionKey ?? Bytes()
    this.voteFirst = fields.voteFirst ?? Uint64(0)
    this.voteLast = fields.voteLast ?? Uint64(0)
    this.voteKeyDilution = fields.voteKeyDilution ?? Uint64(0)
    this.nonparticipation = fields.nonparticipation ?? false
    this.stateProofKey = fields.stateProofKey ?? Bytes()
  }

  readonly voteKey: bytes
  readonly selectionKey: bytes
  readonly voteFirst: uint64
  readonly voteLast: uint64
  readonly voteKeyDilution: uint64
  readonly nonparticipation: boolean
  readonly stateProofKey: bytes
  readonly type: TransactionType.KeyRegistration = TransactionType.KeyRegistration
}

export class AssetConfigTransaction extends TransactionBase implements gtxn.AssetConfigTxn {
  /* @internal */
  static create(fields: TxnFields<gtxn.AssetConfigTxn>) {
    return new AssetConfigTransaction(fields)
  }

  private constructor(fields: TxnFields<gtxn.AssetConfigTxn>) {
    super(fields)
    this.configAsset = fields.configAsset ?? Asset()
    this.total = fields.total ?? Uint64(0)
    this.decimals = fields.decimals ?? Uint64(0)
    this.defaultFrozen = fields.defaultFrozen ?? false
    this.unitName = fields.unitName ?? Bytes()
    this.assetName = fields.assetName ?? Bytes()
    this.url = fields.url ?? Bytes()
    this.metadataHash = fields.metadataHash ?? Bytes()
    this.manager = fields.manager ?? Account()
    this.reserve = fields.reserve ?? Account()
    this.freeze = fields.freeze ?? Account()
    this.clawback = fields.clawback ?? Account()
    this.createdAsset = fields.createdAsset ?? Asset()
  }

  readonly configAsset: Asset
  readonly total: uint64
  readonly decimals: uint64
  readonly defaultFrozen: boolean
  readonly unitName: bytes
  readonly assetName: bytes
  readonly url: bytes
  readonly metadataHash: bytes
  readonly manager: Account
  readonly reserve: Account
  readonly freeze: Account
  readonly clawback: Account
  readonly createdAsset: Asset
  readonly type: TransactionType.AssetConfig = TransactionType.AssetConfig
}

export class AssetTransferTransaction extends TransactionBase implements gtxn.AssetTransferTxn {
  /* @internal */
  static create(fields: TxnFields<gtxn.AssetTransferTxn>) {
    return new AssetTransferTransaction(fields)
  }

  private constructor(fields: TxnFields<gtxn.AssetTransferTxn>) {
    super(fields)
    this.xferAsset = fields.xferAsset ?? Asset()
    this.assetAmount = fields.assetAmount ?? Uint64(0)
    this.assetSender = fields.assetSender ?? Account()
    this.assetReceiver = fields.assetReceiver ?? Account()
    this.assetCloseTo = fields.assetCloseTo ?? Account()
  }

  readonly xferAsset: Asset
  readonly assetAmount: uint64
  readonly assetSender: Account
  readonly assetReceiver: Account
  readonly assetCloseTo: Account

  readonly type: TransactionType.AssetTransfer = TransactionType.AssetTransfer
}

export class AssetFreezeTransaction extends TransactionBase implements gtxn.AssetFreezeTxn {
  /* @internal */
  static create(fields: TxnFields<gtxn.AssetFreezeTxn>) {
    return new AssetFreezeTransaction(fields)
  }

  private constructor(fields: TxnFields<gtxn.AssetFreezeTxn>) {
    super(fields)
    this.freezeAsset = fields.freezeAsset ?? Asset()
    this.freezeAccount = fields.freezeAccount ?? Account()
    this.frozen = fields.frozen ?? false
  }

  readonly freezeAsset: Asset
  readonly freezeAccount: Account
  readonly frozen: boolean

  readonly type: TransactionType.AssetFreeze = TransactionType.AssetFreeze
}

export type ApplicationTransactionFields = TxnFields<gtxn.ApplicationTxn> &
  Partial<{
    appArgs: Array<bytes>
    accounts: Array<Account>
    assets: Array<Asset>
    apps: Array<Application>
    approvalProgramPages: Array<bytes>
    clearStateProgramPages: Array<bytes>
    appLogs: Array<bytes>
  }>

export class ApplicationTransaction extends TransactionBase implements gtxn.ApplicationTxn {
  /* @internal */
  static create(fields: ApplicationTransactionFields) {
    return new ApplicationTransaction(fields)
  }
  #appArgs: Array<bytes>
  #accounts: Array<Account>
  #assets: Array<Asset>
  #apps: Array<Application>
  #approvalProgramPages: Array<bytes>
  #clearStateProgramPages: Array<bytes>
  #appLogs: Array<bytes>

  private constructor(fields: ApplicationTransactionFields) {
    super(fields)
    this.appId = fields.appId ?? Application()
    this.onCompletion = fields.onCompletion ?? 'NoOp'
    this.globalNumUint = fields.globalNumUint ?? Uint64(0)
    this.globalNumBytes = fields.globalNumBytes ?? Uint64(0)
    this.localNumUint = fields.localNumUint ?? Uint64(0)
    this.localNumBytes = fields.localNumBytes ?? Uint64(0)
    this.extraProgramPages = fields.extraProgramPages ?? Uint64(0)
    this.createdApp = fields.createdApp ?? Application()
    this.#appArgs = fields.appArgs ?? []
    this.#appLogs = fields.appLogs ?? []
    this.#accounts = fields.accounts ?? []
    this.#assets = fields.assets ?? []
    this.#apps = fields.apps ?? []
    this.#approvalProgramPages = fields.approvalProgramPages ?? (fields.approvalProgram ? [fields.approvalProgram] : [])
    this.#clearStateProgramPages = fields.clearStateProgramPages ?? (fields.clearStateProgram ? [fields.clearStateProgram] : [])
  }

  readonly appId: Application
  readonly onCompletion: OnCompleteActionStr
  readonly globalNumUint: uint64
  readonly globalNumBytes: uint64
  readonly localNumUint: uint64
  readonly localNumBytes: uint64
  readonly extraProgramPages: uint64
  readonly createdApp: Application
  get approvalProgram() {
    return this.approvalProgramPages(0)
  }
  get clearStateProgram() {
    return this.clearStateProgramPages(0)
  }
  get numAppArgs() {
    return Uint64(this.#appArgs.length)
  }
  get numAccounts() {
    return Uint64(this.#accounts.length)
  }
  get numAssets() {
    return Uint64(this.#assets.length)
  }
  get numApps() {
    return Uint64(this.#apps.length)
  }
  get numApprovalProgramPages() {
    return Uint64(this.#approvalProgramPages.length)
  }
  get numClearStateProgramPages() {
    return Uint64(this.#clearStateProgramPages.length)
  }
  get numLogs() {
    return Uint64(this.#appLogs.length || lazyContext.getApplicationData(this.appId.id).appLogs.length)
  }
  get lastLog() {
    return this.#appLogs.at(-1) ?? lazyContext.getApplicationData(this.appId.id).appLogs.at(-1) ?? Bytes()
  }
  appArgs(index: internal.primitives.StubUint64Compat): bytes {
    return this.#appArgs[asNumber(index)]
  }
  accounts(index: internal.primitives.StubUint64Compat): Account {
    return this.#accounts[asNumber(index)]
  }
  assets(index: internal.primitives.StubUint64Compat): Asset {
    return this.#assets[asNumber(index)]
  }
  apps(index: internal.primitives.StubUint64Compat): Application {
    return this.#apps[asNumber(index)]
  }
  approvalProgramPages(index: internal.primitives.StubUint64Compat): bytes {
    return this.#approvalProgramPages[asNumber(index)]
  }
  clearStateProgramPages(index: internal.primitives.StubUint64Compat): bytes {
    return this.#clearStateProgramPages[asNumber(index)]
  }
  logs(index: internal.primitives.StubUint64Compat): bytes {
    const i = asNumber(index)
    return this.#appLogs[i] ?? lazyContext.getApplicationData(this.appId.id).appLogs ?? Bytes()
  }
  readonly type: TransactionType.ApplicationCall = TransactionType.ApplicationCall

  /* @internal */
  get appLogs() {
    return this.#appLogs
  }
  /* @internal */
  appendLog(value: internal.primitives.StubBytesCompat): void {
    if (this.#appLogs.length + 1 > MAX_ITEMS_IN_LOG) {
      throw internal.errors.internalError(`Too many log calls in program, up to ${MAX_ITEMS_IN_LOG} is allowed`)
    }
    this.#appLogs.push(asBytes(value))
  }
}

export type Transaction =
  | PaymentTransaction
  | KeyRegistrationTransaction
  | AssetConfigTransaction
  | AssetTransferTransaction
  | AssetFreezeTransaction
  | ApplicationTransaction

export type AllTransactionFields = TxnFields<gtxn.PaymentTxn> &
  TxnFields<gtxn.KeyRegistrationTxn> &
  TxnFields<gtxn.AssetConfigTxn> &
  TxnFields<gtxn.AssetTransferTxn> &
  TxnFields<gtxn.AssetFreezeTxn> &
  ApplicationTransactionFields
