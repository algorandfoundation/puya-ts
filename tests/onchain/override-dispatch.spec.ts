import type { AppClient } from '@algorandfoundation/algokit-utils/types/app-client'
import { describe, expect } from 'vitest'
import { Leaf, Multiple } from '../approvals/override-dispatch.algo'
import { createArc4TestFixture } from './util/test-fixture'

describe('override-dispatch', () => {
  const test = createArc4TestFixture({
    paths: 'tests/approvals/override-dispatch.algo.ts',
    contracts: { Leaf: {}, Multiple: {} },
  })

  const call = async (client: AppClient, method: string) => Number((await client.send.call({ method })).return)

  test('dispatches like TypeScript', async ({ appClientLeaf, appClientMultiple }) => {
    // Compiled contracts should match TypeScript classes instantiated here in these scenarios
    const leaf = new Leaf()
    const multiple = new Multiple()
    expect(await call(appClientLeaf, 'read')).toBe(leaf.read())
    expect(await call(appClientLeaf, 'fromSuper')).toBe(leaf.fromSuper())
    expect(await call(appClientMultiple, 'read')).toBe(multiple.read())
    expect(await call(appClientMultiple, 'readOther')).toBe(multiple.readOther())
    expect(await call(appClientMultiple, 'fromOther')).toBe(multiple.fromOther())
  })
})
