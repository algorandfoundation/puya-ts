import { TransactionKind } from '../../../awst/models'
import type { GroupTransactionPType, InnerTransactionFieldsPType, InnerTransactionPType } from '../../ptypes'
import {
  anyGroupTransaction,
  applicationCallFieldsType,
  applicationCallItxnType,
  applicationGroupTransaction,
  assetConfigFieldsType,
  assetConfigGroupTransaction,
  assetConfigItxnType,
  assetFreezeFieldsType,
  assetFreezeGroupTransaction,
  assetFreezeItxnType,
  assetTransferFieldsType,
  assetTransferGroupTransaction,
  assetTransferItxnType,
  keyRegistrationFieldsType,
  keyRegistrationGroupTransaction,
  keyRegistrationItxnType,
  paymentFieldsType,
  paymentGroupTransaction,
  paymentItxnType,
} from '../../ptypes'

export function getInnerTransactionType(kind: TransactionKind | undefined): InnerTransactionPType {
  switch (kind) {
    case TransactionKind.Payment:
      return paymentItxnType
    case TransactionKind.KeyRegistration:
      return keyRegistrationItxnType
    case TransactionKind.AssetConfig:
      return assetConfigItxnType
    case TransactionKind.AssetTransfer:
      return assetTransferItxnType
    case TransactionKind.AssetFreeze:
      return assetFreezeItxnType
    case TransactionKind.Application:
      return applicationCallItxnType
    default:
      throw new Error('TODO')
    //return anyInnerTransaction
  }
}
export function getInnerTransactionFieldsType(kind: TransactionKind | undefined): InnerTransactionFieldsPType {
  switch (kind) {
    case TransactionKind.Payment:
      return paymentFieldsType
    case TransactionKind.KeyRegistration:
      return keyRegistrationFieldsType
    case TransactionKind.AssetConfig:
      return assetConfigFieldsType
    case TransactionKind.AssetTransfer:
      return assetTransferFieldsType
    case TransactionKind.AssetFreeze:
      return assetFreezeFieldsType
    case TransactionKind.Application:
      return applicationCallFieldsType
    default:
      throw new Error('TODO')
    //return anyInnerTransaction
  }
}
export function getGroupTransactionType(kind: TransactionKind | undefined): GroupTransactionPType {
  switch (kind) {
    case TransactionKind.Payment:
      return paymentGroupTransaction
    case TransactionKind.KeyRegistration:
      return keyRegistrationGroupTransaction
    case TransactionKind.AssetConfig:
      return assetConfigGroupTransaction
    case TransactionKind.AssetTransfer:
      return assetTransferGroupTransaction
    case TransactionKind.AssetFreeze:
      return assetFreezeGroupTransaction
    case TransactionKind.Application:
      return applicationGroupTransaction
    default:
      return anyGroupTransaction
  }
}
