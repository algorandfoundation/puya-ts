import { OnCompleteAction } from './arc4'
import { NoImplementation } from './impl/errors'
import { bytes, uint64 } from './primitives'
import type { Account, Application, Asset } from './reference'
import type * as txnTypes from './transactions'
import { DeliberateAny } from './typescript-helpers'

const isItxn = Symbol('isItxn')

export interface PaymentInnerTxn extends txnTypes.PaymentTxn {
  [isItxn]?: true
}
export interface KeyRegistrationInnerTxn extends txnTypes.KeyRegistrationTxn {
  [isItxn]?: true
}
export interface AssetConfigInnerTxn extends txnTypes.AssetConfigTxn {
  [isItxn]?: true
}
export interface AssetTransferInnerTxn extends txnTypes.AssetTransferTxn {
  [isItxn]?: true
}
export interface AssetFreezeInnerTxn extends txnTypes.AssetFreezeTxn {
  [isItxn]?: true
}
export interface ApplicationInnerTxn extends txnTypes.ApplicationTxn {
  [isItxn]?: true
}

export interface CommonTransactionFields {
  /**
   * 32 byte address
   */
  sender?: Account | string

  /**
   * microalgos
   */
  fee?: uint64

  /**
   * Any data up to 1024 bytes
   */
  note?: bytes | string

  /**
   * 32 byte lease value
   */
  lease?: bytes

  /**
   * 32 byte Sender's new AuthAddr
   */
  rekeyTo?: Account | string
}

export interface PaymentFields extends CommonTransactionFields {
  /**
   * The amount, in microALGO, to transfer
   *
   */
  amount?: uint64
  /**
   *  The address of the receiver
   */
  receiver?: Account
  /**
   * If set, bring the sender balance to 0 and send all remaining balance to this address
   */
  closeRemainderTo?: Account
}
export interface KeyRegistrationFields extends CommonTransactionFields {
  /**
   * 32 byte address
   */
  voteKey?: bytes

  /**
   * 32 byte address
   */
  selectionKey?: bytes

  /**
   * The first round that the participation key is valid.
   */
  voteFirst?: uint64

  /**
   * The last round that the participation key is valid.
   */
  voteLast?: uint64

  /**
   * Dilution for the 2-level participation key
   */
  voteKeyDilution?: uint64

  /**
   * Marks an account nonparticipating for rewards
   */
  nonparticipation?: boolean

  /**
   * 64 byte state proof public key
   */
  stateProofKey?: bytes
}
export interface AssetTransferFields extends CommonTransactionFields {
  /** The asset being transferred */
  xferAsset: Asset
  /** The amount of the asset being transferred */
  assetAmount?: uint64
  /** The clawback target */
  assetSender?: Account
  /** The receiver of the asset */
  assetReceiver?: Account
  /** The address to close the asset to */
  assetCloseTo?: Account
}
export interface AssetConfigFields extends CommonTransactionFields {
  configAsset?: Asset
  manager?: Account
  reserve?: Account
  freeze?: Account
  clawback?: Account
  assetName?: string | bytes
  unitName?: string | bytes
  total?: uint64
  decimals?: uint64
  defaultFrozen?: boolean
  url?: string | bytes
  metadataHash?: bytes
}
export interface AssetFreezeFields extends CommonTransactionFields {
  freezeAsset: Asset | uint64
  freezeAccount?: Account | string
  frozen?: boolean
}
export interface ApplicationCallFields extends CommonTransactionFields {
  appId?: Application | uint64
  approvalProgram?: bytes | readonly [...bytes[]]
  clearStateProgram?: bytes | readonly [...bytes[]]
  onCompletion?: OnCompleteAction | uint64
  globalNumUint?: uint64
  globalNumBytes?: uint64
  localNumUint?: uint64
  localNumBytes?: uint64
  extraProgramPages?: uint64
  appArgs?: readonly [...unknown[]]
  accounts?: readonly [...Account[]]
  assets?: readonly [...Asset[]]
  apps?: readonly [...Application[]]
}

export type InnerTransaction<TFields, TTransaction> = {
  submit(): TTransaction
  set(p: Partial<TFields>): void
  copy(): InnerTransaction<TFields, TTransaction>
}

export type InnerTxnList = [...InnerTransaction<DeliberateAny, DeliberateAny>[]]

export type TxnFor<TFields extends InnerTxnList> = TFields extends [
  InnerTransaction<DeliberateAny, infer TTxn>,
  ...infer TRest extends InnerTxnList,
]
  ? [TTxn, ...TxnFor<TRest>]
  : []

export type PaymentItxnParams = InnerTransaction<PaymentFields, PaymentInnerTxn>
export type KeyRegistrationItxnParams = InnerTransaction<KeyRegistrationFields, KeyRegistrationInnerTxn>
export type AssetConfigItxnParams = InnerTransaction<AssetConfigFields, AssetConfigInnerTxn>
export type AssetTransferItxnParams = InnerTransaction<AssetTransferFields, AssetTransferInnerTxn>
export type AssetFreezeItxnParams = InnerTransaction<AssetFreezeFields, AssetFreezeInnerTxn>
export type ApplicationCallItxnParams = InnerTransaction<ApplicationCallFields, ApplicationInnerTxn>

export function submitGroup<TFields extends InnerTxnList>(...transactionFields: TFields): TxnFor<TFields> {
  throw new NoImplementation()
}
export function payment(fields: PaymentFields): PaymentItxnParams {
  throw new NoImplementation()
}
export function keyRegistration(fields: KeyRegistrationFields): KeyRegistrationItxnParams {
  throw new NoImplementation()
}
export function assetConfig(fields: AssetConfigFields): AssetConfigItxnParams {
  throw new NoImplementation()
}
export function assetTransfer(fields: AssetTransferFields): AssetTransferItxnParams {
  throw new NoImplementation()
}
export function assetFreeze(fields: AssetFreezeFields): AssetFreezeItxnParams {
  throw new NoImplementation()
}
export function applicationCall(fields: ApplicationCallFields): ApplicationCallItxnParams {
  throw new NoImplementation()
}
