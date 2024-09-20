import { Account, Application, arc4, Asset, bytes, gtxn, internal, uint64 } from '@algorandfoundation/algo-ts'
import { lazyContext } from '../context-helpers/internal-context'
import { asNumber, asUint64, asUint64Cls } from '../util'

const getTransaction = <T extends gtxn.Transaction>(t: internal.primitives.StubUint64Compat): T => {
  const transactions = lazyContext.activeGroup.transactions
  const index = asNumber(t)
  if (index >= transactions.length) {
    throw new internal.errors.InternalError('invalid group index')
  }
  return transactions[index] as T
}
export const GTxn: internal.opTypes.GTxnType = {
  sender(t: internal.primitives.StubUint64Compat): Account {
    return getTransaction(t).sender
  },
  fee(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction(t).fee
  },
  firstValid(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction(t).firstValid
  },
  firstValidTime(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction(t).firstValidTime
  },
  lastValid(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction(t).lastValid
  },
  note(t: internal.primitives.StubUint64Compat): bytes {
    return getTransaction(t).note
  },
  lease(t: internal.primitives.StubUint64Compat): bytes {
    return getTransaction(t).lease
  },
  receiver(t: internal.primitives.StubUint64Compat): Account {
    return getTransaction<gtxn.PaymentTxn>(t).receiver
  },
  amount(t: uint64): uint64 {
    return getTransaction<gtxn.PaymentTxn>(t).amount
  },
  closeRemainderTo(t: internal.primitives.StubUint64Compat): Account {
    return getTransaction<gtxn.PaymentTxn>(t).closeRemainderTo
  },
  votePk(t: internal.primitives.StubUint64Compat): bytes {
    return getTransaction<gtxn.KeyRegistrationTxn>(t).voteKey
  },
  selectionPk(t: internal.primitives.StubUint64Compat): bytes {
    return getTransaction<gtxn.KeyRegistrationTxn>(t).selectionKey
  },
  voteFirst(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction<gtxn.KeyRegistrationTxn>(t).voteFirst
  },
  voteLast(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction<gtxn.KeyRegistrationTxn>(t).voteLast
  },
  voteKeyDilution(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction<gtxn.KeyRegistrationTxn>(t).voteKeyDilution
  },
  type(t: internal.primitives.StubUint64Compat): bytes {
    return asUint64Cls(getTransaction(t).type).toBytes().asAlgoTs()
  },
  typeEnum(t: uint64): uint64 {
    return asUint64(getTransaction(t).type)
  },
  xferAsset(t: internal.primitives.StubUint64Compat): Asset {
    return getTransaction<gtxn.AssetTransferTxn>(t).xferAsset
  },
  assetAmount(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction<gtxn.AssetTransferTxn>(t).assetAmount
  },
  assetSender(t: internal.primitives.StubUint64Compat): Account {
    return getTransaction<gtxn.AssetTransferTxn>(t).assetSender
  },
  assetReceiver(t: internal.primitives.StubUint64Compat): Account {
    return getTransaction<gtxn.AssetTransferTxn>(t).assetReceiver
  },
  assetCloseTo(t: internal.primitives.StubUint64Compat): Account {
    return getTransaction<gtxn.AssetTransferTxn>(t).assetCloseTo
  },
  groupIndex(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction(t).groupIndex
  },
  txId(t: internal.primitives.StubUint64Compat): bytes {
    return getTransaction(t).txnId
  },
  applicationId(t: internal.primitives.StubUint64Compat): Application {
    return getTransaction<gtxn.ApplicationTxn>(t).appId
  },
  onCompletion(t: internal.primitives.StubUint64Compat): uint64 {
    const onCompletionStr = getTransaction<gtxn.ApplicationTxn>(t).onCompletion
    return asUint64(arc4.OnCompleteAction[onCompletionStr])
  },
  applicationArgs(a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): bytes {
    return getTransaction<gtxn.ApplicationTxn>(a).appArgs(asUint64(b))
  },
  numAppArgs(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction<gtxn.ApplicationTxn>(t).numAppArgs
  },
  accounts(a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): Account {
    return getTransaction<gtxn.ApplicationTxn>(a).accounts(asUint64(b))
  },
  numAccounts(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction<gtxn.ApplicationTxn>(t).numAccounts
  },
  approvalProgram(t: internal.primitives.StubUint64Compat): bytes {
    return getTransaction<gtxn.ApplicationTxn>(t).approvalProgram
  },
  clearStateProgram(t: internal.primitives.StubUint64Compat): bytes {
    return getTransaction<gtxn.ApplicationTxn>(t).clearStateProgram
  },
  rekeyTo(t: internal.primitives.StubUint64Compat): Account {
    return getTransaction(t).rekeyTo
  },
  configAsset(t: internal.primitives.StubUint64Compat): Asset {
    return getTransaction<gtxn.AssetConfigTxn>(t).configAsset
  },
  configAssetTotal(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction<gtxn.AssetConfigTxn>(t).total
  },
  configAssetDecimals(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction<gtxn.AssetConfigTxn>(t).decimals
  },
  configAssetDefaultFrozen(t: internal.primitives.StubUint64Compat): boolean {
    return getTransaction<gtxn.AssetConfigTxn>(t).defaultFrozen
  },
  configAssetUnitName(t: internal.primitives.StubUint64Compat): bytes {
    return getTransaction<gtxn.AssetConfigTxn>(t).unitName
  },
  configAssetName(t: internal.primitives.StubUint64Compat): bytes {
    return getTransaction<gtxn.AssetConfigTxn>(t).assetName
  },
  configAssetUrl(t: internal.primitives.StubUint64Compat): bytes {
    return getTransaction<gtxn.AssetConfigTxn>(t).url
  },
  configAssetMetadataHash(t: internal.primitives.StubUint64Compat): bytes {
    return getTransaction<gtxn.AssetConfigTxn>(t).metadataHash
  },
  configAssetManager(t: internal.primitives.StubUint64Compat): Account {
    return getTransaction<gtxn.AssetConfigTxn>(t).manager
  },
  configAssetReserve(t: internal.primitives.StubUint64Compat): Account {
    return getTransaction<gtxn.AssetConfigTxn>(t).reserve
  },
  configAssetFreeze(t: internal.primitives.StubUint64Compat): Account {
    return getTransaction<gtxn.AssetConfigTxn>(t).freeze
  },
  configAssetClawback(t: internal.primitives.StubUint64Compat): Account {
    return getTransaction<gtxn.AssetConfigTxn>(t).clawback
  },
  freezeAsset(t: internal.primitives.StubUint64Compat): Asset {
    return getTransaction<gtxn.AssetFreezeTxn>(t).freezeAsset
  },
  freezeAssetAccount(t: internal.primitives.StubUint64Compat): Account {
    return getTransaction<gtxn.AssetFreezeTxn>(t).freezeAccount
  },
  freezeAssetFrozen(t: internal.primitives.StubUint64Compat): boolean {
    return getTransaction<gtxn.AssetFreezeTxn>(t).frozen
  },
  assets(a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): Asset {
    return getTransaction<gtxn.ApplicationTxn>(a).assets(asUint64(b))
  },
  numAssets(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction<gtxn.ApplicationTxn>(t).numAssets
  },
  applications(a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): Application {
    return getTransaction<gtxn.ApplicationTxn>(a).apps(asUint64(b))
  },
  numApplications(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction<gtxn.ApplicationTxn>(t).numApps
  },
  globalNumUint(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction<gtxn.ApplicationTxn>(t).globalNumUint
  },
  globalNumByteSlice(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction<gtxn.ApplicationTxn>(t).globalNumBytes
  },
  localNumUint(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction<gtxn.ApplicationTxn>(t).localNumUint
  },
  localNumByteSlice(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction<gtxn.ApplicationTxn>(t).localNumBytes
  },
  extraProgramPages(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction<gtxn.ApplicationTxn>(t).extraProgramPages
  },
  nonparticipation(t: internal.primitives.StubUint64Compat): boolean {
    return getTransaction<gtxn.KeyRegistrationTxn>(t).nonParticipation
  },
  logs(a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): bytes {
    return getTransaction<gtxn.ApplicationTxn>(a).logs(asUint64(b))
  },
  numLogs(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction<gtxn.ApplicationTxn>(t).numLogs
  },
  createdAssetId(t: internal.primitives.StubUint64Compat): Asset {
    return getTransaction<gtxn.AssetConfigTxn>(t).createdAsset
  },
  createdApplicationId(t: internal.primitives.StubUint64Compat): Application {
    return getTransaction<gtxn.ApplicationTxn>(t).createdApp
  },
  lastLog(t: internal.primitives.StubUint64Compat): bytes {
    return getTransaction<gtxn.ApplicationTxn>(t).lastLog
  },
  stateProofPk(t: internal.primitives.StubUint64Compat): bytes {
    return getTransaction<gtxn.KeyRegistrationTxn>(t).stateProofKey
  },
  approvalProgramPages(a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): bytes {
    return getTransaction<gtxn.ApplicationTxn>(a).approvalProgramPages(asUint64(b))
  },
  numApprovalProgramPages(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction<gtxn.ApplicationTxn>(t).numApprovalProgramPages
  },
  clearStateProgramPages(a: internal.primitives.StubUint64Compat, b: internal.primitives.StubUint64Compat): bytes {
    return getTransaction<gtxn.ApplicationTxn>(a).clearStateProgramPages(asUint64(b))
  },
  numClearStateProgramPages(t: internal.primitives.StubUint64Compat): uint64 {
    return getTransaction<gtxn.ApplicationTxn>(t).numClearStateProgramPages
  },
}
