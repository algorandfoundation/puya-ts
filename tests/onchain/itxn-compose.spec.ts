import { algos } from '@algorandfoundation/algokit-utils'
import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('itxn compose', () => {
  const test = createArc4TestFixture({
    paths: 'tests/approvals/itxn-compose.algo.ts',
    contracts: {
      ItxnComposeAlgo: { funding: algos(5) },
      VerifierContract: {},
    },
  })

  test('it can be called', async ({ localnet, algorand, appClientVerifierContract, appClientItxnComposeAlgo, testAccount }) => {
    const testAccounts = [
      await localnet.context.generateAccount({ initialFunds: algos(1) }),
      await localnet.context.generateAccount({ initialFunds: algos(1) }),
      await localnet.context.generateAccount({ initialFunds: algos(1) }),
    ]

    const pay = algorand.createTransaction.payment({
      sender: testAccount.addr,
      amount: algos(9),
      receiver: appClientItxnComposeAlgo.appAddress,
    })

    await appClientItxnComposeAlgo.send.call({
      method: 'distribute',
      args: [testAccounts.map((a) => a.addr.publicKey), pay, appClientVerifierContract.appId],
      extraFee: algos(1),
    })
  })
  test('it can be called conditionally', async ({ appClientItxnComposeAlgo }) => {
    await appClientItxnComposeAlgo.send.call({ method: 'conditionalBegin', args: [4], extraFee: algos(1) })
  })
})
