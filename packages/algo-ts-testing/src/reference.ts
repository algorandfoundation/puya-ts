import { Account, Application, Asset, bytes, internal, uint64 } from '@algorandfoundation/algo-ts'
import { lazyContext } from './context-helpers/internal-context'
import { AccountData } from './subcontexts/ledger-context'
import { asUint64Cls } from './util'

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
  get total(): uint64 {
    throw new Error('Not implemented')
  }
  get decimals(): uint64 {
    throw new Error('Not implemented')
  }
  get defaultFrozen(): boolean {
    throw new Error('Not implemented')
  }
  get unitName(): bytes {
    throw new Error('Not implemented')
  }
  get name(): bytes {
    throw new Error('Not implemented')
  }
  get url(): bytes {
    throw new Error('Not implemented')
  }
  get metadataHash(): bytes {
    throw new Error('Not implemented')
  }
  get manager(): Account {
    throw new Error('Not implemented')
  }
  get reserve(): Account {
    throw new Error('Not implemented')
  }
  get freeze(): Account {
    throw new Error('Not implemented')
  }
  get clawback(): Account {
    throw new Error('Not implemented')
  }
  get creator(): Account {
    throw new Error('Not implemented')
  }
  balance(_account: Account): uint64 {
    throw new Error('Method not implemented.')
  }
  frozen(_account: Account): boolean {
    throw new Error('Method not implemented.')
  }
}

export class ApplicationCls implements Application {
  constructor(public readonly id: uint64) {}
  get approvalProgram(): bytes {
    throw new Error('Method not implemented.')
  }
  get clearStateProgram(): bytes {
    throw new Error('Method not implemented.')
  }
  get globalNumUint(): uint64 {
    throw new Error('Method not implemented.')
  }
  get globalNumBytes(): uint64 {
    throw new Error('Method not implemented.')
  }
  get localNumUint(): uint64 {
    throw new Error('Method not implemented.')
  }
  get localNumBytes(): uint64 {
    throw new Error('Method not implemented.')
  }
  get extraProgramPages(): uint64 {
    throw new Error('Method not implemented.')
  }
  get creator(): Account {
    throw new Error('Method not implemented.')
  }
  get address(): Account {
    throw new Error('Method not implemented.')
  }
}
