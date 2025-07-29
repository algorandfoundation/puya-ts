import { algo } from '@algorandfoundation/algokit-utils'
import { describe, expect } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('resource encoding', () => {
  const test = createArc4TestFixture('tests/approvals/resource-encoding.algo.ts', {
    Foreign: {},
    ByValue: {},
    C2C: {},
  })

  test('foreign index', async ({ appClientForeign, localnet }) => {
    const newAccount = await localnet.context.generateAccount({ initialFunds: algo(5) })
    const balance = 5_000_000n
    const res1 = await appClientForeign.send.call({ method: 'testBaseForeign', args: [newAccount.addr.toString()] })
    expect(res1.return).toStrictEqual(balance)
    const res2 = await appClientForeign.send.call({ method: 'testExplicitForeign', args: [newAccount.addr.toString()] })
    expect(res2.return).toStrictEqual(balance)

    await expect(
      appClientForeign.send.call({
        method: 'testImplicitValue',
        args: [newAccount.addr.toString()],
        accountReferences: [],
        populateAppCallResources: false,
      }),
    ).rejects.toThrow('invalid Account reference')

    const res3 = await appClientForeign.send.call({
      method: 'testImplicitValue',
      args: [newAccount.addr.toString()],
      accountReferences: [newAccount.addr.toString()],
      populateAppCallResources: false,
    })
    expect(res3.return).toStrictEqual(balance)
  })

  test('c2c', async ({ appClientForeign, appClientByValue, appClientC2C, localnet }) => {
    const newAccount = await localnet.context.generateAccount({ initialFunds: algo(5) })

    await appClientC2C.send.call({
      method: 'testCallToForeign',
      args: [newAccount.addr.toString(), appClientForeign.appId],
      extraFee: algo(1),
    })
    await appClientC2C.send.call({
      method: 'testCallToValue',
      args: [newAccount.addr.toString(), appClientByValue.appId],
      extraFee: algo(1),
    })
  })
})
