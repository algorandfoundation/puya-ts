import type { Account, Asset } from '@algorandfoundation/algorand-typescript'
import { Contract, Global } from '@algorandfoundation/algorand-typescript'

export class AccountsContract extends Contract {
  public getAccountInfo(account: Account, asset: Asset) {
    return {
      bytes: account.bytes,
      balance: account.balance,
      minBalance: account.minBalance,
      authAddress: account.authAddress.bytes,
      totalNumUint: account.totalNumUint,
      totalNumByteSlice: account.totalNumByteSlice,
      totalExtraAppPages: account.totalExtraAppPages,
      totalAppsCreated: account.totalAppsCreated,
      totalAppsOptedIn: account.totalAppsOptedIn,
      totalAssetsCreated: account.totalAssetsCreated,
      totalAssets: account.totalAssets,
      totalBoxes: account.totalBoxes,
      totalBoxBytes: account.totalBoxBytes,
      isOptInApp: account.isOptedIn(Global.currentApplicationId),
      isOptInAsset: account.isOptedIn(asset),
    }
  }
}
