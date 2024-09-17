import { Contract, Global, itxn } from '@algorandfoundation/algo-ts'

export class ItxnDemoContract extends Contract {
  public createAsset() {
    const asset = itxn
      .assetConfig({
        configAssetTotal: 1,
        configAssetDecimals: 0,
        configAssetDefaultFrozen: false,
        configAssetName: `[VOTE RESULT] `,
        configAssetUnitName: `VOTERSLT`,
        configAssetUrl: '',
        note: 'note',
        fee: Global.minTxnFee,
      })
      .submit().configAsset
  }
}
