import { microAlgos } from '@algorandfoundation/algokit-utils'
import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('assert match', () => {
  const test = createArc4TestFixture({ path: 'tests/approvals/assert-match.algo.ts', contracts: { AssertMatchContract: {} } })

  test('it can be called', async ({ appClientAssertMatchContract, algorand, testAccount }) => {
    const payment = algorand.createTransaction.payment({
      receiver: appClientAssertMatchContract.appAddress,
      sender: testAccount.addr,
      amount: microAlgos(105000),
    })
    await appClientAssertMatchContract.send.call({ method: 'testPay', args: [payment] })
  })
})
