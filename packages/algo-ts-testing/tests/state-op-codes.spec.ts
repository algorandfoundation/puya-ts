import { Account, bytes, Bytes, internal, Uint64 } from '@algorandfoundation/algo-ts';
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec';
import { afterEach, describe, expect, test } from 'vitest';
import { TestExecutionContext } from '../src';
import { generateTestAsset, getAlgorandAppClient, getAvmResult, getLocalNetDefaultAccount } from './avm-invoker';

import { ZERO_ADDRESS } from '../src/constants';
import { AccountCls } from '../src/impl/account';
import { asBigInt } from '../src/util';
import { StateAssetParamsContract } from './artifacts/state-ops/contract.algo';
import assetParamsAppSpecJson from './artifacts/state-ops/data/StateAssetParamsContract.arc32.json';
import { asUint8Array } from './util';

describe('State op codes', async () => {
  const ctx = new TestExecutionContext()

  afterEach(async () => {
    ctx.reset()
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

      const mockContract = ctx.contract.create(StateAssetParamsContract)
      const avmResult = await getAvmResult({ appClient }, methodName, asBigInt(dummyAsset))
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
