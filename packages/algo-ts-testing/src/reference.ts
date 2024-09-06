import { Account, Application, Asset, bytes, internal, uint64 } from '@algorandfoundation/algo-ts'
import { lazyContext } from './context-helpers/internal-context'
import { AccountData, ApplicationData, AssetData, AssetHolding } from './subcontexts/ledger-context'
import { asBigInt, asUint64Cls } from './util'

export class AccountCls implements Account {
  constructor(private address: bytes) {}

  private get data(): AccountData {
    return lazyContext.getAccountData(this.address)
  }

  get bytes(): bytes {
    return this.address
  }

  get balance(): uint64 {
    return this.data.account.balance
  }
  get minBalance(): uint64 {
    return this.data.account.minBalance
  }
  get authAddress(): Account {
    return this.data.account.authAddress
  }
  get totalNumUint(): uint64 {
    return this.data.account.totalNumUint
  }
  get totalNumByteSlice(): uint64 {
    return this.data.account.totalNumByteSlice
  }
  get totalExtraAppPages(): uint64 {
    return this.data.account.totalExtraAppPages
  }
  get totalAppsCreated(): uint64 {
    return this.data.account.totalAppsCreated
  }
  get totalAppsOptedIn(): uint64 {
    return this.data.account.totalAppsOptedIn
  }
  get totalAssetsCreated(): uint64 {
    return this.data.account.totalAssetsCreated
  }
  get totalAssets(): uint64 {
    return this.data.account.totalAssets
  }
  get totalBoxes(): uint64 {
    return this.data.account.totalBoxes
  }
  get totalBoxBytes(): uint64 {
    return this.data.account.totalBoxBytes
  }

  isOptedIn(assetOrApp: Asset | Application): boolean {
    if (assetOrApp instanceof AssetCls) {
      return this.data.optedAssets.has(asUint64Cls(assetOrApp.id).asBigInt())
    }
    if (assetOrApp instanceof ApplicationCls) {
      return this.data.optedApplications.has(asUint64Cls(assetOrApp.id).asBigInt())
    }
    internal.errors.internalError('Invalid argument type. Must be an `algopy.Asset` or `algopy.Application` instance.')
  }
}

export class AssetCls implements Asset {
  constructor(public readonly id: uint64) {}

  private get data(): AssetData {
    return lazyContext.getAssetData(this.id)
  }

  get total(): uint64 {
    return this.data.total
  }
  get decimals(): uint64 {
    return this.data.decimals
  }
  get defaultFrozen(): boolean {
    return this.data.defaultFrozen
  }
  get unitName(): bytes {
    return this.data.unitName
  }
  get name(): bytes {
    return this.data.name
  }
  get url(): bytes {
    return this.data.url
  }
  get metadataHash(): bytes {
    return this.data.metadataHash
  }
  get manager(): Account {
    return this.data.manager
  }
  get reserve(): Account {
    return this.data.reserve
  }
  get freeze(): Account {
    return this.data.freeze
  }
  get clawback(): Account {
    return this.data.clawback
  }
  get creator(): Account {
    return this.data.creator
  }
  balance(account: Account): uint64 {
    return this.getAssetHolding(account).balance
  }
  frozen(account: Account): boolean {
    return this.getAssetHolding(account).frozen
  }

  private getAssetHolding(account: Account): AssetHolding {
    const accountData = lazyContext.getAccountData(account.bytes)
    if (!accountData.optedAssets.has(asBigInt(this.id))) {
      internal.errors.internalError(
        'The asset is not opted into the account! Use `ctx.any.account(opted_asset_balances={{ASSET_ID: VALUE}})` to set emulated opted asset into the account.',
      )
    }
    return accountData.optedAssets.get(asBigInt(this.id))!
  }
}

export class ApplicationCls implements Application {
  constructor(public readonly id: uint64) {}

  private get data(): ApplicationData {
    return lazyContext.getApplicationData(this.id)
  }
  get approvalProgram(): bytes {
    return this.data.approvalProgram
  }
  get clearStateProgram(): bytes {
    return this.data.clearStateProgram
  }
  get globalNumUint(): uint64 {
    return this.data.globalNumUint
  }
  get globalNumBytes(): uint64 {
    return this.data.globalNumBytes
  }
  get localNumUint(): uint64 {
    return this.data.localNumUint
  }
  get localNumBytes(): uint64 {
    return this.data.localNumBytes
  }
  get extraProgramPages(): uint64 {
    return this.data.extraProgramPages
  }
  get creator(): Account {
    return this.data.creator
  }
  get address(): Account {
    return this.data.address
  }
}
