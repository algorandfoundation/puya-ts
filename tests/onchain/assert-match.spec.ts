import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'
import { microAlgos } from '@algorandfoundation/algokit-utils'

describe('assert match', () => {
  const test = createArc4TestFixture('tests/approvals/assert-match.algo.ts', { AssertMatchContract: {} })

  test('it can be called', async ({ appClientAssertMatchContract, algorand, testAccount }) => {
    const payment = algorand.createTransaction.payment({
      receiver: appClientAssertMatchContract.appAddress,
      sender: testAccount.addr,
      amount: microAlgos(5000),
    })
    appClientAssertMatchContract.send.call({ method: 'testPay', args: [payment] })
  })
})
