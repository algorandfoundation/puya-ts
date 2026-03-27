import { beforeEach, describe } from 'vitest'
import { utf8ToUint8Array } from '../../src/util'
import { createArc4TestFixture } from './util/test-fixture'

describe('local map', () => {
  const test = createArc4TestFixture({
    paths: 'tests/approvals/local-map.algo.ts',
    contracts: { TestLocalMap: {} },
    newScopeAt: beforeEach,
  })

  test('set and get uint64 values', async ({ appClientTestLocalMap }) => {
    await appClientTestLocalMap.send.optIn({ method: 'optIn' })
    await appClientTestLocalMap.send.call({ method: 'setAndGetUint', args: ['key1', 42] })
    await appClientTestLocalMap.send.call({ method: 'setAndGetUint', args: ['key2', 99] })
  })

  test('set and get string values', async ({ appClientTestLocalMap }) => {
    await appClientTestLocalMap.send.optIn({ method: 'optIn' })
    await appClientTestLocalMap.send.call({ method: 'setAndGetString', args: ['k1', 'hello'] })
  })

  test('set and get bytes values', async ({ appClientTestLocalMap }) => {
    await appClientTestLocalMap.send.optIn({ method: 'optIn' })
    await appClientTestLocalMap.send.call({ method: 'setAndGetBytes', args: ['k1', utf8ToUint8Array('world')] })
  })

  test('delete values', async ({ appClientTestLocalMap }) => {
    await appClientTestLocalMap.send.optIn({ method: 'optIn' })
    await appClientTestLocalMap.send.call({ method: 'deleteValue', args: ['delKey'] })
  })

  test('hasValue returns false for unset keys', async ({ appClientTestLocalMap, expect }) => {
    await appClientTestLocalMap.send.optIn({ method: 'optIn' })
    const result = await appClientTestLocalMap.send.call({ method: 'hasValue', args: ['nonexistent'] })
    expect(result.return).toBe(false)
  })

  test('key prefix access', async ({ appClientTestLocalMap }) => {
    await appClientTestLocalMap.send.optIn({ method: 'optIn' })
    await appClientTestLocalMap.send.call({ method: 'testKeyPrefix' })
  })

  test('explicit key prefix works', async ({ appClientTestLocalMap }) => {
    await appClientTestLocalMap.send.optIn({ method: 'optIn' })
    await appClientTestLocalMap.send.call({ method: 'testPrefixedMap', args: ['pk1', 777] })
  })

  test('set and get via LocalState overload', async ({ appClientTestLocalMap }) => {
    await appClientTestLocalMap.send.optIn({ method: 'optIn' })
    await appClientTestLocalMap.send.call({ method: 'setAndGetUintViaLocalState', args: ['key1', 42] })
  })
})

describe('local map tuple', () => {
  const test = createArc4TestFixture({
    paths: 'tests/approvals/local-map.algo.ts',
    contracts: { TestLocalMapTuple: {} },
    newScopeAt: beforeEach,
  })

  test('map of tuples', async ({ appClientTestLocalMapTuple }) => {
    await appClientTestLocalMapTuple.send.optIn({ method: 'optIn' })
    await appClientTestLocalMapTuple.send.call({ method: 'testMapOfTuples', args: ['hello', 42, true] })
  })

  test('map of objects', async ({ appClientTestLocalMapTuple }) => {
    await appClientTestLocalMapTuple.send.optIn({ method: 'optIn' })
    await appClientTestLocalMapTuple.send.call({ method: 'testMapOfObjects', args: ['world', 99] })
  })

  test('tuple map', async ({ appClientTestLocalMapTuple }) => {
    await appClientTestLocalMapTuple.send.optIn({ method: 'optIn' })
    await appClientTestLocalMapTuple.send.call({ method: 'testTupleMap', args: ['hello', 42, true] })
  })

  test('object map', async ({ appClientTestLocalMapTuple }) => {
    await appClientTestLocalMapTuple.send.optIn({ method: 'optIn' })
    await appClientTestLocalMapTuple.send.call({ method: 'testObjectMap', args: ['world', 99] })
  })
})
