import { TransactionKind } from '../../../awst/models'
import type { GroupTransactionPType, InnerTransactionPType, ItxnParamsPType } from '../../ptypes'
import {
  anyGtxnType,
  applicationCallGtxnType,
  applicationCallItxnParamsType,
  applicationItxnType,
  assetConfigGtxnType,
  assetConfigItxnParamsType,
  assetConfigItxnType,
  assetFreezeGtxnType,
  assetFreezeItxnParamsType,
  assetFreezeItxnType,
  assetTransferGtxnType,
  assetTransferItxnParamsType,
  assetTransferItxnType,
  keyRegistrationGtxnType,
  keyRegistrationItxnParamsType,
  keyRegistrationItxnType,
  paymentGtxnType,
  paymentItxnParamsType,
  paymentItxnType,
} from '../../ptypes'

export function getInnerTransactionType(kind: TransactionKind): InnerTransactionPType {
  switch (kind) {
    case TransactionKind.pay:
      return paymentItxnType
    case TransactionKind.keyreg:
      return keyRegistrationItxnType
    case TransactionKind.acfg:
      return assetConfigItxnType
    case TransactionKind.axfer:
      return assetTransferItxnType
    case TransactionKind.afrz:
      return assetFreezeItxnType
    case TransactionKind.appl:
      return applicationItxnType
  }
}
export function getItxnParamsType(kind: TransactionKind): ItxnParamsPType {
  switch (kind) {
    case TransactionKind.pay:
      return paymentItxnParamsType
    case TransactionKind.keyreg:
      return keyRegistrationItxnParamsType
    case TransactionKind.acfg:
      return assetConfigItxnParamsType
    case TransactionKind.axfer:
      return assetTransferItxnParamsType
    case TransactionKind.afrz:
      return assetFreezeItxnParamsType
    case TransactionKind.appl:
      return applicationCallItxnParamsType
  }
}
export function getGroupTransactionType(kind: TransactionKind | undefined): GroupTransactionPType {
  switch (kind) {
    case TransactionKind.pay:
      return paymentGtxnType
    case TransactionKind.keyreg:
      return keyRegistrationGtxnType
    case TransactionKind.acfg:
      return assetConfigGtxnType
    case TransactionKind.axfer:
      return assetTransferGtxnType
    case TransactionKind.afrz:
      return assetFreezeGtxnType
    case TransactionKind.appl:
      return applicationCallGtxnType
    default:
      return anyGtxnType
  }
}
