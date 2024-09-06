import { Account, Application, Asset, bytes, Bytes, internal, Uint64, uint64 } from '@algorandfoundation/algo-ts'
import algosdk from 'algosdk'
import { randomBytes } from 'crypto'
import { ALWAYS_APPROVE_TEAL_PROGRAM, MAX_BYTES_SIZE, MAX_UINT64, ZERO_ADDRESS } from '../constants'
import { lazyContext } from '../context-helpers/internal-context'
import { AccountCls, ApplicationCls, AssetCls } from '../reference'
import { AccountData, ApplicationData, AssetData } from '../subcontexts/ledger-context'
import { asBigInt, getRandomBigInt } from '../util'

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

  account(
    address?: string,
    account?: Partial<AccountData>,
    optedAssetBalances?: Map<internal.primitives.StubUint64Compat, internal.primitives.StubUint64Compat>,
  ): Account {
    if (address && lazyContext.ledger.accountDataMap.has(address)) {
      internal.errors.internalError(
        'Account with such address already exists in testing context. Use `context.ledger.getAccount(address)` to retrieve the existing account.',
      )
    }

    const addr = address ?? algosdk.generateAccount().addr
    const data = new AccountData()
    data.account = {
      ...data.account,
      ...account,
    }
    lazyContext.ledger.accountDataMap.set(addr, data)

    if (optedAssetBalances) {
      for (const [assetId, balance] of optedAssetBalances) {
        lazyContext.ledger.updateAssetHolding(addr, assetId, balance)
      }
    }
    return new AccountCls(Bytes(addr))
  }

  asset(assetId?: internal.primitives.StubUint64Compat, assetData?: Partial<AssetData>): Asset {
    if (assetId && lazyContext.ledger.assetDataMap.has(asBigInt(assetId))) {
      internal.errors.internalError('Asset with such ID already exists in testing context!')
    }
    const id = internal.primitives.Uint64Cls.fromCompat(assetId ?? lazyContext.ledger.assetIdIter.next().value)
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
    lazyContext.ledger.assetDataMap.set(id.asBigInt(), {
      ...defaultAssetData,
      ...assetData,
    })
    return new AssetCls(id.asAlgoTs())
  }

  application(applicationId?: internal.primitives.StubUint64Compat, applicationData?: Partial<ApplicationData>): Application {
    if (applicationId && lazyContext.ledger.applicationDataMap.has(asBigInt(applicationId))) {
      internal.errors.internalError('Application with such ID already exists in testing context!')
    }
    const id = internal.primitives.Uint64Cls.fromCompat(applicationId ?? lazyContext.ledger.appIdIter.next().value)
    const defaultApplicationData = {
      approvalProgram: ALWAYS_APPROVE_TEAL_PROGRAM,
      clearStateProgram: ALWAYS_APPROVE_TEAL_PROGRAM,
      globalNumUint: 0,
      globalNumBytes: 0,
      localNumUint: 0,
      localNumBytes: 0,
      extraProgramPages: 0,
      creator: lazyContext.defaultSender,
      address: lazyContext.defaultSender,
    }
    lazyContext.ledger.applicationDataMap.set(id.asBigInt(), {
      ...defaultApplicationData,
      ...applicationData,
    })
    return new ApplicationCls(id.asAlgoTs())
  }
}
