import { algo } from '@algorandfoundation/algokit-utils'
import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('c2c clientgen', () => {
  const test = createArc4TestFixture({
    paths: ['tests/other/c2c-client/c2c-clientgen.algo.ts', 'tests/approvals/strings.algo.ts'],
    contracts: {
      C2CClientgenTest: { funding: algo(1) },
      StringContract: {},
    },
  })

  test('can call string contract functions via generated client', async ({ appClientC2CClientgenTest, appClientStringContract }) => {
    await appClientC2CClientgenTest.send.call({
      method: 'testContractClient',
      args: [appClientStringContract.appId],
      extraFee: algo(1), //cover inners
    })
  })
})
