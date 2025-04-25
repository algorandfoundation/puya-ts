import { Contract, TypedApplicationCallFields } from './arc4'
import { NoImplementation } from './internal/errors'
import { DeliberateAny, InstanceMethod } from './internal/typescript-helpers'
import * as itxn from './itxn'
import { TransactionType } from './transactions'

export interface PaymentComposeFields extends itxn.PaymentFields {
  type: TransactionType.Payment
}
export interface KeyRegistrationComposeFields extends itxn.KeyRegistrationFields {
  type: TransactionType.KeyRegistration
}
export interface AssetConfigComposeFields extends itxn.AssetConfigFields {
  type: TransactionType.AssetConfig
}
export interface AssetTransferComposeFields extends itxn.AssetTransferFields {
  type: TransactionType.AssetTransfer
}
export interface AssetFreezeComposeFields extends itxn.AssetFreezeFields {
  type: TransactionType.AssetFreeze
}
export interface ApplicationCallComposeFields extends itxn.ApplicationCallFields {
  type: TransactionType.ApplicationCall
}

export interface AnyTransactionComposeFields
  extends itxn.PaymentFields,
    itxn.KeyRegistrationFields,
    itxn.AssetConfigFields,
    itxn.AssetTransferFields,
    itxn.AssetFreezeFields,
    itxn.ApplicationCallFields {
  type: TransactionType
}

export type ComposeItxnParams =
  | itxn.PaymentItxnParams
  | itxn.KeyRegistrationItxnParams
  | itxn.AssetConfigItxnParams
  | itxn.AssetTransferItxnParams
  | itxn.AssetFreezeItxnParams
  | itxn.ApplicationCallItxnParams

export type ItxnCompose = {
  begin(fields: PaymentComposeFields): void
  begin(fields: KeyRegistrationComposeFields): void
  begin(fields: AssetConfigComposeFields): void
  begin(fields: AssetTransferComposeFields): void
  begin(fields: AssetFreezeComposeFields): void
  begin(fields: ApplicationCallComposeFields): void
  begin(fields: AnyTransactionComposeFields): void
  begin(fields: ComposeItxnParams): void
  begin<TArgs extends DeliberateAny[]>(method: InstanceMethod<Contract, TArgs>, fields: TypedApplicationCallFields<TArgs>): void

  next(fields: PaymentComposeFields): void
  next(fields: KeyRegistrationComposeFields): void
  next(fields: AssetConfigComposeFields): void
  next(fields: AssetTransferComposeFields): void
  next(fields: AssetFreezeComposeFields): void
  next(fields: ApplicationCallComposeFields): void
  next(fields: AnyTransactionComposeFields): void
  next(fields: ComposeItxnParams): void
  next<TArgs extends DeliberateAny[]>(method: InstanceMethod<Contract, TArgs>, fields: TypedApplicationCallFields<TArgs>): void

  submit(): void
}

export const itxnCompose: ItxnCompose = NoImplementation.value()
