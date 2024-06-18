import { bytes, str, uint64 } from './primitives'
import type { Account, Asset } from './reference'
import { AssetConfigTxn, AssetTransferTxn, PayTxn } from './transactions'

interface CommonTransactionParams {
  /** The fee paid for this transaction */
  fee?: uint64
  /** The sender of this transaction. This is the account that pays the fee (if non-zero) */
  sender?: Account
  /** If set, changes the authAddr of `sender` to the given address  */
  rekeyTo?: Account
  /** The note field for this transaction */
  note?: str | bytes
}

interface AssetTransferParams extends CommonTransactionParams {
  /** The asset being transferred */
  xferAsset: Asset
  /** The amount of the asset being transferred */
  assetAmount: uint64
  /** The clawback target */
  assetSender?: Account
  /** The receiver of the asset */
  assetReceiver: Account
  /** The address to close the asset to */
  assetCloseTo?: Account
}
interface PaymentParams extends CommonTransactionParams {
  /** The amount, in microALGO, to transfer */
  amount?: uint64
  /** The address of the receiver */
  receiver?: Account
  /** If set, bring the sender balance to 0 and send all remaining balance to this address */
  closeRemainderTo?: Account
}
interface AssetConfigParams extends CommonTransactionParams {
  configAsset: Asset
  configAssetManager?: Account
  configAssetReserve?: Account
  configAssetFreeze?: Account
  configAssetClawback?: Account
}
interface AssetCreateParams extends CommonTransactionParams {
  name?: str | bytes
  unitName?: str | bytes
  total: uint64
  decimals?: uint64
  manager?: Account
  reserve?: Account
  freeze?: Account
  clawback?: Account
  defaultFrozen?: boolean
  url?: str | bytes
  metadataHash?: bytes
}
export function submitAssetTransfer(params: AssetTransferParams): AssetTransferTxn {
  throw new Error('Not implemented')
}
export function submitPayment(params: PaymentParams): PayTxn {
  throw new Error('Not implemented')
}
export function submitAssetConfig(params: AssetConfigParams): AssetConfigTxn {
  throw new Error('Not implemented')
}

export function submitAssetCreate(params: AssetCreateParams): AssetConfigTxn {
  throw new Error('Not implemented')
}
