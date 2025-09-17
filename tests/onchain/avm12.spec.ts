import { algos } from '@algorandfoundation/algokit-utils'
import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('avm12', () => {
  const test = createArc4TestFixture('tests/approvals/avm12.algo.ts', { Avm12Contract: {} })

  test('reject wrong app version', async ({ appClientAvm12Contract }) => {
    await appClientAvm12Contract.fundAppAccount({ amount: algos(1) })
    await appClientAvm12Contract.send.call({ method: 'testRejectVersion', args: [], extraFee: algos(1) })
  })
})
