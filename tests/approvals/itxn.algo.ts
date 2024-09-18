import { Contract, Global, itxn } from '@algorandfoundation/algo-ts'

export class ItxnDemoContract extends Contract {
  public createAsset() {
    const asset = itxn
      .assetConfig({
        total: 1,
        decimals: 0,
        defaultFrozen: false,
        assetName: `[VOTE RESULT] `,
        unitName: `VOTERSLT`,
        url: '',
        note: 'note',
        fee: Global.minTxnFee,
      })
      .submit().configAsset
  }
}
