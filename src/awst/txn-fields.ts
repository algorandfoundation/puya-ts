import { wtypes } from './wtypes'

export class TxnFieldData {
  readonly immediate: string
  readonly wtype: wtypes.WType
  readonly numValues: number
  readonly isInnerParam: boolean
  /**
   * If field is an array, accept individual arguments and convert to an array
   */
  readonly arrayPromote: boolean
  constructor(data: { field: TxnField; wtype: wtypes.WType; numValues?: number; isInnerParam?: boolean; arrayPromote?: boolean }) {
    this.immediate = data.field
    this.wtype = data.wtype
    this.numValues = data.numValues ?? 1
    this.isInnerParam = data.isInnerParam ?? true
    this.arrayPromote = data.arrayPromote ?? false
  }
}

export enum TxnField {
  Sender = 'Sender',
  Fee = 'Fee',
  FirstValid = 'FirstValid',
  FirstValidTime = 'FirstValidTime',
  LastValid = 'LastValid',
  Note = 'Note',
  Lease = 'Lease',
  Receiver = 'Receiver',
  Amount = 'Amount',
  CloseRemainderTo = 'CloseRemainderTo',
  VotePK = 'VotePK',
  SelectionPK = 'SelectionPK',
  VoteFirst = 'VoteFirst',
  VoteLast = 'VoteLast',
  VoteKeyDilution = 'VoteKeyDilution',
  Type = 'Type',
  TypeEnum = 'TypeEnum',
  XferAsset = 'XferAsset',
  AssetAmount = 'AssetAmount',
  AssetSender = 'AssetSender',
  AssetReceiver = 'AssetReceiver',
  AssetCloseTo = 'AssetCloseTo',
  GroupIndex = 'GroupIndex',
  TxID = 'TxID',
  ApplicationID = 'ApplicationID',
  OnCompletion = 'OnCompletion',
  NumAppArgs = 'NumAppArgs',
  NumAccounts = 'NumAccounts',
  ApprovalProgram = 'ApprovalProgram',
  ClearStateProgram = 'ClearStateProgram',
  RekeyTo = 'RekeyTo',
  ConfigAsset = 'ConfigAsset',
  ConfigAssetTotal = 'ConfigAssetTotal',
  ConfigAssetDecimals = 'ConfigAssetDecimals',
  ConfigAssetDefaultFrozen = 'ConfigAssetDefaultFrozen',
  ConfigAssetUnitName = 'ConfigAssetUnitName',
  ConfigAssetName = 'ConfigAssetName',
  ConfigAssetURL = 'ConfigAssetURL',
  ConfigAssetMetadataHash = 'ConfigAssetMetadataHash',
  ConfigAssetManager = 'ConfigAssetManager',
  ConfigAssetReserve = 'ConfigAssetReserve',
  ConfigAssetFreeze = 'ConfigAssetFreeze',
  ConfigAssetClawback = 'ConfigAssetClawback',
  FreezeAsset = 'FreezeAsset',
  FreezeAssetAccount = 'FreezeAssetAccount',
  FreezeAssetFrozen = 'FreezeAssetFrozen',
  NumAssets = 'NumAssets',
  NumApplications = 'NumApplications',
  GlobalNumUint = 'GlobalNumUint',
  GlobalNumByteSlice = 'GlobalNumByteSlice',
  LocalNumUint = 'LocalNumUint',
  LocalNumByteSlice = 'LocalNumByteSlice',
  ExtraProgramPages = 'ExtraProgramPages',
  Nonparticipation = 'Nonparticipation',
  NumLogs = 'NumLogs',
  CreatedAssetID = 'CreatedAssetID',
  CreatedApplicationID = 'CreatedApplicationID',
  LastLog = 'LastLog',
  StateProofPK = 'StateProofPK',
  NumApprovalProgramPages = 'NumApprovalProgramPages',
  NumClearStateProgramPages = 'NumClearStateProgramPages',
  ApplicationArgs = 'ApplicationArgs',
  Accounts = 'Accounts',
  Assets = 'Assets',
  Applications = 'Applications',
  Logs = 'Logs',
  ApprovalProgramPages = 'ApprovalProgramPages',
  ClearStateProgramPages = 'ClearStateProgramPages',
}

export const TxnFields: Record<TxnField, TxnFieldData> = {
  Sender: new TxnFieldData({ field: TxnField.Sender, wtype: wtypes.accountWType }),
  Fee: new TxnFieldData({ field: TxnField.Fee, wtype: wtypes.uint64WType }),
  FirstValid: new TxnFieldData({ field: TxnField.FirstValid, wtype: wtypes.uint64WType, isInnerParam: false }),
  FirstValidTime: new TxnFieldData({ field: TxnField.FirstValidTime, wtype: wtypes.uint64WType, isInnerParam: false }),
  LastValid: new TxnFieldData({ field: TxnField.LastValid, wtype: wtypes.uint64WType, isInnerParam: false }),
  Note: new TxnFieldData({ field: TxnField.Note, wtype: wtypes.bytesWType }),
  Lease: new TxnFieldData({ field: TxnField.Lease, wtype: wtypes.bytesWType, isInnerParam: false }),
  Receiver: new TxnFieldData({ field: TxnField.Receiver, wtype: wtypes.accountWType }),
  Amount: new TxnFieldData({ field: TxnField.Amount, wtype: wtypes.uint64WType }),
  CloseRemainderTo: new TxnFieldData({ field: TxnField.CloseRemainderTo, wtype: wtypes.accountWType }),
  VotePK: new TxnFieldData({ field: TxnField.VotePK, wtype: wtypes.bytesWType }),
  SelectionPK: new TxnFieldData({ field: TxnField.SelectionPK, wtype: wtypes.bytesWType }),
  VoteFirst: new TxnFieldData({ field: TxnField.VoteFirst, wtype: wtypes.uint64WType }),
  VoteLast: new TxnFieldData({ field: TxnField.VoteLast, wtype: wtypes.uint64WType }),
  VoteKeyDilution: new TxnFieldData({ field: TxnField.VoteKeyDilution, wtype: wtypes.uint64WType }),
  Type: new TxnFieldData({ field: TxnField.Type, wtype: wtypes.bytesWType }),
  TypeEnum: new TxnFieldData({ field: TxnField.TypeEnum, wtype: wtypes.uint64WType }),
  XferAsset: new TxnFieldData({ field: TxnField.XferAsset, wtype: wtypes.assetWType }),
  AssetAmount: new TxnFieldData({ field: TxnField.AssetAmount, wtype: wtypes.uint64WType }),
  AssetSender: new TxnFieldData({ field: TxnField.AssetSender, wtype: wtypes.accountWType }),
  AssetReceiver: new TxnFieldData({ field: TxnField.AssetReceiver, wtype: wtypes.accountWType }),
  AssetCloseTo: new TxnFieldData({ field: TxnField.AssetCloseTo, wtype: wtypes.accountWType }),
  GroupIndex: new TxnFieldData({ field: TxnField.GroupIndex, wtype: wtypes.uint64WType, isInnerParam: false }),
  TxID: new TxnFieldData({ field: TxnField.TxID, wtype: wtypes.bytesWType, isInnerParam: false }),
  // v2
  ApplicationID: new TxnFieldData({ field: TxnField.ApplicationID, wtype: wtypes.applicationWType }),
  OnCompletion: new TxnFieldData({ field: TxnField.OnCompletion, wtype: wtypes.uint64WType }),
  NumAppArgs: new TxnFieldData({ field: TxnField.NumAppArgs, wtype: wtypes.uint64WType, isInnerParam: false }),
  NumAccounts: new TxnFieldData({ field: TxnField.NumAccounts, wtype: wtypes.uint64WType, isInnerParam: false }),
  ApprovalProgram: new TxnFieldData({ field: TxnField.ApprovalProgram, wtype: wtypes.bytesWType }),
  ClearStateProgram: new TxnFieldData({ field: TxnField.ClearStateProgram, wtype: wtypes.bytesWType }),
  RekeyTo: new TxnFieldData({ field: TxnField.RekeyTo, wtype: wtypes.accountWType }),
  ConfigAsset: new TxnFieldData({ field: TxnField.ConfigAsset, wtype: wtypes.assetWType }),
  ConfigAssetTotal: new TxnFieldData({ field: TxnField.ConfigAssetTotal, wtype: wtypes.uint64WType }),
  ConfigAssetDecimals: new TxnFieldData({ field: TxnField.ConfigAssetDecimals, wtype: wtypes.uint64WType }),
  ConfigAssetDefaultFrozen: new TxnFieldData({ field: TxnField.ConfigAssetDefaultFrozen, wtype: wtypes.boolWType }),
  ConfigAssetUnitName: new TxnFieldData({ field: TxnField.ConfigAssetUnitName, wtype: wtypes.bytesWType }),
  ConfigAssetName: new TxnFieldData({ field: TxnField.ConfigAssetName, wtype: wtypes.bytesWType }),
  ConfigAssetURL: new TxnFieldData({ field: TxnField.ConfigAssetURL, wtype: wtypes.bytesWType }),
  ConfigAssetMetadataHash: new TxnFieldData({ field: TxnField.ConfigAssetMetadataHash, wtype: wtypes.bytesWType }),
  ConfigAssetManager: new TxnFieldData({ field: TxnField.ConfigAssetManager, wtype: wtypes.accountWType }),
  ConfigAssetReserve: new TxnFieldData({ field: TxnField.ConfigAssetReserve, wtype: wtypes.accountWType }),
  ConfigAssetFreeze: new TxnFieldData({ field: TxnField.ConfigAssetFreeze, wtype: wtypes.accountWType }),
  ConfigAssetClawback: new TxnFieldData({ field: TxnField.ConfigAssetClawback, wtype: wtypes.accountWType }),
  FreezeAsset: new TxnFieldData({ field: TxnField.FreezeAsset, wtype: wtypes.assetWType }),
  FreezeAssetAccount: new TxnFieldData({ field: TxnField.FreezeAssetAccount, wtype: wtypes.accountWType }),
  FreezeAssetFrozen: new TxnFieldData({ field: TxnField.FreezeAssetFrozen, wtype: wtypes.boolWType }),
  // v3
  NumAssets: new TxnFieldData({ field: TxnField.NumAssets, wtype: wtypes.uint64WType, isInnerParam: false }),
  NumApplications: new TxnFieldData({ field: TxnField.NumApplications, wtype: wtypes.uint64WType, isInnerParam: false }),
  GlobalNumUint: new TxnFieldData({ field: TxnField.GlobalNumUint, wtype: wtypes.uint64WType }),
  GlobalNumByteSlice: new TxnFieldData({ field: TxnField.GlobalNumByteSlice, wtype: wtypes.uint64WType }),
  LocalNumUint: new TxnFieldData({ field: TxnField.LocalNumUint, wtype: wtypes.uint64WType }),
  LocalNumByteSlice: new TxnFieldData({ field: TxnField.LocalNumByteSlice, wtype: wtypes.uint64WType }),
  // v4
  ExtraProgramPages: new TxnFieldData({ field: TxnField.ExtraProgramPages, wtype: wtypes.uint64WType }),
  // v5
  Nonparticipation: new TxnFieldData({ field: TxnField.Nonparticipation, wtype: wtypes.boolWType }),
  NumLogs: new TxnFieldData({ field: TxnField.NumLogs, wtype: wtypes.uint64WType, isInnerParam: false }),
  CreatedAssetID: new TxnFieldData({ field: TxnField.CreatedAssetID, wtype: wtypes.assetWType, isInnerParam: false }),
  CreatedApplicationID: new TxnFieldData({ field: TxnField.CreatedApplicationID, wtype: wtypes.applicationWType, isInnerParam: false }),
  // v6
  LastLog: new TxnFieldData({ field: TxnField.LastLog, wtype: wtypes.bytesWType, isInnerParam: false }),
  StateProofPK: new TxnFieldData({ field: TxnField.StateProofPK, wtype: wtypes.bytesWType }),
  // v7
  NumApprovalProgramPages: new TxnFieldData({ field: TxnField.NumApprovalProgramPages, wtype: wtypes.uint64WType, isInnerParam: false }),
  NumClearStateProgramPages: new TxnFieldData({
    field: TxnField.NumClearStateProgramPages,
    wtype: wtypes.uint64WType,
    isInnerParam: false,
  }),
  // array fields
  // TODO: allow configuring as these are consensus values
  // v2
  ApplicationArgs: new TxnFieldData({ field: TxnField.ApplicationArgs, wtype: wtypes.bytesWType, numValues: 16 }),
  Accounts: new TxnFieldData({ field: TxnField.Accounts, wtype: wtypes.accountWType, numValues: 4 }),
  // v3
  Assets: new TxnFieldData({ field: TxnField.Assets, wtype: wtypes.assetWType, numValues: 8 }),
  Applications: new TxnFieldData({ field: TxnField.Applications, wtype: wtypes.applicationWType, numValues: 8 }),
  // v5
  Logs: new TxnFieldData({ field: TxnField.Logs, wtype: wtypes.bytesWType, numValues: 32, isInnerParam: false }),
  // v7
  ApprovalProgramPages: new TxnFieldData({
    field: TxnField.ApprovalProgramPages,
    wtype: wtypes.bytesWType,
    numValues: 4,
    arrayPromote: true,
  }),
  ClearStateProgramPages: new TxnFieldData({
    field: TxnField.ClearStateProgramPages,
    wtype: wtypes.bytesWType,
    numValues: 4,
    arrayPromote: true,
  }),
}
