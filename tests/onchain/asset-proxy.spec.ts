import { describe } from 'vitest'
import { invariant, uint8ArrayToBase32, uint8ArrayToBigInt, uint8ArrayToHex, uint8ArrayToUtf8 } from '../../src/util'
import { createArc4TestFixture } from './util/test-fixture'

describe('asset proxy contract', () => {
  const test = createArc4TestFixture({
    path: 'tests/approvals/asset-proxy.algo.ts',
    contracts: {
      AssetProxyAlgo: {},
    },
  })
  test('it runs', async ({ appClientAssetProxyAlgo, assetFactory, testAccount, expect }) => {
    const mdh = new Uint8Array(32)
    const asset = await assetFactory({
      assetName: 'test-asset',
      unitName: 'biggies',
      clawback: testAccount.addr,
      manager: testAccount.addr,
      reserve: testAccount.addr,
      freeze: testAccount.addr,
      total: 100n,
      decimals: 2,
      sender: testAccount.addr,
      defaultFrozen: false,
      url: 'abc',
      metadataHash: mdh,
    })

    const result = await appClientAssetProxyAlgo.send.call({ method: 'testAsset', args: [asset] })

    expect(result.confirmation.logs?.length).toBe(15)
    invariant(result.confirmation.logs, 'there are logs')
    const [
      id,
      total,
      decimals,
      defaultFrozen,
      unitName,
      name,
      url,
      metadataHash,
      manager,
      reserve,
      freeze,
      clawback,
      creator,
      balance,
      frozen,
    ] = result.confirmation.logs

    expect(uint8ArrayToBigInt(id)).toBe(asset)
    expect(uint8ArrayToBigInt(total)).toBe(100n)
    expect(uint8ArrayToBigInt(decimals)).toBe(2n)
    expect(uint8ArrayToBigInt(defaultFrozen)).toBe(0n)
    expect(uint8ArrayToUtf8(unitName)).toBe('biggies')
    expect(uint8ArrayToUtf8(name)).toBe('test-asset')
    expect(uint8ArrayToUtf8(url)).toBe('abc')
    expect(uint8ArrayToHex(metadataHash)).toBe(uint8ArrayToHex(mdh))
    expect(uint8ArrayToBase32(manager)).toBe(uint8ArrayToBase32(testAccount.addr.publicKey))
    expect(uint8ArrayToBase32(reserve)).toBe(uint8ArrayToBase32(testAccount.addr.publicKey))
    expect(uint8ArrayToBase32(freeze)).toBe(uint8ArrayToBase32(testAccount.addr.publicKey))
    expect(uint8ArrayToBase32(clawback)).toBe(uint8ArrayToBase32(testAccount.addr.publicKey))
    expect(uint8ArrayToBase32(creator)).toBe(uint8ArrayToBase32(testAccount.addr.publicKey))
    expect(uint8ArrayToBigInt(balance)).toBe(100n)
    expect(uint8ArrayToBigInt(frozen)).toBe(0n)
  })
})
