import { OnCompleteAction } from './arc4'
import { NoImplementation } from './internal/errors'
import { bytes, uint64 } from './primitives'
import type { Account, Application, Asset } from './reference'
import type * as txnTypes from './transactions'

const isItxn = Symbol('isItxn')

export interface PaymentInnerTxn extends txnTypes.PaymentTxn {
  /** @hidden */
  [isItxn]?: true
}
export interface KeyRegistrationInnerTxn extends txnTypes.KeyRegistrationTxn {
  /** @hidden */
  [isItxn]?: true
}
export interface AssetConfigInnerTxn extends txnTypes.AssetConfigTxn {
  /** @hidden */
  [isItxn]?: true
}
export interface AssetTransferInnerTxn extends txnTypes.AssetTransferTxn {
  /** @hidden */
  [isItxn]?: true
}
export interface AssetFreezeInnerTxn extends txnTypes.AssetFreezeTxn {
  /** @hidden */
  [isItxn]?: true
}
export interface ApplicationInnerTxn extends txnTypes.ApplicationTxn {
  /** @hidden */
  [isItxn]?: true
}

type AccountInput = Account | bytes
type AssetInput = Asset | uint64
type ApplicationInput = Application | uint64

export interface CommonTransactionFields {
  /**
   * 32 byte address
   */
  sender?: AccountInput

  /**
   * microalgos
   */
  fee?: uint64

  /**
   * round number
   */
  firstValid?: uint64

  /**
   * UNIX timestamp of block before txn.FirstValid. Fails if negative
   */
  firstValidTime?: uint64

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
  rekeyTo?: AccountInput
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
  receiver?: AccountInput
  /**
   * If set, bring the sender balance to 0 and send all remaining balance to this address
   */
  closeRemainderTo?: AccountInput
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
  xferAsset: AssetInput
  /** The amount of the asset being transferred */
  assetAmount?: uint64
  /** The clawback target */
  assetSender?: AccountInput
  /** The receiver of the asset */
  assetReceiver?: AccountInput
  /** The address to close the asset to */
  assetCloseTo?: AccountInput
}
export interface AssetConfigFields extends CommonTransactionFields {
  configAsset?: AssetInput
  manager?: AccountInput
  reserve?: AccountInput
  freeze?: AccountInput
  clawback?: AccountInput
  assetName?: string | bytes
  unitName?: string | bytes
  total?: uint64
  decimals?: uint64
  defaultFrozen?: boolean
  url?: string | bytes
  metadataHash?: bytes
}
export interface AssetFreezeFields extends CommonTransactionFields {
  freezeAsset: AssetInput
  freezeAccount?: AccountInput
  frozen?: boolean
}
export interface ApplicationCallFields extends CommonTransactionFields {
  appId?: ApplicationInput
  approvalProgram?: bytes | readonly [...bytes[]]
  clearStateProgram?: bytes | readonly [...bytes[]]
  onCompletion?: OnCompleteAction | uint64
  globalNumUint?: uint64
  globalNumBytes?: uint64
  localNumUint?: uint64
  localNumBytes?: uint64
  extraProgramPages?: uint64
  appArgs?: readonly [...unknown[]]
  accounts?: readonly [...AccountInput[]]
  assets?: readonly [...AssetInput[]]
  apps?: readonly [...ApplicationInput[]]
}

export type InnerTransaction =
  | PaymentItxnParams
  | KeyRegistrationItxnParams
  | AssetConfigItxnParams
  | AssetTransferItxnParams
  | AssetFreezeItxnParams
  | ApplicationCallItxnParams

export type InnerTxnList = [...InnerTransaction[]]

export type TxnFor<TFields extends InnerTxnList> = TFields extends [{ submit(): infer TTxn }, ...infer TRest extends InnerTxnList]
  ? [TTxn, ...TxnFor<TRest>]
  : []

export interface PaymentItxnParams {
  submit(): PaymentInnerTxn
  set(p: Partial<PaymentFields>): void
  copy(): PaymentItxnParams
}
export interface KeyRegistrationItxnParams {
  submit(): KeyRegistrationInnerTxn
  set(p: Partial<KeyRegistrationFields>): void
  copy(): KeyRegistrationItxnParams
}
export interface AssetConfigItxnParams {
  submit(): AssetConfigInnerTxn
  set(p: Partial<AssetConfigFields>): void
  copy(): AssetConfigItxnParams
}
export interface AssetTransferItxnParams {
  submit(): AssetTransferInnerTxn
  set(p: Partial<AssetTransferFields>): void
  copy(): AssetTransferItxnParams
}
export interface AssetFreezeItxnParams {
  submit(): AssetFreezeInnerTxn
  set(p: Partial<AssetFreezeFields>): void
  copy(): AssetFreezeItxnParams
}
export interface ApplicationCallItxnParams {
  submit(): ApplicationInnerTxn
  set(p: Partial<ApplicationCallFields>): void
  copy(): ApplicationCallItxnParams
}

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
