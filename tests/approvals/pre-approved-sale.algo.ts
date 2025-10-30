import type { Account, Asset, uint64 } from '@algorandfoundation/algorand-typescript'
import { assertMatch, Global, gtxn, LogicSig, TemplateVar, Uint64 } from '@algorandfoundation/algorand-typescript'

/**
 * Allows for pre-authorising the sale of an asset for a pre-determined price, but to an
 * undetermined buyer.
 *
 * The checks here are not meant to be exhaustive
 */
export class PreApprovedSale extends LogicSig {
  program() {
    const seller = TemplateVar<Account>('SELLER')
    const price = TemplateVar<uint64>('PRICE')
    const asset = TemplateVar<Asset>('ASSET')

    const payTxn = gtxn.PaymentTxn(0)
    const assetTxn = gtxn.AssetTransferTxn(1)
    assertMatch(payTxn, {
      receiver: seller,
      amount: price,
    })

    assertMatch(assetTxn, {
      assetAmount: Uint64(1),
      sender: seller,
      xferAsset: asset,
      assetCloseTo: Global.zeroAddress,
      rekeyTo: Global.zeroAddress,
    })

    return true
  }
}
