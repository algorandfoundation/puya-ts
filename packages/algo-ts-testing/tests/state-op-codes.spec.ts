import { Account, bytes, Bytes, internal, Uint64 } from '@algorandfoundation/algo-ts';
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec';
import { afterEach, describe, expect, test } from 'vitest';
import { TestExecutionContext } from '../src';
import { generateTestAccount, generateTestAsset, getAlgorandAppClient, getAvmResult, getLocalNetDefaultAccount, INITIAL_BALANCE_MICRO_ALGOS } from './avm-invoker';

import { ZERO_ADDRESS } from '../src/constants';
import { AccountCls } from '../src/impl/account';
import { asBigInt } from '../src/util';
import { StateAcctParamsGetContract, StateAssetParamsContract } from './artifacts/state-ops/contract.algo';
import acctParamsAppSpecJson from './artifacts/state-ops/data/StateAcctParamsGetContract.arc32.json';
import assetParamsAppSpecJson from './artifacts/state-ops/data/StateAssetParamsContract.arc32.json';
import { asUint8Array } from './util';


describe('State op codes', async () => {
  const ctx = new TestExecutionContext()

  afterEach(async () => {
    ctx.reset()
  })

  describe('AcctParams', async () => {
    const appClient = await getAlgorandAppClient(acctParamsAppSpecJson as AppSpec)
    // const dummyAccount = await getLocalNetDefaultAccount()

    test.each([
      ["verify_acct_balance", INITIAL_BALANCE_MICRO_ALGOS + 100_000],
      // ["verify_acct_min_balance", 100_000],
      // ["verify_acct_auth_addr", ZERO_ADDRESS],
      // ["verify_acct_total_num_uint", 0],
      // ["verify_acct_total_num_byte_slice", 0],
      // ["verify_acct_total_extra_app_pages", 0],
      // ["verify_acct_total_apps_created", 0],
      // ["verify_acct_total_apps_opted_in", 0],
      // ["verify_acct_total_assets_created", 0],
      // ["verify_acct_total_assets", 0],
      // ["verify_acct_total_boxes", 0],
      // ["verify_acct_total_box_bytes", 0],
    ])('should return the correct field value of the account', async (methodName, expectedValue) => {
      const dummyAccount = await generateTestAccount()

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

      const avmResult = await getAvmResult({ appClient }, methodName, dummyAccount.addr)

      const mockContract = ctx.contract.create(StateAcctParamsGetContract)
      const mockResult = mockContract[methodName as keyof StateAcctParamsGetContract](mockAccount)

      expect(mockResult.valueOf()).toEqual(avmResult)
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
})
