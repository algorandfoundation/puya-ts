import { beforeEach, describe, expect } from 'vitest'
import { utf8ToUint8Array } from '../../../src/util'
import { createArc4TestFixture } from '../util/test-fixture'

// Behaviour tests for examples/devportal/global_state.
// A fresh scope per test (beforeEach) deploys a new app for each case, mirroring the
// per-test isolation of the Python source tests.
describe('devportal global_state example', () => {
  const test = createArc4TestFixture({
    paths: 'examples/devportal/global_state/contract.algo.ts',
    contracts: { GlobalStorage: {}, GlobalStorageMap: {} },
    newScopeAt: beforeEach,
  })

  // --- GlobalStorage ------------------------------------------------------

  test('getGlobalState returns the default when the slot is empty', async ({ appClientGlobalStorage }) => {
    // globalIntNoDefault starts empty -> .get(default=0) returns 0
    const result = await appClientGlobalStorage.send.call({ method: 'getGlobalState' })
    expect(result.return).toBe(0n)
  })

  test('maybeGlobalState reports an empty optional slot', async ({ appClientGlobalStorage }) => {
    const result = await appClientGlobalStorage.send.call({ method: 'maybeGlobalState' })
    // (value, exists): empty slot -> (0, false)
    expect(result.return).toStrictEqual([0n, false])
  })

  test('getGlobalStateExample passes its assertions', async ({ appClientGlobalStorage }) => {
    const result = await appClientGlobalStorage.send.call({ method: 'getGlobalStateExample' })
    expect(result.return).toBe(true)
  })

  test('maybeGlobalStateExample passes its assertions', async ({ appClientGlobalStorage }) => {
    const result = await appClientGlobalStorage.send.call({ method: 'maybeGlobalStateExample' })
    expect(result.return).toBe(true)
  })

  test('checkGlobalStateExample passes its assertions', async ({ appClientGlobalStorage }) => {
    const result = await appClientGlobalStorage.send.call({ method: 'checkGlobalStateExample' })
    expect(result.return).toBe(true)
  })

  test('setGlobalState writes a bytes value', async ({ appClientGlobalStorage }) => {
    await appClientGlobalStorage.send.call({ method: 'setGlobalState', args: [utf8ToUint8Array('updated')] })
    // globalBytesFull now holds the written value
    const state = await appClientGlobalStorage.getGlobalState()
    expect(state['globalBytesFull'].value).toBe('updated')
  })

  test('setGlobalStateExample writes a heterogeneous set of values', async ({ appClientGlobalStorage, testAccount, assetFactory }) => {
    const assetId = await assetFactory({ sender: testAccount.addr, total: 1n })
    const appAddress = appClientGlobalStorage.appAddress

    await appClientGlobalStorage.send.call({
      // valueBytes, valueAsset, valueApp, valueAccount, valueBool
      method: 'setGlobalStateExample',
      args: [utf8ToUint8Array('world'), assetId, appClientGlobalStorage.appId, appAddress.toString(), true],
    })

    const state = await appClientGlobalStorage.getGlobalState()
    expect(state['globalBytesNoDefault'].value).toBe('world')
    expect(state['globalIntSimplified'].value).toBe(99n)
    expect(state['globalAsset'].value).toBe(assetId)
    expect(state['globalApplication'].value).toBe(appClientGlobalStorage.appId)
    expect((state['globalAccount'] as { valueRaw: Uint8Array }).valueRaw).toStrictEqual(appAddress.publicKey)
  })

  test('setGlobalStateExample also stores a false bool', async ({ appClientGlobalStorage, testAccount, assetFactory }) => {
    const assetId = await assetFactory({ sender: testAccount.addr, total: 1n })

    // the method stores and verifies the written bool, so false also works
    await appClientGlobalStorage.send.call({
      method: 'setGlobalStateExample',
      args: [utf8ToUint8Array('world'), assetId, appClientGlobalStorage.appId, appClientGlobalStorage.appAddress.toString(), false],
    })

    const state = await appClientGlobalStorage.getGlobalState()
    expect(state['globalBoolNoDefault'].value).toBe(0n)
  })

  test('delGlobalState deletes a populated slot', async ({ appClientGlobalStorage }) => {
    const result = await appClientGlobalStorage.send.call({ method: 'delGlobalState' })
    expect(result.return).toBe(true)
  })

  test('delGlobalStateExample deletes populated optional slots', async ({ appClientGlobalStorage, testAccount, assetFactory }) => {
    const assetId = await assetFactory({ sender: testAccount.addr, total: 1n })
    // populate the no_default slots first so deletion has something to remove
    await appClientGlobalStorage.send.call({
      method: 'setGlobalStateExample',
      args: [utf8ToUint8Array('world'), assetId, appClientGlobalStorage.appId, appClientGlobalStorage.appAddress.toString(), true],
    })

    const result = await appClientGlobalStorage.send.call({ method: 'delGlobalStateExample' })
    expect(result.return).toBe(true)
  })

  test('delGlobalStateExample succeeds on already-empty slots', async ({ appClientGlobalStorage }) => {
    // deleting global state keys that were never written still succeeds
    const result = await appClientGlobalStorage.send.call({ method: 'delGlobalStateExample' })
    expect(result.return).toBe(true)
  })

  test('passProxyToSubroutine passes a proxy into a subroutine', async ({ appClientGlobalStorage }) => {
    // method sets globalIntNoDefault = 44, subroutine returns value + 1
    const result = await appClientGlobalStorage.send.call({ method: 'passProxyToSubroutine' })
    expect(result.return).toBe(45n)
  })

  test('dynamicKeyAccess re-reads slots via dynamic keys', async ({ appClientGlobalStorage }) => {
    const result = await appClientGlobalStorage.send.call({ method: 'dynamicKeyAccess' })
    expect(result.return).toStrictEqual([7n, utf8ToUint8Array('hi')])
  })

  // --- GlobalStorageMap ---------------------------------------------------

  test('sets and reads a score in a global map', async ({ appClientGlobalStorageMap }) => {
    await appClientGlobalStorageMap.send.call({ method: 'setScore', args: ['alice', 42] })
    const result = await appClientGlobalStorageMap.send.call({ method: 'getScore', args: ['alice'] })
    expect(result.return).toBe(42n)
  })

  test('getScoreOrDefault returns default then stored value', async ({ appClientGlobalStorageMap }) => {
    // missing key -> default 0
    const missing = await appClientGlobalStorageMap.send.call({ method: 'getScoreOrDefault', args: ['bob'] })
    expect(missing.return).toBe(0n)

    await appClientGlobalStorageMap.send.call({ method: 'setScore', args: ['bob', 7] })
    const present = await appClientGlobalStorageMap.send.call({ method: 'getScoreOrDefault', args: ['bob'] })
    expect(present.return).toBe(7n)
  })

  test('maybeScore reports absence then presence', async ({ appClientGlobalStorageMap }) => {
    const absent = await appClientGlobalStorageMap.send.call({ method: 'maybeScore', args: ['carol'] })
    expect(absent.return).toStrictEqual([0n, false])

    await appClientGlobalStorageMap.send.call({ method: 'setScore', args: ['carol', 9] })
    const present = await appClientGlobalStorageMap.send.call({ method: 'maybeScore', args: ['carol'] })
    expect(present.return).toStrictEqual([9n, true])
  })

  test('getScore fails for a missing key', async ({ appClientGlobalStorageMap }) => {
    // indexing a missing key fails on-chain
    await expect(appClientGlobalStorageMap.send.call({ method: 'getScore', args: ['nobody'] })).rejects.toThrow()
  })

  test('deleteScore removes a stored score', async ({ appClientGlobalStorageMap }) => {
    await appClientGlobalStorageMap.send.call({ method: 'setScore', args: ['dave', 5] })
    await appClientGlobalStorageMap.send.call({ method: 'deleteScore', args: ['dave'] })
    const result = await appClientGlobalStorageMap.send.call({ method: 'maybeScore', args: ['dave'] })
    expect(result.return).toStrictEqual([0n, false])
  })

  test('sets, reads and checks presence of a struct profile', async ({ appClientGlobalStorageMap }) => {
    const absent = await appClientGlobalStorageMap.send.call({ method: 'hasProfile', args: [1] })
    expect(absent.return).toBe(false)

    await appClientGlobalStorageMap.send.call({ method: 'setProfile', args: [1, { name: 'alice', score: 100n }] })
    const present = await appClientGlobalStorageMap.send.call({ method: 'hasProfile', args: [1] })
    expect(present.return).toBe(true)
  })

  test('getSlotProxy reads a single slot via its proxy', async ({ appClientGlobalStorageMap }) => {
    await appClientGlobalStorageMap.send.call({ method: 'setScore', args: ['eve', 88] })
    const result = await appClientGlobalStorageMap.send.call({ method: 'getSlotProxy', args: ['eve'] })
    expect(result.return).toBe(88n)
  })

  test('getSlotProxy fails for a missing key', async ({ appClientGlobalStorageMap }) => {
    // `.value` on the proxy of a missing key fails on-chain
    await expect(appClientGlobalStorageMap.send.call({ method: 'getSlotProxy', args: ['nobody'] })).rejects.toThrow()
  })
})
