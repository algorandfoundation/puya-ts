import { uint64 } from './primitives'

import type * as txnTypes from './transactions'

export interface PayTxn extends txnTypes.PayTxn {}
export interface KeyRegistrationTxn extends txnTypes.KeyRegistrationTxn {}
export interface AssetConfigTxn extends txnTypes.AssetConfigTxn {}
export interface AssetTransferTxn extends txnTypes.AssetTransferTxn {}
export interface AssetFreezeTxn extends txnTypes.AssetFreezeTxn {}
export interface ApplicationTxn extends txnTypes.ApplicationTxn {}
export type Transaction = PayTxn | KeyRegistrationTxn | AssetConfigTxn | AssetTransferTxn | AssetFreezeTxn | ApplicationTxn

export function Transaction(groupIndex: uint64): Transaction {
  throw new Error('Not implemented')
}
export function PayTxn(groupIndex: uint64): PayTxn {
  throw new Error('Not implemented')
}
export function KeyRegistrationTxn(groupIndex: uint64): KeyRegistrationTxn {
  throw new Error('Not implemented')
}
export function AssetConfigTxn(groupIndex: uint64): AssetConfigTxn {
  throw new Error('Not implemented')
}
export function AssetTransferTxn(groupIndex: uint64): AssetTransferTxn {
  throw new Error('Not implemented')
}
export function AssetFreezeTxn(groupIndex: uint64): AssetFreezeTxn {
  throw new Error('Not implemented')
}
export function ApplicationTxn(groupIndex: uint64): ApplicationTxn {
  throw new Error('Not implemented')
}
