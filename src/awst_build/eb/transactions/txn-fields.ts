import { TransactionKind } from '../../../awst/models'
import { TxnField } from '../../../awst/txn-fields'
import type { DeliberateAny } from '../../../typescript-helpers'
import type { PType } from '../../ptypes'
import {
  accountPType,
  applicationPType,
  assetPType,
  boolPType,
  bytesPType,
  onCompleteActionType,
  transactionTypeType,
  uint64PType,
} from '../../ptypes'

type TxnFieldsMeta = Record<string, readonly [TxnField, PType]>

const baseTxnFields = {
  /**
   * 32 byte address
   */
  sender: [TxnField.Sender, accountPType] as const,

  /**
   * microalgos
   */
  fee: [TxnField.Fee, uint64PType] as const,

  /**
   * round number
   */
  firstValid: [TxnField.FirstValid, uint64PType] as const,

  /**
   * UNIX timestamp of block before txn.FirstValid. Fails if negative
   */
  firstValidTime: [TxnField.FirstValidTime, uint64PType] as const,

  /**
   * round number
   */
  lastValid: [TxnField.LastValid, uint64PType] as const,

  /**
   * Any data up to 1024 bytes
   */
  note: [TxnField.Note, bytesPType] as const,

  /**
   * 32 byte lease value
   */
  lease: [TxnField.Lease, bytesPType] as const,

  /**
   * Transaction type as bytes
   */
  typeBytes: [TxnField.Type, bytesPType] as const,

  /**
   * Transaction type as integer
   */
  type: [TxnField.TypeEnum, transactionTypeType.memberType] as const,

  /**
   * Position of this transaction within an atomic group
   * A stand-alone transaction is implicitly element 0 in a group of 1
   */
  groupIndex: [TxnField.GroupIndex, uint64PType] as const,

  /**
   * The computed ID for this transaction. 32 bytes.
   */
  txnId: [TxnField.TxID, bytesPType] as const,

  /**
   * 32 byte Sender's new AuthAddr
   */
  rekeyTo: [TxnField.RekeyTo, accountPType] as const,
} satisfies TxnFieldsMeta

export const paymentTxnFields = {
  ...baseTxnFields,
  /**
   * 32 byte address
   */
  receiver: [TxnField.Receiver, accountPType] as const,

  /**
   * microalgos
   */
  amount: [TxnField.Amount, uint64PType] as const,

  /**
   * 32 byte address
   */
  closeRemainderTo: [TxnField.CloseRemainderTo, accountPType] as const,
} satisfies TxnFieldsMeta

export const keyRegistrationTxnFields = {
  ...baseTxnFields,
  /**
   * 32 byte address
   */
  voteKey: [TxnField.VotePK, bytesPType] as const,

  /**
   * 32 byte address
   */
  selectionKey: [TxnField.SelectionPK, bytesPType] as const,

  /**
   * The first round that the participation key is valid.
   */
  voteFirst: [TxnField.VoteFirst, uint64PType] as const,

  /**
   * The last round that the participation key is valid.
   */
  voteLast: [TxnField.VoteLast, uint64PType] as const,

  /**
   * Dilution for the 2-level participation key
   */
  voteKeyDilution: [TxnField.VoteKeyDilution, uint64PType] as const,

  /**
   * Marks an account nonparticipating for rewards
   */
  nonparticipation: [TxnField.Nonparticipation, boolPType] as const,

  /**
   * 64 byte state proof public key
   */
  stateProofKey: [TxnField.StateProofPK, bytesPType] as const,
} satisfies TxnFieldsMeta

export const assetConfigTxnFields = {
  ...baseTxnFields,
  /**
   * Asset ID in asset config transaction
   */
  configAsset: [TxnField.ConfigAsset, assetPType] as const,

  /**
   * The asset created by this transaction
   */
  createdAsset: [TxnField.CreatedAssetID, assetPType] as const,

  /**
   * Total number of units of this asset created
   */
  total: [TxnField.ConfigAssetTotal, uint64PType] as const,

  /**
   * Number of digits to display after the decimal place when displaying the asset
   */
  decimals: [TxnField.ConfigAssetDecimals, uint64PType] as const,

  /**
   * Whether the asset's slots are frozen by default or not, 0 or 1
   */
  defaultFrozen: [TxnField.ConfigAssetDefaultFrozen, boolPType] as const,

  /**
   * Unit name of the asset
   */
  unitName: [TxnField.ConfigAssetUnitName, bytesPType] as const,

  /**
   * The asset name
   */
  assetName: [TxnField.ConfigAssetName, bytesPType] as const,

  /**
   * URL
   */
  url: [TxnField.ConfigAssetURL, bytesPType] as const,

  /**
   * 32 byte commitment to unspecified asset metadata
   */
  metadataHash: [TxnField.ConfigAssetMetadataHash, bytesPType] as const,

  /**
   * 32 byte address
   */
  manager: [TxnField.ConfigAssetManager, accountPType] as const,

  /**
   * 32 byte address
   */
  reserve: [TxnField.ConfigAssetReserve, accountPType] as const,

  /**
   * 32 byte address
   */
  freeze: [TxnField.ConfigAssetFreeze, accountPType] as const,

  /**
   * 32 byte address
   */
  clawback: [TxnField.ConfigAssetClawback, accountPType] as const,
} satisfies TxnFieldsMeta

export const assetTransferTxnFields = {
  ...baseTxnFields,
  /**
   * Asset ID
   */
  xferAsset: [TxnField.XferAsset, assetPType] as const,

  /**
   * value in Asset's units
   */
  assetAmount: [TxnField.AssetAmount, uint64PType] as const,

  /**
   * 32 byte address. Source of assets if Sender is the Asset's Clawback address.
   */
  assetSender: [TxnField.AssetSender, accountPType] as const,

  /**
   * 32 byte address
   */
  assetReceiver: [TxnField.AssetReceiver, accountPType] as const,

  /**
   * 32 byte address
   */
  assetCloseTo: [TxnField.AssetCloseTo, accountPType] as const,
} satisfies TxnFieldsMeta

export const assetFreezeTxnFields = {
  ...baseTxnFields,
  /**
   * Asset ID being frozen or un-frozen
   */
  freezeAsset: [TxnField.FreezeAsset, assetPType] as const,

  /**
   * 32 byte address of the account whose asset slot is being frozen or un-frozen
   */
  freezeAccount: [TxnField.FreezeAssetAccount, accountPType] as const,

  /**
   * The new frozen value
   */
  frozen: [TxnField.FreezeAssetFrozen, boolPType] as const,
} satisfies TxnFieldsMeta

export const applicationCallTxnFields = {
  ...baseTxnFields,
  /**
   * ApplicationID from ApplicationCall transaction
   */
  appId: [TxnField.ApplicationID, applicationPType] as const,

  /**
   * The application created by this transaction
   */
  createdApplication: [TxnField.CreatedApplicationID, applicationPType] as const,

  /**
   * ApplicationCall transaction on completion action
   */
  onCompletion: [TxnField.OnCompletion, onCompleteActionType.memberType] as const,

  /**
   * Number of ApplicationArgs
   */
  numAppArgs: [TxnField.NumAppArgs, uint64PType] as const,

  /**
   * Number of ApplicationArgs
   */
  numAccounts: [TxnField.NumAccounts, uint64PType] as const,

  /**
   * Approval program
   */
  approvalProgram: [TxnField.ApprovalProgramPages, bytesPType] as const,

  /**
   * Clear State program
   */
  clearStateProgram: [TxnField.ClearStateProgramPages, bytesPType] as const,

  /**
   * Number of Assets
   */
  numAssets: [TxnField.NumAssets, uint64PType] as const,

  /**
   * Number of Applications
   */
  numApps: [TxnField.NumApplications, uint64PType] as const,

  /**
   * Number of global state integers in ApplicationCall
   */
  globalNumUint: [TxnField.GlobalNumUint, uint64PType] as const,

  /**
   * Number of global state byteslices in ApplicationCall
   */
  globalNumBytes: [TxnField.GlobalNumByteSlice, uint64PType] as const,

  /**
   * Number of local state integers in ApplicationCall
   */
  localNumUint: [TxnField.LocalNumUint, uint64PType] as const,

  /**
   * Number of local state byteslices in ApplicationCall
   */
  localNumBytes: [TxnField.LocalNumByteSlice, uint64PType] as const,

  /**
   * Number of additional pages for each of the application's approval and clear state programs. An ExtraProgramPages of 1 means 2048 more total bytes, or 1024 for each program.
   */
  extraProgramPages: [TxnField.ExtraProgramPages, uint64PType] as const,

  /**
   * The last message emitted. Empty bytes if none were emitted. Application mode only
   */
  lastLog: [TxnField.LastLog, bytesPType] as const,

  /**
   * Read application logs
   */
  logs: [TxnField.Logs, bytesPType] as const,

  /**
   * Number of Approval Program pages
   */
  numApprovalProgramPages: [TxnField.NumApprovalProgramPages, uint64PType] as const,
  /**
   * Read approval program pages
   */
  approvalProgramPages: [TxnField.ApprovalProgramPages, bytesPType] as const,

  /**
   * Number of Clear State Program pages
   */
  numClearStateProgramPages: [TxnField.NumClearStateProgramPages, uint64PType] as const,
  /**
   * Read clear state program pages
   */
  clearStateProgramPages: [TxnField.ClearStateProgramPages, bytesPType] as const,

  /**
   * Arguments passed to the application in the ApplicationCall transaction
   * @param index
   */
  appArgs: [TxnField.ApplicationArgs, bytesPType] as const,

  /**
   * Accounts listed in the ApplicationCall transaction
   */
  accounts: [TxnField.Accounts, accountPType] as const,

  /**
   * Foreign Assets listed in the ApplicationCall transaction
   */
  assets: [TxnField.Assets, assetPType] as const,

  /**
   * Foreign Apps listed in the ApplicationCall transaction
   */
  apps: [TxnField.Applications, applicationPType] as const,

  /**
   * The id of the created application
   */
  createdApp: [TxnField.CreatedApplicationID, applicationPType] as const,

  /**
   * Number of logs
   */
  numLogs: [TxnField.NumLogs, uint64PType] as const,
} satisfies TxnFieldsMeta

export const anyTxnFields = {
  ...paymentTxnFields,
  ...keyRegistrationTxnFields,
  ...assetConfigTxnFields,
  ...assetTransferTxnFields,
  ...assetFreezeTxnFields,
  ...applicationCallTxnFields,
} satisfies TxnFieldsMeta

export const txnKindToFields = {
  [TransactionKind.pay]: paymentTxnFields,
  [TransactionKind.keyreg]: keyRegistrationTxnFields,
  [TransactionKind.acfg]: assetConfigTxnFields,
  [TransactionKind.axfer]: assetTransferTxnFields,
  [TransactionKind.afrz]: assetFreezeTxnFields,
  [TransactionKind.appl]: applicationCallTxnFields,
}

type TxnFieldName = keyof typeof anyTxnFields
export const txnFieldName = new Proxy<Record<TxnFieldName, TxnFieldName>>({} as DeliberateAny, {
  get(_, prop) {
    if (prop in anyTxnFields) return prop
    return Reflect.get(_, prop)
  },
})
