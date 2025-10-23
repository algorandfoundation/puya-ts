import { beforeEach, describe, expect } from 'vitest'
import { utf8ToUint8Array } from '../../src/util'
import { createArc4TestFixture } from './util/test-fixture'

describe('local state', () => {
  const test = createArc4TestFixture({
    path: 'tests/approvals/local-state.algo.ts',
    contracts: { LocalStateDemo: {} },
    newScopeAt: beforeEach,
  })

  test('it runs', async ({ appClientLocalStateDemo, appFactoryLocalStateDemo }) => {
    const testArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const testObj = { a: 123, b: utf8ToUint8Array('bb') }

    // Fails when not opted in
    await expect(appClientLocalStateDemo.send.call({ method: 'setState', args: [testObj, testArray] })).rejects.toThrow('cannot fetch key')

    await appClientLocalStateDemo.send.optIn({ method: 'optIn' })

    await appClientLocalStateDemo.send.call({ method: 'setState', args: [testObj, testArray] })

    const result = await appClientLocalStateDemo.send.call({ method: 'getState' })

    expect(result.return).toStrictEqual({
      localUint: 123n,
      localUint2: 123n,
      localBytes: utf8ToUint8Array('bb'),
      localBytes2: utf8ToUint8Array('bb'),
      localEncoded: [0n, 1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n],
      localTuple: [123n, utf8ToUint8Array('bb')],
      localObject: { a: 123n, b: utf8ToUint8Array('bb') },
      localMutableObject: {
        a: 123n,
        b: utf8ToUint8Array('bb'),
        c: true,
        d: 'hello',
      },
    })

    await appClientLocalStateDemo.send.call({ method: 'clearState' })

    await expect(appClientLocalStateDemo.send.call({ method: 'getState' })).rejects.toThrow('Runtime error when executing LocalStateDemo')
  })

  test('should write and read dynamic local state values', async ({ appClientLocalStateDemo }) => {
    await appClientLocalStateDemo.send.optIn({ method: 'optIn' })

    const testKey = 'testKey'
    const testValue = 'testValue'

    const writeResult = await appClientLocalStateDemo.send.call({ method: 'writeDynamicLocalState', args: [testKey, testValue] })

    expect(writeResult.return).toEqual(testValue)

    const readResult = await appClientLocalStateDemo.send.call({ method: 'readDynamicLocalState', args: [testKey] })

    expect(readResult.return).toEqual(testValue)
  })
})
