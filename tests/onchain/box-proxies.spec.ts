import { algos } from '@algorandfoundation/algokit-utils'
import { describe } from 'vitest'
import { invariant } from '../../src/util'
import { createBaseTestFixture } from './util/test-fixture'

describe('BoxProxies', () => {
  const test = createBaseTestFixture('tests/approvals/box-proxies.algo.ts', ['BoxContract'])

  test('Should run', async ({ BoxContractInvoker, algorand, testAccount }) => {
    const created = await BoxContractInvoker.send()

    invariant(created.confirmation.applicationIndex, 'There must be an application id')
    const appInfo = await algorand.app.getById(created.confirmation.applicationIndex)
    // Fund the app account
    await algorand.send.payment({
      receiver: appInfo.appAddress,
      sender: testAccount.addr,
      amount: algos(1),
    })
    await BoxContractInvoker.send({
      appId: created.confirmation.applicationIndex,
      boxReferences: ['A', 'one', 'abc', 'what?', 'twowhat?', 'three', 'what?x', 'twowhat?x'],
    })
  })
})
