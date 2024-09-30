import { ctxMgr } from './execution-context'
import { uint64 } from './primitives'
import type * as txnTypes from './transactions'

const isGtxn = Symbol('isGtxn')
export interface PaymentTxn extends txnTypes.PaymentTxn {
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

export type Transaction = PaymentTxn | KeyRegistrationTxn | AssetConfigTxn | AssetTransferTxn | AssetFreezeTxn | ApplicationTxn

export function Transaction(groupIndex: uint64): Transaction {
  return ctxMgr.instance.gtxn.Transaction(groupIndex)
}
export function PaymentTxn(groupIndex: uint64): PaymentTxn {
  return ctxMgr.instance.gtxn.PaymentTxn(groupIndex)
}
export function KeyRegistrationTxn(groupIndex: uint64): KeyRegistrationTxn {
  return ctxMgr.instance.gtxn.KeyRegistrationTxn(groupIndex)
}
export function AssetConfigTxn(groupIndex: uint64): AssetConfigTxn {
  return ctxMgr.instance.gtxn.AssetConfigTxn(groupIndex)
}
export function AssetTransferTxn(groupIndex: uint64): AssetTransferTxn {
  return ctxMgr.instance.gtxn.AssetTransferTxn(groupIndex)
}
export function AssetFreezeTxn(groupIndex: uint64): AssetFreezeTxn {
  return ctxMgr.instance.gtxn.AssetFreezeTxn(groupIndex)
}
export function ApplicationTxn(groupIndex: uint64): ApplicationTxn {
  return ctxMgr.instance.gtxn.ApplicationTxn(groupIndex)
}
