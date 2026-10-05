import { algo } from '@algorandfoundation/algokit-utils'
import type { AppClient } from '@algorandfoundation/algokit-utils/types/app-client'
import { describe, expect } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('abstract-methods', () => {
  const test = createArc4TestFixture({
    paths: 'tests/approvals/abstract-methods.algo.ts',
    contracts: { First: {}, Second: {}, Caller: {}, ProvidesValue: {} },
  })

  const call = async (client: AppClient, method: string, ...args: unknown[]) =>
    (await client.send.call({ method, args: args as never, extraFee: algo(0.001) })).return

  test('calls through this resolve to the concrete implementation', async ({ appClientFirst, appClientSecond }) => {
    expect(await call(appClientFirst, 'describe')).toBe('first')
    expect(await call(appClientFirst, 'getEmpty', 1n)).toEqual({ id: 1n, balance: 10n })
    expect(await call(appClientSecond, 'describe')).toBe('second')
    expect(await call(appClientSecond, 'getEmpty', 1n)).toEqual({ id: 1n, balance: 20n })
    expect(await call(appClientSecond, 'firstLabel')).toBe('first')
  })

  test('abstract ABI methods can be called', async ({ appClientCaller, appClientSecond }) => {
    await appClientCaller.fundAppAccount({ amount: algo(1) })
    expect(await call(appClientCaller, 'callLabel', appClientSecond.appId)).toBe('second')
  })

  test('prototype calls to an abstract override reach the inherited implementation', async ({ appClientProvidesValue }) => {
    expect(await call(appClientProvidesValue, 'value')).toBe(2n)
    expect(await call(appClientProvidesValue, 'fromPrototype')).toBe(1n)
  })
})
