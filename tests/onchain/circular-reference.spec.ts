import { algo } from '@algorandfoundation/algokit-utils'
import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('circular references', () => {
  const test = createArc4TestFixture({
    paths: ['tests/approvals/circular-reference.algo.ts', 'tests/approvals/circular-reference-2.algo.ts'],
    contracts: {
      ContractOne: {},
      ContractTwo: {},
    },
  })

  test('One can call two', async ({ appClientContractOne, appClientContractTwo }) => {
    await appClientContractOne.send.call({ method: 'test3', args: [appClientContractTwo.appId], extraFee: algo(2) })
  })
  test('Two can call one', async ({ appClientContractOne, appClientContractTwo }) => {
    await appClientContractTwo.send.call({ method: 'test3', args: [appClientContractOne.appId], extraFee: algo(2) })
  })
})
