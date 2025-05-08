import { algos } from '@algorandfoundation/algokit-utils'
import { describe, expect } from 'vitest'
import { invariant, utf8ToUint8Array } from '../../src/util'
import { createArc4TestFixture, createBaseTestFixture } from './util/test-fixture'

describe('BoxProxies', () => {
  const test = createBaseTestFixture('tests/approvals/box-proxies.algo.ts', ['BoxContract', 'BoxNotExist'])

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

  test('Box that does not exist should fail when accessed', async ({ BoxNotExistInvoker, algorand, testAccount }) => {
    const created = await BoxNotExistInvoker.send()

    invariant(created.confirmation.applicationIndex, 'There must be an application id')
    const appInfo = await algorand.app.getById(created.confirmation.applicationIndex)
    // Fund the app account
    await algorand.send.payment({
      receiver: appInfo.appAddress,
      sender: testAccount.addr,
      amount: algos(1),
    })

    // Accessing box.value when the box doesn't exist fails
    await expect(
      BoxNotExistInvoker.send({
        appId: created.confirmation.applicationIndex,
        boxReferences: ['abc'],
        args: [utf8ToUint8Array('box')],
      }),
    ).rejects.toThrow(/assert failed/)
    await expect(
      BoxNotExistInvoker.send({
        appId: created.confirmation.applicationIndex,
        boxReferences: ['abc'],
        args: [utf8ToUint8Array('boxmap')],
      }),
    ).rejects.toThrow(/assert failed/)

    // Create the box
    await BoxNotExistInvoker.send({
      appId: created.confirmation.applicationIndex,
      boxReferences: ['abc'],
      args: [utf8ToUint8Array('createbox')],
    })

    // Should work fine now the box exists
    await BoxNotExistInvoker.send({
      appId: created.confirmation.applicationIndex,
      boxReferences: ['abc'],
      args: [utf8ToUint8Array('box')],
    })
    await BoxNotExistInvoker.send({
      appId: created.confirmation.applicationIndex,
      boxReferences: ['abc'],
      args: [utf8ToUint8Array('boxmap')],
    })
  })

  const it = createArc4TestFixture('tests/approvals/box-proxies.algo.ts', {
    BoxCreate: { funding: algos(1) },
    TupleBox: { funding: algos(1) },
  })
  it('creates boxes of the min size', async ({ appClientBoxCreate }) => {
    await appClientBoxCreate.send.call({ method: 'createBoxes', boxReferences: ['bool', 'arc4b', 'a', 'b', 'c', 'd', 'e'] })
  })

  it('should be able to store tuples in boxes', async ({ appClientTupleBox }) => {
    await appClientTupleBox.send.call({ method: 'testBox', boxReferences: ['t1', 't2'] })
    await appClientTupleBox.send.call({ method: 'testBoxMap', boxReferences: ['tm1', 'tm2'] })
  })
})
