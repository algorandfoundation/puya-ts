import { uint64 } from './primitives'
import type * as txnTypes from './transactions'

const isGtxn = Symbol('isGtxn')
export interface PayTxn extends txnTypes.PayTxn {
  [isGtxn]?: true
}
export interface KeyRegistrationTxn extends txnTypes.KeyRegistrationTxn {
  [isGtxn]?: true
}
export interface AssetConfigTxn extends txnTypes.AssetConfigTxn {
  [isGtxn]?: true
}
export interface AssetTransferTxn extends txnTypes.AssetTransferTxn {
  [isGtxn]?: true
}
export interface AssetFreezeTxn extends txnTypes.AssetFreezeTxn {
  [isGtxn]?: true
}
export interface ApplicationTxn extends txnTypes.ApplicationTxn {
  [isGtxn]?: true
}

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
