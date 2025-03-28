import { describe, expect } from 'vitest'
import { utf8ToUint8Array } from '../../src/util'
import { createArc4TestFixture } from './util/test-fixture'

describe('local state', () => {
  const test = createArc4TestFixture('tests/approvals/local-state.algo.ts', { LocalStateDemo: {} })

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
      localBytes: [...utf8ToUint8Array('bb')],
      localBytes2: [...utf8ToUint8Array('bb')],
      localEncoded: [0n, 1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n],
    })

    await appClientLocalStateDemo.send.call({ method: 'clearState' })

    await expect(appClientLocalStateDemo.send.call({ method: 'getState' })).rejects.toThrow('Runtime error when executing LocalStateDemo')
  })
})
