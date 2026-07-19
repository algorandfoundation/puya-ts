import { describe, expect } from 'vitest'
import { uint8ArrayToUtf8 } from '../../src/util'
import { createArc4TestFixture } from './util/test-fixture'

describe('arc4-hybrid', () => {
  const test = createArc4TestFixture({ paths: 'tests/approvals/arc4-hybrid.algo.ts', contracts: { Arc4HybridAlgo: {} } })
  test('routes abi methods', async ({ appClientArc4HybridAlgo }) => {
    const someMethod = await appClientArc4HybridAlgo.send.call({ method: 'someMethod' })
    expect(someMethod.confirmation.logs!.map(uint8ArrayToUtf8)).toStrictEqual(['before', 'some method', 'after'])

    const someOtherMethod = await appClientArc4HybridAlgo.send.call({ method: 'someOtherMethod' })
    expect(someOtherMethod.confirmation.logs!.map(uint8ArrayToUtf8)).toStrictEqual(['before', 'some other method', 'after'])
  })

  test('handles update calls', async ({ appClientArc4HybridAlgo }) => {
    const result = await appClientArc4HybridAlgo.send.update({ method: 'updateApplication' })
    const logs = result.confirmation.logs!.map(uint8ArrayToUtf8)

    expect(logs).toStrictEqual(['before', 'update', 'after'])
  })
})
