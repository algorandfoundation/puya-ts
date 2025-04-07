import { describe, expect } from 'vitest'
import { invariant } from '../../src/util'
import { createArc4TestFixture } from './util/test-fixture'

describe('static bytes', () => {
  const test = createArc4TestFixture('tests/approvals/static-bytes.algo.ts', {
    StaticBytesAlgo: {},
  })
  test('it works as abi parameter and return type', async ({ appClientStaticBytesAlgo, testAccount }) => {
    const result = await appClientStaticBytesAlgo.send.call({ method: 'receiveB32', args: [testAccount.addr.publicKey] })
    invariant(result.return instanceof Array, 'Return type should be byte array')
    expect(result.return.length).toBe(32)
  })
  test('works with internal calls', async ({ appClientStaticBytesAlgo }) => {
    await appClientStaticBytesAlgo.send.call({ method: 'test', args: [] })
  })
  test('works with arrays', async ({ appClientStaticBytesAlgo }) => {
    await appClientStaticBytesAlgo.send.call({ method: 'testArray', args: [] })
  })
})
