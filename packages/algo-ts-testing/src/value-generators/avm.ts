import { Account, Application, Asset, bytes, Bytes, internal, Uint64, uint64 } from '@algorandfoundation/algo-ts'
import algosdk from 'algosdk'
import { randomBytes } from 'crypto'
import { MAX_BYTES_SIZE, MAX_UINT64, ZERO_ADDRESS } from '../constants'
import { lazyContext } from '../context-helpers/internal-context'
import { AccountCls, AccountData } from '../impl/account'
import { ApplicationCls, ApplicationData } from '../impl/application'
import { AssetCls, AssetData } from '../impl/asset'
import { asBigInt, asBytesCls, asUint64Cls, getRandomBigInt } from '../util'

type AccountContextData = Partial<AccountData['account']> & {
  address?: internal.primitives.StubBytesCompat
  optedAssetBalances?: Map<internal.primitives.StubUint64Compat, internal.primitives.StubUint64Compat>
  optedApplications?: Application[]
}

type AssetContextData = Partial<AssetData> & { assetId?: internal.primitives.StubUint64Compat }

type ApplicationContextData = Partial<ApplicationData['application']> & { applicationId?: internal.primitives.StubUint64Compat }

export class AvmValueGenerator {
  uint64(minValue: number | bigint = 0n, maxValue: number | bigint = MAX_UINT64): uint64 {
    if (maxValue > MAX_UINT64) {
      internal.errors.internalError('maxValue must be less than or equal to MAX_UINT64')
    }
    if (minValue > maxValue) {
      internal.errors.internalError('minValue must be less than or equal to maxValue')
    }
    if (minValue < 0n || maxValue < 0n) {
      internal.errors.internalError('minValue and maxValue must be greater than or equal to 0')
    }
    return Uint64(getRandomBigInt(minValue, maxValue))
  }

  bytes(length = MAX_BYTES_SIZE): bytes {
    return Bytes(new Uint8Array(randomBytes(length)))
  }

  account(input?: AccountContextData): Account {
    const addr = input?.address ? asBytesCls(input.address).toString() : undefined
    if (addr && lazyContext.ledger.accountDataMap.has(addr)) {
      internal.errors.internalError(
        'Account with such address already exists in testing context. Use `context.ledger.getAccount(address)` to retrieve the existing account.',
      )
    }

    const accountAddress = addr ?? algosdk.generateAccount().addr
    const data = new AccountData()
    const { address, optedAssetBalances, optedApplications, ...account } = input ?? {}
    data.account = {
      ...data.account,
      ...account,
    }
    lazyContext.ledger.accountDataMap.set(accountAddress, data)

    if (input?.optedAssetBalances) {
      for (const [assetId, balance] of input.optedAssetBalances) {
        lazyContext.ledger.updateAssetHolding(accountAddress, assetId, balance)
      }
    }
    if (input?.optedApplications) {
      for (const app of input.optedApplications) {
        data.optedApplications.set(asBigInt(app.id), app)
      }
    }
    return new AccountCls(Bytes(accountAddress))
  }

  asset(input?: AssetContextData): Asset {
    const id = input?.assetId
    if (id && lazyContext.ledger.assetDataMap.has(asBigInt(id))) {
      internal.errors.internalError('Asset with such ID already exists in testing context!')
    }
    const assetId = asUint64Cls(id ?? lazyContext.ledger.assetIdIter.next().value)
    const defaultAssetData = {
      total: lazyContext.any.uint64(),
      decimals: lazyContext.any.uint64(1, 6),
      defaultFrozen: false,
      unitName: lazyContext.any.bytes(4),
      name: lazyContext.any.bytes(32),
      url: lazyContext.any.bytes(10),
      metadataHash: lazyContext.any.bytes(32),
      manager: Account(ZERO_ADDRESS),
      freeze: Account(ZERO_ADDRESS),
      clawback: Account(ZERO_ADDRESS),
      creator: lazyContext.defaultSender,
      reserve: Account(ZERO_ADDRESS),
    }
    const { assetId: _, ...assetData } = input ?? {}
    lazyContext.ledger.assetDataMap.set(assetId.asBigInt(), {
      ...defaultAssetData,
      ...assetData,
    })
    return new AssetCls(assetId.asAlgoTs())
  }

  application(input?: ApplicationContextData): Application {
    const id = input?.applicationId
    if (id && lazyContext.ledger.applicationDataMap.has(asBigInt(id))) {
      internal.errors.internalError('Application with such ID already exists in testing context!')
    }
    const applicationId = asUint64Cls(id ?? lazyContext.ledger.appIdIter.next().value)
    const data = new ApplicationData()
    const { applicationId: _, ...applicationData } = input ?? {}
    data.application = {
      ...data.application,
      ...applicationData,
    }
    lazyContext.ledger.applicationDataMap.set(applicationId.asBigInt(), data)
    return new ApplicationCls(applicationId.asAlgoTs())
  }
}
