import type { Asset } from '@algorandfoundation/algorand-typescript'
import { Contract, log, Txn } from '@algorandfoundation/algorand-typescript'

export class AssetProxyAlgo extends Contract {
  testAsset(asset: Asset): void {
    log(asset.id)
    log(asset.total)
    log(asset.decimals)
    log(asset.defaultFrozen)
    log(asset.unitName)
    log(asset.name)
    log(asset.url)
    log(asset.metadataHash)
    log(asset.manager)
    log(asset.reserve)
    log(asset.freeze)
    log(asset.clawback)
    log(asset.creator)

    log(asset.balance(Txn.sender))
    log(asset.frozen(Txn.sender))
  }
}
