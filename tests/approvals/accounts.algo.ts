import type { Asset } from '@algorandfoundation/algorand-typescript'
import { Account, Bytes, Contract, ensureBudget, Global } from '@algorandfoundation/algorand-typescript'

export class AccountsContract extends Contract {
  public getAccountInfo(account: Account, asset: Asset) {
    ensureBudget(1400)
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

  public otherAccount() {
    // Create from account address
    const account = Account('A7NMWS3NT3IUDMLVO26ULGXGIIOUQ3ND2TXSER6EBGRZNOBOUIQXHIBGDE')
    // Create from account public key byte
    const account2 = Account(Bytes.fromHex('07DACB4B6D9ED141B17576BD459AE6421D486DA3D4EF2247C409A396B82EA221'))
  }
}
