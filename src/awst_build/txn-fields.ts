import { TransactionKind } from '../awst/models'
import { TxnField } from '../awst/txn-fields'
import type { DeliberateAny } from '../typescript-helpers'
import type { PType } from './ptypes'
import {
  accountPType,
  applicationPType,
  assetPType,
  boolPType,
  BytesPType,
  bytesPType,
  onCompleteActionType,
  transactionTypeType,
  uint64PType,
} from './ptypes'

const bytes32PType = new BytesPType({ length: 32n })

export type TxnFieldMetaData = {
  /**
   * The awst field enum for this field
   */
  field: TxnField
  /**
   * The ptype for this field, (or one unit of this field if it's an array)
   */
  ptype: PType
  /**
   * Comments for jsdoc
   */
  comment: string | string[]
  /**
   * This field can be read but not set
   */
  computed?: boolean
  /**
   * This field is an indexable collection
   */
  indexable?: boolean
  /**
   * When receiving a value for this field, automatically convert single values into arrays
   */
  arrayPromote?: boolean
}
export type TxnFieldsMetaData = Record<string, TxnFieldMetaData>

const baseTxnFields = {
  sender: { field: TxnField.Sender, ptype: accountPType, comment: '32 byte address' },
  fee: { field: TxnField.Fee, ptype: uint64PType, comment: 'microalgos' },
  firstValid: { field: TxnField.FirstValid, ptype: uint64PType, comment: 'round number' },
  firstValidTime: {
    field: TxnField.FirstValidTime,
    ptype: uint64PType,
    comment: 'UNIX timestamp of block before txn.FirstValid. Fails if negative',
  },
  lastValid: { field: TxnField.LastValid, ptype: uint64PType, comment: 'round number' },
  note: { field: TxnField.Note, ptype: bytesPType, comment: 'Any data up to 1024 bytes' },
  lease: { field: TxnField.Lease, ptype: bytes32PType, comment: '32 byte lease value' },
  typeBytes: { field: TxnField.Type, ptype: bytesPType, comment: 'Transaction type as bytes', computed: true },
  type: { field: TxnField.TypeEnum, ptype: transactionTypeType.memberType, comment: 'Transaction type', computed: true },
  groupIndex: {
    field: TxnField.GroupIndex,
    ptype: uint64PType,
    comment: ['Position of this transaction within an atomic group', 'A stand-alone transaction is implicitly element 0 in a group of 1'],
    computed: true,
  },
  txnId: { field: TxnField.TxID, ptype: bytes32PType, comment: 'The computed ID for this transaction. 32 bytes.', computed: true },
  rekeyTo: { field: TxnField.RekeyTo, ptype: accountPType, comment: "32 byte Sender's new AuthAddr" },
} satisfies TxnFieldsMetaData

export const paymentTxnFields = {
  ...baseTxnFields,
  receiver: { field: TxnField.Receiver, ptype: accountPType, comment: '32 byte address' },
  amount: { field: TxnField.Amount, ptype: uint64PType, comment: 'microalgos' },
  closeRemainderTo: { field: TxnField.CloseRemainderTo, ptype: accountPType, comment: '32 byte address' },
} satisfies TxnFieldsMetaData

export const keyRegistrationTxnFields = {
  ...baseTxnFields,
  voteKey: { field: TxnField.VotePK, ptype: bytes32PType, comment: '32 byte address' },
  selectionKey: { field: TxnField.SelectionPK, ptype: bytes32PType, comment: '32 byte address' },
  voteFirst: { field: TxnField.VoteFirst, ptype: uint64PType, comment: 'The first round that the participation key is valid.' },
  voteLast: { field: TxnField.VoteLast, ptype: uint64PType, comment: 'The last round that the participation key is valid.' },
  voteKeyDilution: { field: TxnField.VoteKeyDilution, ptype: uint64PType, comment: 'Dilution for the 2-level participation key' },
  nonparticipation: { field: TxnField.Nonparticipation, ptype: boolPType, comment: 'Marks an account nonparticipating for rewards' },
  stateProofKey: { field: TxnField.StateProofPK, ptype: new BytesPType({ length: 64n }), comment: '64 byte state proof public key' },
} satisfies TxnFieldsMetaData

export const assetConfigTxnFields = {
  ...baseTxnFields,
  configAsset: { field: TxnField.ConfigAsset, ptype: assetPType, comment: 'Asset ID in asset config transaction' },
  createdAsset: { field: TxnField.CreatedAssetID, ptype: assetPType, comment: 'The asset created by this transaction', computed: true },
  total: { field: TxnField.ConfigAssetTotal, ptype: uint64PType, comment: 'Total number of units of this asset created' },
  decimals: {
    field: TxnField.ConfigAssetDecimals,
    ptype: uint64PType,
    comment: 'Number of digits to display after the decimal place when displaying the asset',
  },
  defaultFrozen: {
    field: TxnField.ConfigAssetDefaultFrozen,
    ptype: boolPType,
    comment: "Whether the asset's slots are frozen by default or not, 0 or 1",
  },
  unitName: { field: TxnField.ConfigAssetUnitName, ptype: bytesPType, comment: 'Unit name of the asset' },
  assetName: { field: TxnField.ConfigAssetName, ptype: bytesPType, comment: 'The asset name' },
  url: { field: TxnField.ConfigAssetURL, ptype: bytesPType, comment: 'URL' },
  metadataHash: {
    field: TxnField.ConfigAssetMetadataHash,
    ptype: bytes32PType,
    comment: '32 byte commitment to unspecified asset metadata',
  },
  manager: { field: TxnField.ConfigAssetManager, ptype: accountPType, comment: '32 byte address' },
  reserve: { field: TxnField.ConfigAssetReserve, ptype: accountPType, comment: '32 byte address' },
  freeze: { field: TxnField.ConfigAssetFreeze, ptype: accountPType, comment: '32 byte address' },
  clawback: { field: TxnField.ConfigAssetClawback, ptype: accountPType, comment: '32 byte address' },
} satisfies TxnFieldsMetaData

export const assetTransferTxnFields = {
  ...baseTxnFields,
  xferAsset: { field: TxnField.XferAsset, ptype: assetPType, comment: 'Asset ID' },
  assetAmount: { field: TxnField.AssetAmount, ptype: uint64PType, comment: "value in Asset's units" },
  assetSender: {
    field: TxnField.AssetSender,
    ptype: accountPType,
    comment: "32 byte address. Source of assets if Sender is the Asset's Clawback address.",
  },
  assetReceiver: { field: TxnField.AssetReceiver, ptype: accountPType, comment: '32 byte address' },
  assetCloseTo: { field: TxnField.AssetCloseTo, ptype: accountPType, comment: '32 byte address' },
} satisfies TxnFieldsMetaData

export const assetFreezeTxnFields = {
  ...baseTxnFields,
  freezeAsset: { field: TxnField.FreezeAsset, ptype: assetPType, comment: 'Asset ID being frozen or un-frozen' },
  freezeAccount: {
    field: TxnField.FreezeAssetAccount,
    ptype: accountPType,
    comment: '32 byte address of the account whose asset slot is being frozen or un-frozen',
  },
  frozen: { field: TxnField.FreezeAssetFrozen, ptype: boolPType, comment: 'The new frozen value' },
} satisfies TxnFieldsMetaData

export const applicationCallTxnFields = {
  ...baseTxnFields,
  appId: { field: TxnField.ApplicationID, ptype: applicationPType, comment: 'ApplicationID from ApplicationCall transaction' },
  onCompletion: {
    field: TxnField.OnCompletion,
    ptype: onCompleteActionType.memberType,
    comment: 'ApplicationCall transaction on completion action',
  },
  numAppArgs: { field: TxnField.NumAppArgs, ptype: uint64PType, comment: 'Number of ApplicationArgs', computed: true },
  numAccounts: { field: TxnField.NumAccounts, ptype: uint64PType, comment: 'Number of ApplicationArgs', computed: true },
  approvalProgram: {
    field: TxnField.ApprovalProgram,
    ptype: bytesPType,
    comment: 'The first page of the Approval program',
    computed: true,
  },
  clearStateProgram: {
    field: TxnField.ClearStateProgram,
    ptype: bytesPType,
    comment: 'The first page of the Clear State program',
    computed: true,
  },
  numAssets: { field: TxnField.NumAssets, ptype: uint64PType, comment: 'Number of Assets', computed: true },
  numApps: { field: TxnField.NumApplications, ptype: uint64PType, comment: 'Number of Applications', computed: true },
  globalNumUint: {
    field: TxnField.GlobalNumUint,
    ptype: uint64PType,
    comment: 'Number of global state integers this application makes use of.',
  },
  globalNumBytes: {
    field: TxnField.GlobalNumByteSlice,
    ptype: uint64PType,
    comment: 'Number of global state byteslices this application makes use of.',
  },
  localNumUint: {
    field: TxnField.LocalNumUint,
    ptype: uint64PType,
    comment: 'Number of local state integers this application makes use of.',
  },
  localNumBytes: {
    field: TxnField.LocalNumByteSlice,
    ptype: uint64PType,
    comment: 'Number of local state byteslices this application makes use of.',
  },
  extraProgramPages: {
    field: TxnField.ExtraProgramPages,
    ptype: uint64PType,
    comment: "Number of additional pages for each of the application's approval and clear state program",
  },
  lastLog: {
    field: TxnField.LastLog,
    ptype: bytesPType,
    comment: 'The last message emitted. Empty bytes if none were emitted. App mode only',
    computed: true,
  },
  logs: {
    field: TxnField.Logs,
    ptype: bytesPType,
    comment: ['Read application logs', '@param index Index of the log to get'],
    indexable: true,
    computed: true,
  },
  numApprovalProgramPages: {
    field: TxnField.NumApprovalProgramPages,
    ptype: uint64PType,
    comment: 'Number of Approval Program pages',
    computed: true,
  },
  approvalProgramPages: {
    field: TxnField.ApprovalProgramPages,
    ptype: bytesPType,
    comment: ['All approval program pages', '@param index Index of the page to get'],
    indexable: true,
    arrayPromote: true,
  },
  numClearStateProgramPages: {
    field: TxnField.NumClearStateProgramPages,
    ptype: uint64PType,
    comment: 'Number of Clear State Program pages',
    computed: true,
  },
  clearStateProgramPages: {
    field: TxnField.ClearStateProgramPages,
    ptype: bytesPType,
    comment: ['All clear state program pages', '@param index Index of the page to get'],
    indexable: true,
    arrayPromote: true,
  },
  appArgs: {
    field: TxnField.ApplicationArgs,
    ptype: bytesPType,
    comment: ['Arguments passed to the application in the ApplicationCall transaction', '@param index Index of the arg to get'],
    indexable: true,
  },
  accounts: {
    field: TxnField.Accounts,
    ptype: accountPType,
    comment: ['Accounts listed in the ApplicationCall transaction', '@param index Index of the account to get'],
    indexable: true,
  },
  assets: {
    field: TxnField.Assets,
    ptype: assetPType,
    comment: ['Foreign Assets listed in the ApplicationCall transaction', '@param index Index of the asset to get'],
    indexable: true,
  },
  apps: {
    field: TxnField.Applications,
    ptype: applicationPType,
    comment: ['Foreign Apps listed in the ApplicationCall transaction', '@param index Index of the application to get'],
    indexable: true,
  },
  createdApp: {
    field: TxnField.CreatedApplicationID,
    ptype: applicationPType,
    comment: 'The id of the created application',
    computed: true,
  },

  /**
   * Number of logs
   */
  numLogs: { field: TxnField.NumLogs, ptype: uint64PType, comment: 'Number of logs', computed: true },

  rejectVersion: {
    field: TxnField.RejectVersion,
    ptype: uint64PType,
    comment: 'Application version for which the txn must reject',
  },
} satisfies TxnFieldsMetaData

const anyTxnFields = {
  ...paymentTxnFields,
  ...keyRegistrationTxnFields,
  ...assetConfigTxnFields,
  ...assetTransferTxnFields,
  ...assetFreezeTxnFields,
  ...applicationCallTxnFields,
} satisfies TxnFieldsMetaData

type TxnFieldName = keyof typeof anyTxnFields
export const txnFieldName = new Proxy<Record<TxnFieldName, TxnFieldName>>({} as DeliberateAny, {
  get(_, prop) {
    if (prop in anyTxnFields) return prop
    return Reflect.get(_, prop)
  },
})

export function getTxnFieldMetaData({
  kind,
  memberName,
  direction = 'out',
}: {
  kind: TransactionKind | undefined
  memberName: string
  direction?: 'in' | 'out'
}): TxnFieldMetaData | false {
  let fields: TxnFieldsMetaData
  switch (kind) {
    case TransactionKind.pay:
      fields = paymentTxnFields
      break
    case TransactionKind.keyreg:
      fields = keyRegistrationTxnFields
      break
    case TransactionKind.acfg:
      fields = assetConfigTxnFields
      break
    case TransactionKind.axfer:
      fields = assetTransferTxnFields
      break
    case TransactionKind.afrz:
      fields = assetFreezeTxnFields
      break
    case TransactionKind.appl:
      fields = applicationCallTxnFields
      break
    default:
      fields = anyTxnFields
      break
  }

  if (memberName in fields) {
    if (direction === 'in') {
      // Allow program properties to be set as if they were their pages equivalent
      switch (memberName) {
        case txnFieldName.approvalProgram:
          return applicationCallTxnFields.approvalProgramPages
        case txnFieldName.clearStateProgram:
          return applicationCallTxnFields.clearStateProgramPages
      }
    }
    return fields[memberName]
  }
  return false
}
