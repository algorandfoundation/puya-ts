import { describe } from 'vitest'
import { createTestFixture } from './util/test-fixture'

describe('accounts', () => {
  const test = createTestFixture('tests/approvals/accounts.algo.ts')

  test('returns account data', async ({ appClient, expect, assetFactory, testAccount }) => {
    const asset = await assetFactory({ assetName: 'Asset 1', sender: testAccount.addr, total: 1n })

    const result = await appClient.send.call({ method: 'getAccountInfo', args: [testAccount.addr, asset] })

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
  })
})
