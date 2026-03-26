import { describe } from 'vitest'
import { utf8ToUint8Array } from '../../src/util'
import { createArc4TestFixture } from './util/test-fixture'

describe('global map', () => {
  const test = createArc4TestFixture({
    paths: 'tests/approvals/global-map.algo.ts',
    contracts: { TestGlobalMap: {} },
  })

  test('set and get uint64 values', async ({ appClientTestGlobalMap }) => {
    await appClientTestGlobalMap.send.call({ method: 'setAndGetUint', args: ['key1', 42] })
    await appClientTestGlobalMap.send.call({ method: 'setAndGetUint', args: ['key2', 99] })
  })

  test('set and get string values', async ({ appClientTestGlobalMap }) => {
    await appClientTestGlobalMap.send.call({ method: 'setAndGetString', args: ['k1', 'hello'] })
  })

  test('set and get bytes values', async ({ appClientTestGlobalMap }) => {
    await appClientTestGlobalMap.send.call({ method: 'setAndGetBytes', args: ['k1', utf8ToUint8Array('world')] })
  })

  test('delete values', async ({ appClientTestGlobalMap }) => {
    await appClientTestGlobalMap.send.call({ method: 'deleteValue', args: ['delKey'] })
  })

  test('hasValue returns false for unset keys', async ({ appClientTestGlobalMap, expect }) => {
    const result = await appClientTestGlobalMap.send.call({ method: 'hasValue', args: ['nonexistent'] })
    expect(result.return).toBe(false)
  })

  test('key prefix access', async ({ appClientTestGlobalMap }) => {
    await appClientTestGlobalMap.send.call({ method: 'testKeyPrefix' })
  })

  test('explicit key prefix works', async ({ appClientTestGlobalMap }) => {
    await appClientTestGlobalMap.send.call({ method: 'testPrefixedMap', args: ['pk1', 777] })
  })

  test('schema limits are enforced', async ({ appClientTestGlobalMap, expect }) => {
    // Prior tests already used some uint slots (key1, key2, pk1 = 3 used).
    // Fill the remaining 7 slots, then verify the next write exceeds the schema.
    for (let i = 0; i < 7; i++) {
      await appClientTestGlobalMap.send.call({ method: 'setAndGetUint', args: [`fill${i}`, i + 1] })
    }
    await expect(appClientTestGlobalMap.send.call({ method: 'setAndGetUint', args: ['overflow', 999] })).rejects.toThrow(
      'store integer count',
    )
  })
})

describe('global map tuple', () => {
  const test = createArc4TestFixture({
    paths: 'tests/approvals/global-map.algo.ts',
    contracts: { TestGlobalMapTuple: {} },
  })

  test('map of tuples', async ({ appClientTestGlobalMapTuple }) => {
    await appClientTestGlobalMapTuple.send.call({ method: 'testMapOfTuples', args: ['hello', 42, true] })
  })

  test('map of objects', async ({ appClientTestGlobalMapTuple }) => {
    await appClientTestGlobalMapTuple.send.call({ method: 'testMapOfObjects', args: ['world', 99] })
  })

  test('tuple map', async ({ appClientTestGlobalMapTuple }) => {
    await appClientTestGlobalMapTuple.send.call({ method: 'testTupleMap', args: ['hello', 42, true] })
  })

  test('object map', async ({ appClientTestGlobalMapTuple }) => {
    await appClientTestGlobalMapTuple.send.call({ method: 'testObjectMap', args: ['world', 99] })
  })
})
