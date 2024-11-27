import { microAlgo } from '@algorandfoundation/algokit-utils'
import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('accounts', () => {
  const test = createArc4TestFixture('tests/approvals/accounts.algo.ts', { AccountsContract: {} })

  test('returns account data', async ({ appClientAccountsContract: appClient, expect, assetFactory, testAccount }) => {
    const asset = await assetFactory({ assetName: 'Asset 1', sender: testAccount.addr, total: 1n })

    const result = await appClient.send.call({ method: 'getAccountInfo', args: [testAccount.addr, asset], extraFee: microAlgo(2000) })

    const returnValue = result.return as {
      bytes: number[]
      balance: bigint
      minBalance: bigint
      authAddress: number[]
      totalNumUint: bigint
      totalNumByteSlice: bigint
      totalExtraAppPages: bigint
      totalAppsCreated: bigint
      totalAppsOptedIn: bigint
      totalAssetsCreated: bigint
      totalAssets: bigint
      totalBoxes: bigint
      totalBoxBytes: bigint
      isOptInApp: boolean
      isOptInAsset: boolean
    }

    expect(returnValue.authAddress).toStrictEqual(new Array(32).fill(0))
    expect(returnValue.totalAppsCreated).toBeGreaterThan(0n)
  })
})
