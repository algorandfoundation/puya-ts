import { algo } from '@algorandfoundation/algokit-utils'
import { describe, expect } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('resource encoding', () => {
  const test = createArc4TestFixture('tests/approvals/resource-encoding.algo.ts', {
    ByIndex: {},
    ByValue: {},
    C2C: { funding: algo(1) },
  })

  test('index', async ({ appClientByIndex, localnet }) => {
    const newAccount = await localnet.context.generateAccount({ initialFunds: algo(5) })
    const balance = 5_000_000n
    const res2 = await appClientByIndex.send.call({ method: 'testExplicitIndex', args: [newAccount.addr.toString()] })
    expect(res2.return).toStrictEqual(balance)

    await expect(
      appClientByIndex.send.call({
        method: 'testImplicitValue',
        args: [newAccount.addr.toString()],
        accountReferences: [],
        populateAppCallResources: false,
      }),
    ).rejects.toThrow('invalid Account reference')

    const res3 = await appClientByIndex.send.call({
      method: 'testImplicitValue',
      args: [newAccount.addr.toString()],
      accountReferences: [newAccount.addr.toString()],
      populateAppCallResources: false,
    })
    expect(res3.return).toStrictEqual(balance)
  })

  test('c2c', async ({ appClientByIndex, appClientByValue, appClientC2C, localnet }) => {
    const newAccount = await localnet.context.generateAccount({ initialFunds: algo(5) })

    await appClientC2C.send.call({
      method: 'testCallToIndex',
      args: [newAccount.addr.toString(), appClientByIndex.appId],
      extraFee: algo(1),
    })
    await appClientC2C.send.call({
      method: 'testCallToValue',
      args: [newAccount.addr.toString(), appClientByValue.appId],
      extraFee: algo(1),
    })
  })

  test('EchoResource', async ({ appClientC2C, localnet }) => {
    await appClientC2C.send.call({
      method: 'testCallToEchoResource',
      extraFee: algo(1),
    })
  })
})
