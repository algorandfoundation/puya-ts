import { Account, Application, Asset, bytes, gtxn, internal, uint64 } from '@algorandfoundation/algo-ts'
import { getTestExecutionContext } from '../util'

export const GTxn: internal.opTypes.GTxnType = {
  sender(_t: uint64): Account {
    throw new Error('TODO')
  },
  fee(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  firstValid(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  firstValidTime(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  lastValid(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  note(_t: uint64): bytes {
    throw new Error('TODO')
  },
  lease(_t: uint64): bytes {
    throw new Error('TODO')
  },
  receiver(_t: uint64): Account {
    throw new Error('TODO')
  },
  amount(t: uint64): uint64 {
    const i = internal.primitives.Uint64Cls.getNumber(t)
    const context = getTestExecutionContext()
    const currentTransactionGroup = context.txn.activeGroup.transactions
    return (currentTransactionGroup[i] as gtxn.PayTxn).amount
  },
  closeRemainderTo(_t: uint64): Account {
    throw new Error('TODO')
  },
  votePk(_t: uint64): bytes {
    throw new Error('TODO')
  },
  selectionPk(_t: uint64): bytes {
    throw new Error('TODO')
  },
  voteFirst(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  voteLast(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  voteKeyDilution(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  type(_t: uint64): bytes {
    throw new Error('TODO')
  },
  typeEnum(t: uint64): uint64 {
    const i = internal.primitives.Uint64Cls.getNumber(t)
    const context = getTestExecutionContext()
    const currentTransactionGroup = context.txn.activeGroup.transactions
    return currentTransactionGroup[i].type
  },
  xferAsset(_t: uint64): Asset {
    throw new Error('TODO')
  },
  assetAmount(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  assetSender(_t: uint64): Account {
    throw new Error('TODO')
  },
  assetReceiver(_t: uint64): Account {
    throw new Error('TODO')
  },
  assetCloseTo(_t: uint64): Account {
    throw new Error('TODO')
  },
  groupIndex(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  txId(_t: uint64): bytes {
    throw new Error('TODO')
  },
  applicationId(_t: uint64): Application {
    throw new Error('TODO')
  },
  onCompletion(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  applicationArgs(_a: uint64, _b: uint64): bytes {
    throw new Error('TODO')
  },
  numAppArgs(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  accounts(_a: uint64, _b: uint64): Account {
    throw new Error('TODO')
  },
  numAccounts(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  approvalProgram(_t: uint64): bytes {
    throw new Error('TODO')
  },
  clearStateProgram(_t: uint64): bytes {
    throw new Error('TODO')
  },
  rekeyTo(_t: uint64): Account {
    throw new Error('TODO')
  },
  configAsset(_t: uint64): Asset {
    throw new Error('TODO')
  },
  configAssetTotal(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  configAssetDecimals(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  configAssetDefaultFrozen(_t: uint64): boolean {
    throw new Error('TODO')
  },
  configAssetUnitName(_t: uint64): bytes {
    throw new Error('TODO')
  },
  configAssetName(_t: uint64): bytes {
    throw new Error('TODO')
  },
  configAssetUrl(_t: uint64): bytes {
    throw new Error('TODO')
  },
  configAssetMetadataHash(_t: uint64): bytes {
    throw new Error('TODO')
  },
  configAssetManager(_t: uint64): Account {
    throw new Error('TODO')
  },
  configAssetReserve(_t: uint64): Account {
    throw new Error('TODO')
  },
  configAssetFreeze(_t: uint64): Account {
    throw new Error('TODO')
  },
  configAssetClawback(_t: uint64): Account {
    throw new Error('TODO')
  },
  freezeAsset(_t: uint64): Asset {
    throw new Error('TODO')
  },
  freezeAssetAccount(_t: uint64): Account {
    throw new Error('TODO')
  },
  freezeAssetFrozen(_t: uint64): boolean {
    throw new Error('TODO')
  },
  assets(_a: uint64, _b: uint64): Asset {
    throw new Error('TODO')
  },
  numAssets(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  applications(_a: uint64, _b: uint64): Application {
    throw new Error('TODO')
  },
  numApplications(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  globalNumUint(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  globalNumByteSlice(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  localNumUint(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  localNumByteSlice(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  extraProgramPages(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  nonparticipation(_t: uint64): boolean {
    throw new Error('TODO')
  },
  logs(_a: uint64, _b: uint64): bytes {
    throw new Error('TODO')
  },
  numLogs(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  createdAssetId(_t: uint64): Asset {
    throw new Error('TODO')
  },
  createdApplicationId(_t: uint64): Application {
    throw new Error('TODO')
  },
  lastLog(_t: uint64): bytes {
    throw new Error('TODO')
  },
  stateProofPk(_t: uint64): bytes {
    throw new Error('TODO')
  },
  approvalProgramPages(_a: uint64, _b: uint64): bytes {
    throw new Error('TODO')
  },
  numApprovalProgramPages(_t: uint64): uint64 {
    throw new Error('TODO')
  },
  clearStateProgramPages(_a: uint64, _b: uint64): bytes {
    throw new Error('TODO')
  },
  numClearStateProgramPages(_t: uint64): uint64 {
    throw new Error('TODO')
  },
}
