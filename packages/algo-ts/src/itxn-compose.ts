import { AbiCallOptions, Contract, TypedApplicationCallFields } from './arc4'
import { NoImplementation } from './internal/errors'
import { DeliberateAny, InstanceMethod } from './internal/typescript-helpers'
import { itxn } from './itxn'
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
  extends
    itxn.PaymentFields,
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
  /**
   * Begin a transaction group with a payment transaction
   * @param fields Specifies any transaction fields which should differ from their defaults
   */
  begin(fields: PaymentComposeFields): void
  /**
   * Begin a transaction group with a key registration transaction
   * @param fields Specifies any transaction fields which should differ from their defaults
   */
  begin(fields: KeyRegistrationComposeFields): void
  /**
   * Begin a transaction group with an asset config transaction
   * @param fields Specifies any transaction fields which should differ from their defaults
   */
  begin(fields: AssetConfigComposeFields): void
  /**
   * Begin a transaction group with an asset transfer transaction
   * @param fields Specifies any transaction fields which should differ from their defaults
   */
  begin(fields: AssetTransferComposeFields): void
  /**
   * Begin a transaction group with an asset freeze transaction
   * @param fields Specifies any transaction fields which should differ from their defaults
   */
  begin(fields: AssetFreezeComposeFields): void
  /**
   * Begin a transaction group with an application call transaction
   * @param fields Specifies any transaction fields which should differ from their defaults
   */
  begin(fields: ApplicationCallComposeFields): void
  /**
   * Begin a transaction group with a new transaction with the specified fields
   * @param fields Specifies the type, and any transaction fields which should differ from their defaults
   */
  begin(fields: AnyTransactionComposeFields): void
  /**
   * Begin a transaction group with a new transaction from the specified itxn params object
   * @param fields
   */
  begin(fields: ComposeItxnParams): void
  /**
   * Begin a transaction group with a typed application call transaction.
   * @param method The ABI method to call
   * @param fields Specifies any transaction fields which should differ from their defaults
   *
   * @deprecated This overload has been deprecated in favour of the single arg overload where method is specified as a property of the fields
   * object, or via an explicit generic param. (`itxnCompose.begin({ method: MyContract.prototype.myMethod, ... })` or
   * `itxnCompose.begin<typeof MyContract.prototype.myMethod>({ ... })`)
   */
  begin<TArgs extends DeliberateAny[]>(method: InstanceMethod<Contract, TArgs>, fields: TypedApplicationCallFields<TArgs>): void
  /**
   * Begin a transaction group with a typed application call transaction. The method can be specified by options.method, or
   * by explicitly defining the type of the generic parameter TMethod.
   * @param options Specifies any transaction fields which should differ from their defaults
   * @typeParam TMethod  The type of an ARC4 method signature (eg. `typeof MyContract.prototype.myMethod`)
   */
  begin<TMethod>(options: AbiCallOptions<TMethod>): void

  /**
   * Continue a transaction group with a payment transaction
   * @param fields Specifies any transaction fields which should differ from their defaults
   */
  next(fields: PaymentComposeFields): void
  /**
   * Continue a transaction group with a key registration transaction
   * @param fields Specifies any transaction fields which should differ from their defaults
   */
  next(fields: KeyRegistrationComposeFields): void
  /**
   * Continue a transaction group with an asset config transaction
   * @param fields Specifies any transaction fields which should differ from their defaults
   */
  next(fields: AssetConfigComposeFields): void
  /**
   * Continue a transaction group with an asset transfer transaction
   * @param fields Specifies any transaction fields which should differ from their defaults
   */
  next(fields: AssetTransferComposeFields): void
  /**
   * Continue a transaction group with an asset freeze transaction
   * @param fields Specifies any transaction fields which should differ from their defaults
   */
  next(fields: AssetFreezeComposeFields): void
  /**
   * Continue a transaction group with an application call transaction
   * @param fields Specifies any transaction fields which should differ from their defaults
   */
  next(fields: ApplicationCallComposeFields): void
  /**
   * Continue a transaction group with a new transaction with the specified fields
   * @param fields Specifies the type, and any transaction fields which should differ from their defaults
   */
  next(fields: AnyTransactionComposeFields): void
  /**
   * Continue a transaction group with a new transaction from the specified itxn params object
   * @param fields
   */
  next(fields: ComposeItxnParams): void
  /**
   * Continue a transaction group with a typed application call transaction.
   * @param method The ABI method to call
   * @param fields Specifies any transaction fields which should differ from their defaults
   *
   * @deprecated This overload has been deprecated in favour of the single arg overload where method is specified as a property of the fields
   * object, or via an explicit generic param. (`itxnCompose.next({ method: MyContract.prototype.myMethod, ... })` or
   * `itxnCompose.next<typeof MyContract.prototype.myMethod>({ ... })`)
   */
  next<TArgs extends DeliberateAny[]>(method: InstanceMethod<Contract, TArgs>, fields: TypedApplicationCallFields<TArgs>): void
  /**
   * Continue a transaction group with a typed application call transaction. The method can be specified by options.method, or
   * by explicitly defining the type of the generic parameter TMethod.
   * @param options Specifies any transaction fields which should differ from their defaults
   * @typeParam TMethod  The type of an ARC4 method signature (eg. `typeof MyContract.prototype.myMethod`)
   */
  next<TMethod>(options: AbiCallOptions<TMethod>): void

  /**
   * Submit all transactions in the group
   *
   * @remarks `op.GITxn.lastLog(n)` (and other methods on the GITxn object) can be used to read fields from the most recently submitted
   * transaction group where `n` is a compile time constant representing the index of the transaction in the group.
   */
  submit(): void
}

/**
 * The itxnCompose helper can be used to build dynamically sized itxn groups which aren't supported by the stronger typed itxn paradigm. The
 * first transaction in a group must be 'staged' with `itxnCompose.begin` whilst all other transactions in the group should use `itxnCompose.next`.
 * When the group is complete it can be submitted using `itxnCompose.submit`.
 *
 * @remarks The itxn API offered by teal opcodes has some rough edges which are not fully abstracted over by this compose API, but it hoped that use
 * cases for it are limited and that most transaction groups can be composed with a static size relying on the atomic nature of the outer transaction
 * to ensure multiple smaller itxn groups are committed atomically.
 */
export const itxnCompose: ItxnCompose = NoImplementation.value()
