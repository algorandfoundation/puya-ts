import { NoImplementation } from './internal/errors'
import { uint64 } from './primitives'
import type * as txnTypes from './transactions'

const isGtxn = Symbol('isGtxn')
export interface PaymentTxn extends txnTypes.PaymentTxn {
  /** @hidden */
  [isGtxn]?: true
}
export interface KeyRegistrationTxn extends txnTypes.KeyRegistrationTxn {
  /** @hidden */
  [isGtxn]?: true
}
export interface AssetConfigTxn extends txnTypes.AssetConfigTxn {
  /** @hidden */
  [isGtxn]?: true
}
export interface AssetTransferTxn extends txnTypes.AssetTransferTxn {
  /** @hidden */
  [isGtxn]?: true
}
export interface AssetFreezeTxn extends txnTypes.AssetFreezeTxn {
  /** @hidden */
  [isGtxn]?: true
}
export interface ApplicationTxn extends txnTypes.ApplicationTxn {
  /** @hidden */
  [isGtxn]?: true
}

export type Transaction = PaymentTxn | KeyRegistrationTxn | AssetConfigTxn | AssetTransferTxn | AssetFreezeTxn | ApplicationTxn

export function Transaction(groupIndex: uint64): Transaction {
  throw new NoImplementation()
}
export function PaymentTxn(groupIndex: uint64): PaymentTxn {
  throw new NoImplementation()
}
export function KeyRegistrationTxn(groupIndex: uint64): KeyRegistrationTxn {
  throw new NoImplementation()
}
export function AssetConfigTxn(groupIndex: uint64): AssetConfigTxn {
  throw new NoImplementation()
}
export function AssetTransferTxn(groupIndex: uint64): AssetTransferTxn {
  throw new NoImplementation()
}
export function AssetFreezeTxn(groupIndex: uint64): AssetFreezeTxn {
  throw new NoImplementation()
}
export function ApplicationTxn(groupIndex: uint64): ApplicationTxn {
  throw new NoImplementation()
}
