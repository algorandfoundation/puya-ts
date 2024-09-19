import { Account, bytes, Bytes, internal, op, uint64, Uint64 } from '@algorandfoundation/algo-ts';
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec';
import { afterEach, describe, expect, it, test } from 'vitest';
import { TestExecutionContext } from '../src';
import { generateTestAccount, generateTestAsset, getAlgorandAppClient, getAlgorandAppClientWithApp, getAvmResult, getLocalNetDefaultAccount, INITIAL_BALANCE_MICRO_ALGOS } from './avm-invoker';

import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount';
import { ZERO_ADDRESS } from '../src/constants';
import { AccountCls } from '../src/impl/account';
import { asBigInt, asNumber } from '../src/util';
import { StateAcctParamsGetContract, StateAppParamsContract, StateAssetHoldingContract, StateAssetParamsContract } from './artifacts/state-ops/contract.algo';
import acctParamsAppSpecJson from './artifacts/state-ops/data/StateAcctParamsGetContract.arc32.json';
import appParamsAppSpecJson from './artifacts/state-ops/data/StateAppParamsContract.arc32.json';
import assetHoldingAppSpecJson from './artifacts/state-ops/data/StateAssetHoldingContract.arc32.json';
import assetParamsAppSpecJson from './artifacts/state-ops/data/StateAssetParamsContract.arc32.json';
import { asUint8Array } from './util';


describe('State op codes', async () => {
  const ctx = new TestExecutionContext()

  afterEach(async () => {
    ctx.reset()
  })

  describe('AcctParams', async () => {
    const appClient = await getAlgorandAppClient(acctParamsAppSpecJson as AppSpec)
    const dummyAccount = await generateTestAccount()

    test.each([
      ["verify_acct_balance", INITIAL_BALANCE_MICRO_ALGOS + 100_000],
      ["verify_acct_min_balance", 100_000],
      ["verify_acct_auth_addr", ZERO_ADDRESS],
      ["verify_acct_total_num_uint", 0],
      ["verify_acct_total_num_byte_slice", 0],
      ["verify_acct_total_extra_app_pages", 0],
      ["verify_acct_total_apps_created", 0],
      ["verify_acct_total_apps_opted_in", 0],
      ["verify_acct_total_assets_created", 0],
      ["verify_acct_total_assets", 0],
      ["verify_acct_total_boxes", 0],
      ["verify_acct_total_box_bytes", 0],
    ])('should return the correct field value of the account', async (methodName, expectedValue) => {
      const mockAccount = ctx.any.account({
        address: dummyAccount.addr,
        balance: Uint64(INITIAL_BALANCE_MICRO_ALGOS + 100000),
        minBalance: Uint64(100000),
        authAddress: Account(ZERO_ADDRESS),
        totalNumUint: Uint64(0),
        totalNumByteSlice: Uint64(0),
        totalExtraAppPages: Uint64(0),
        totalAppsCreated: Uint64(0),
        totalAppsOptedIn: Uint64(0),
        totalAssetsCreated: Uint64(0),
        totalAssets: Uint64(0),
        totalBoxes: Uint64(0),
        totalBoxBytes: Uint64(0),
      })

      const avmResult = await getAvmResult({ appClient, sendParams: { fee: AlgoAmount.Algos(1000) } }, methodName, dummyAccount.addr)

      const mockContract = ctx.contract.create(StateAcctParamsGetContract)
      const mockResult = mockContract[methodName as keyof StateAcctParamsGetContract](mockAccount)
      if (mockResult instanceof AccountCls) {
        expect(mockResult.bytes.valueOf()).toEqual(avmResult)
        expect(mockResult.bytes.valueOf()).toEqual((expectedValue as bytes).valueOf())
      } else {
        expect(mockResult.valueOf()).toEqual(avmResult)
        expect(asNumber(mockResult as uint64)).toEqual(expectedValue)
      }
    })
  })

  describe('AppParams', async () => {
    const [appClient, app] = await getAlgorandAppClientWithApp(appParamsAppSpecJson as AppSpec)
    const dummyAccount = await getLocalNetDefaultAccount()
    test.each([
      ["verify_app_params_get_approval_program", undefined],
      ["verify_app_params_get_clear_state_program", undefined],
      ["verify_app_params_get_global_num_uint", 0],
      ["verify_app_params_get_global_num_byte_slice", 0],
      ["verify_app_params_get_local_num_uint", 0],
      ["verify_app_params_get_local_num_byte_slice", 0],
      ["verify_app_params_get_extra_program_pages", 0],
      ["verify_app_params_get_creator", "app.creator"],
      ["verify_app_params_get_address", "app.address"],
    ])('should return the correct field value of the application', async (methodName, expectedValue) => {
      const application = ctx.any.application({
        applicationId: app.appId,
        approvalProgram: Bytes(app.compiledApproval.compiledBase64ToBytes),
        clearStateProgram: Bytes(app.compiledClear.compiledBase64ToBytes),
        globalNumUint: Uint64(0),
        globalNumBytes: Uint64(0),
        localNumUint: Uint64(0),
        localNumBytes: Uint64(0),
        extraProgramPages: Uint64(0),
        creator: Account(Bytes(dummyAccount.addr)),
      })
      const avmResult = await getAvmResult({ appClient, sendParams: { fee: AlgoAmount.Algos(1000) } }, methodName, app.appId)

      const mockContract = ctx.contract.create(StateAppParamsContract)
      const mockResult = mockContract[methodName as keyof StateAppParamsContract](application)

      if (mockResult instanceof internal.primitives.BytesCls) {
        expect([...asUint8Array(mockResult)]).toEqual(avmResult)
      } else if (mockResult instanceof AccountCls) {
        expect(mockResult.bytes.valueOf()).toEqual(avmResult)
        const expected = expectedValue === 'app.creator' ? application.creator : expectedValue === 'app.address' ? application.address : undefined
        if (expected) {
          expect(mockResult.bytes.valueOf()).toEqual(expected.bytes.valueOf())
        }
      } else {
        expect(mockResult.valueOf()).toEqual(avmResult)
        expect(asNumber(mockResult as uint64)).toEqual(expectedValue)
      }
    })
  })

  describe('AssetHolding', async () => {
    const appClient = await getAlgorandAppClient(assetHoldingAppSpecJson as AppSpec)
    const dummyAccount = await getLocalNetDefaultAccount()
    test.each([
      ['verify_asset_holding_get', 100],
      ['verify_asset_frozen_get', false],
    ])('should return the correct field value of the asset holding', async (methodName, expectedValue) => {
      const dummyAsset = await generateTestAsset({
        creator: dummyAccount,
        total: 100,
        decimals: 0,
        frozenByDefault: false
      })
      const avmResult = await getAvmResult({ appClient }, methodName, dummyAccount.addr, asBigInt(dummyAsset))

      const mockAsset = ctx.any.asset()
      const mockAccount = ctx.any.account({
        optedAssetBalances: new Map([[mockAsset.id, 100]])
      })
      const mockContract = ctx.contract.create(StateAssetHoldingContract)
      const mockResult = mockContract[methodName as keyof StateAssetHoldingContract](mockAccount, mockAsset)

      if (typeof mockResult === 'boolean') {
        expect(mockResult).toEqual(avmResult)
        expect(mockResult).toEqual(expectedValue)
      } else {
        expect(mockResult.valueOf()).toEqual(avmResult)
        expect(asNumber(mockResult as uint64)).toEqual(expectedValue)
      }
    })
  })

  describe('AssetParams', async () => {
    const appClient = await getAlgorandAppClient(assetParamsAppSpecJson as AppSpec)
    const dummyAccount = await getLocalNetDefaultAccount()

    test.each([
      ["verify_asset_params_get_total", 100n],
      ["verify_asset_params_get_decimals", 0n],
      ["verify_asset_params_get_default_frozen", false],
      ["verify_asset_params_get_unit_name", Bytes("UNIT")],
      ["verify_asset_params_get_name", Bytes("TEST")],
      ["verify_asset_params_get_url", Bytes("https://algorand.co")],
      ["verify_asset_params_get_metadata_hash", Bytes("test" + " ".repeat(28))],
      ["verify_asset_params_get_manager", ZERO_ADDRESS],
      ["verify_asset_params_get_reserve", ZERO_ADDRESS],
      ["verify_asset_params_get_freeze", ZERO_ADDRESS],
      ["verify_asset_params_get_clawback", ZERO_ADDRESS],
      ["verify_asset_params_get_creator", "creator"],
    ])('should return the correct field value of the asset', async (methodName, expectedValue) => {
      const creator = dummyAccount.addr
      const metadataHash = Bytes("test" + " ".repeat(28))
      const mockAsset = ctx.any.asset({
        total: Uint64(100),
        decimals: Uint64(0),
        name: Bytes("TEST"),
        unitName: Bytes("UNIT"),
        url: Bytes("https://algorand.co"),
        metadataHash: metadataHash,
        creator: Account(Bytes(creator)),
      })

      const dummyAsset = await generateTestAsset({
        creator: dummyAccount,
        total: 100,
        decimals: 0,
        frozenByDefault: false,
        name: "TEST",
        unit: "UNIT",
        url: "https://algorand.co",
        metadataHash: metadataHash.toString(),
      })

      const avmResult = await getAvmResult({ appClient }, methodName, asBigInt(dummyAsset))

      const mockContract = ctx.contract.create(StateAssetParamsContract)
      const mockResult = mockContract[methodName as keyof StateAssetParamsContract](mockAsset)

      if (mockResult instanceof internal.primitives.BytesCls) {
        expect([...asUint8Array(mockResult)]).toEqual(avmResult)
        expect(asUint8Array(mockResult)).toEqual(asUint8Array(expectedValue as bytes))
      } else if (mockResult instanceof AccountCls) {
        expect(mockResult.bytes.valueOf()).toEqual(avmResult)

        const expectedString = expectedValue === 'creator' ? creator : (expectedValue as bytes).valueOf()
        expect(mockResult.bytes.valueOf()).toEqual(expectedString)
      }
      else {
        expect(mockResult.valueOf()).toEqual(avmResult)
        expect(mockResult.valueOf()).toEqual(expectedValue)
      }
    })
  })

  describe('Global', async () => {
    it('should return the correct global field value', async () => {
      const creator = ctx.any.account()
      const app = ctx.any.application({ creator })
      const txn1 = ctx.any.txn.applicationCall({ appId: app })
      let firstGroupId = Bytes()
      let firstTimestamp = Uint64(0)
      let secondGroupId = Bytes()
      let secondTimestamp= Uint64(0)
      ctx.txn.createScope([txn1]).execute(() => {
        firstGroupId = op.Global.groupId
        firstTimestamp = op.Global.latestTimestamp
        expect(firstGroupId.length.valueOf()).toEqual(32n)
        expect(firstTimestamp.valueOf()).not.toEqual(0n)
        expect(op.Global.groupSize.valueOf()).toEqual(1n)
        expect(op.Global.round.valueOf()).toEqual(1n)
        expect(op.Global.callerApplicationId.valueOf()).toEqual(0n)
        expect(op.Global.creatorAddress).toEqual(creator)
        expect(op.Global.currentApplicationId).toEqual(app)
        expect(op.Global.currentApplicationAddress).toEqual(app.address)
      })
      const txn2 = ctx.any.txn.payment()
      const txn3 = ctx.any.txn.applicationCall()
      const caller = ctx.any.application()
      ctx.ledger.patchGlobalData({callerApplicationId: caller.id})
      ctx.txn.createScope([txn2, txn3]).execute(() => {
        secondGroupId = op.Global.groupId
        secondTimestamp = op.Global.latestTimestamp
        expect(secondGroupId.length.valueOf()).toEqual(32n)
        expect(secondTimestamp.valueOf()).not.toEqual(0n)
        expect(op.Global.groupSize.valueOf()).toEqual(2n)
        expect(op.Global.round.valueOf()).toEqual(2n)
        expect(op.Global.callerApplicationId.valueOf()).toEqual(caller.id.valueOf())
        expect(op.Global.callerApplicationAddress).toEqual(caller.address)
      })
      expect(asUint8Array(firstGroupId)).not.toEqual(asUint8Array(secondGroupId))
      expect(firstTimestamp.valueOf()).not.toEqual(secondTimestamp.valueOf())
    })
  })
})