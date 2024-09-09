import { Account, Application, Asset, bytes, internal, uint64 } from '@algorandfoundation/algo-ts'
import { lazyContext } from '../context-helpers/internal-context'
import { asBytes, asUint64, asUint64Cls } from '../util'
import { DEFAULT_ACCOUNT_MIN_BALANCE, ZERO_ADDRESS } from '../constants'
import { AssetCls } from './asset'
import { ApplicationCls } from './application'
import { Mutable } from '../typescript-helpers'

export class AssetHolding {
  balance: uint64
  frozen: boolean
  constructor(balance: internal.primitives.StubUint64Compat, frozen: boolean) {
    this.balance = asUint64(balance)
    this.frozen = frozen
  }
}

export class AccountData {
  optedAssets = new Map<bigint, AssetHolding>()
  optedApplications = new Map<bigint, Application>()
  account: Mutable<Omit<Account, 'bytes' | 'isOptedIn'>>

  constructor() {
    this.account = {
      totalAppsCreated: 0,
      totalAppsOptedIn: 0,
      totalAssets: 0,
      totalAssetsCreated: 0,
      totalBoxBytes: 0,
      totalBoxes: 0,
      totalExtraAppPages: 0,
      totalNumByteSlice: 0,
      totalNumUint: 0,
      minBalance: DEFAULT_ACCOUNT_MIN_BALANCE,
      balance: 0,
      authAddress: Account(),
    }
  }
}

export class AccountCls implements Account {
  readonly bytes: bytes

  constructor(address?: internal.primitives.StubBytesCompat) {
    this.bytes = asBytes(address ?? ZERO_ADDRESS)
  }

  private get data(): AccountData {
    return lazyContext.getAccountData(this.bytes)
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
