import { beforeEach, describe, expect } from 'vitest'
import { utf8ToUint8Array } from '../../../src/util'
import { createArc4TestFixture } from '../util/test-fixture'

// Behaviour tests for examples/devportal/local_state.
// Local state is per-account, so the caller must opt in before the contract can write it;
// a fresh scope per test (beforeEach) keeps opt-in state from leaking between tests.
describe('devportal local_state example', () => {
  const test = createArc4TestFixture({
    paths: 'examples/devportal/local_state/contract.algo.ts',
    contracts: { LocalStorage: {}, LocalStorageMap: {} },
    newScopeAt: beforeEach,
  })

  // --- LocalStorage -------------------------------------------------------

  test('contains local data', async ({ appClientLocalStorage, testAccount }) => {
    await appClientLocalStorage.send.optIn({ method: 'optIn' })
    const account = testAccount.addr.toString()
    // opt_in wrote local_int for the sender
    const result = await appClientLocalStorage.send.call({ method: 'containsLocalData', args: [account] })
    expect(result.return).toBe(true)
  })

  test('contains local data example', async ({ appClientLocalStorage, testAccount }) => {
    await appClientLocalStorage.send.optIn({ method: 'optIn' })
    const account = testAccount.addr.toString()
    const result = await appClientLocalStorage.send.call({ method: 'containsLocalDataExample', args: [account] })
    expect(result.return).toBe(true)
  })

  test('get item local data', async ({ appClientLocalStorage, testAccount }) => {
    await appClientLocalStorage.send.optIn({ method: 'optIn' })
    const account = testAccount.addr.toString()
    // opt_in set local_int = 10
    const result = await appClientLocalStorage.send.call({ method: 'getItemLocalData', args: [account] })
    expect(result.return).toBe(10n)
  })

  test('get item local data example', async ({ appClientLocalStorage, testAccount }) => {
    await appClientLocalStorage.send.optIn({ method: 'optIn' })
    const account = testAccount.addr.toString()
    const result = await appClientLocalStorage.send.call({ method: 'getItemLocalDataExample', args: [account] })
    expect(result.return).toBe(true)
  })

  test('get local data with default', async ({ appClientLocalStorage, testAccount }) => {
    await appClientLocalStorage.send.optIn({ method: 'optIn' })
    const account = testAccount.addr.toString()
    const result = await appClientLocalStorage.send.call({ method: 'getLocalDataWithDefault', args: [account] })
    expect(result.return).toBe(true)
  })

  test('get local data with default int when absent', async ({ appClientLocalStorage, testAccount }) => {
    // opt_in sets local_int=10; delete it so the slot is absent for an
    // opted-in account, then `.get(default=0)` returns the default 0
    await appClientLocalStorage.send.optIn({ method: 'optIn' })
    const account = testAccount.addr.toString()
    await appClientLocalStorage.send.call({ method: 'deleteLocalData', args: [account] })
    const result = await appClientLocalStorage.send.call({ method: 'getLocalDataWithDefaultInt', args: [account] })
    expect(result.return).toBe(0n)
  })

  test('maybe local data', async ({ appClientLocalStorage, testAccount }) => {
    await appClientLocalStorage.send.optIn({ method: 'optIn' })
    const account = testAccount.addr.toString()
    const result = await appClientLocalStorage.send.call({ method: 'maybeLocalData', args: [account] })
    expect(result.return).toStrictEqual([10n, true])
  })

  test('maybe local data example', async ({ appClientLocalStorage, testAccount }) => {
    await appClientLocalStorage.send.optIn({ method: 'optIn' })
    const account = testAccount.addr.toString()
    const result = await appClientLocalStorage.send.call({ method: 'maybeLocalDataExample', args: [account] })
    expect(result.return).toBe(true)
  })

  test('set local int', async ({ appClientLocalStorage, testAccount }) => {
    await appClientLocalStorage.send.optIn({ method: 'optIn' })
    const account = testAccount.addr.toString()
    await appClientLocalStorage.send.call({ method: 'setLocalInt', args: [account, 123] })
    const result = await appClientLocalStorage.send.call({ method: 'getItemLocalData', args: [account] })
    expect(result.return).toBe(123n)
  })

  test('set local data example', async ({ appClientLocalStorage, testAccount, assetFactory }) => {
    await appClientLocalStorage.send.optIn({ method: 'optIn' })
    const account = testAccount.addr.toString()
    const assetA = await assetFactory({ sender: testAccount.addr, total: 1n })
    const result = await appClientLocalStorage.send.call({
      // for_account, value_asset, value_account, value_app, value_bytes, value_bool
      method: 'setLocalDataExample',
      args: [account, assetA, account, appClientLocalStorage.appId, utf8ToUint8Array('data'), true],
    })
    expect(result.return).toBe(true)
  })

  test('delete local data', async ({ appClientLocalStorage, testAccount }) => {
    await appClientLocalStorage.send.optIn({ method: 'optIn' })
    const account = testAccount.addr.toString()
    await appClientLocalStorage.send.call({ method: 'deleteLocalData', args: [account] })
    const contains = await appClientLocalStorage.send.call({ method: 'containsLocalData', args: [account] })
    expect(contains.return).toBe(false)
  })

  test('delete local data example', async ({ appClientLocalStorage, testAccount }) => {
    await appClientLocalStorage.send.optIn({ method: 'optIn' })
    const account = testAccount.addr.toString()
    const result = await appClientLocalStorage.send.call({ method: 'deleteLocalDataExample', args: [account] })
    expect(result.return).toBe(true)
  })

  test('pass proxy to subroutine', async ({ appClientLocalStorage, testAccount }) => {
    await appClientLocalStorage.send.optIn({ method: 'optIn' })
    const account = testAccount.addr.toString()
    // local_int is 10, subroutine returns value + 1
    const result = await appClientLocalStorage.send.call({ method: 'passProxyToSubroutine', args: [account] })
    expect(result.return).toBe(11n)
  })

  test('get item local data missing account fails', async ({ appClientLocalStorage, testAccount }) => {
    // on a fresh app the account has not opted in, so indexing local_int fails
    const account = testAccount.addr.toString()
    await expect(appClientLocalStorage.send.call({ method: 'getItemLocalData', args: [account] })).rejects.toThrow()
  })

  test('set local int not opted in fails', async ({ appClientLocalStorage, testAccount }) => {
    // writing local state also requires the account to be opted in
    const account = testAccount.addr.toString()
    await expect(appClientLocalStorage.send.call({ method: 'setLocalInt', args: [account, 123] })).rejects.toThrow()
  })

  // --- LocalStorageMap ----------------------------------------------------

  test('local map get balance', async ({ appClientLocalStorageMap, testAccount }) => {
    await appClientLocalStorageMap.send.optIn({ method: 'optIn' })
    const account = testAccount.addr.toString()
    // opt_in set balances[(sender, "USD")] = 100
    const result = await appClientLocalStorageMap.send.call({ method: 'getBalance', args: [account, 'USD'] })
    expect(result.return).toBe(100n)
  })

  test('local map get balance missing key fails', async ({ appClientLocalStorageMap, testAccount }) => {
    await appClientLocalStorageMap.send.optIn({ method: 'optIn' })
    const account = testAccount.addr.toString()
    // indexing a (account, key) pair with no stored value fails on-chain
    await expect(appClientLocalStorageMap.send.call({ method: 'getBalance', args: [account, 'EUR'] })).rejects.toThrow()
  })

  test('local map get balance or default', async ({ appClientLocalStorageMap, testAccount }) => {
    await appClientLocalStorageMap.send.optIn({ method: 'optIn' })
    const account = testAccount.addr.toString()
    // "EUR" was never set -> default 0
    const missing = await appClientLocalStorageMap.send.call({ method: 'getBalanceOrDefault', args: [account, 'EUR'] })
    expect(missing.return).toBe(0n)
    const present = await appClientLocalStorageMap.send.call({ method: 'getBalanceOrDefault', args: [account, 'USD'] })
    expect(present.return).toBe(100n)
  })

  test('local map maybe balance', async ({ appClientLocalStorageMap, testAccount }) => {
    await appClientLocalStorageMap.send.optIn({ method: 'optIn' })
    const account = testAccount.addr.toString()
    const absent = await appClientLocalStorageMap.send.call({ method: 'maybeBalance', args: [account, 'GBP'] })
    expect(absent.return).toStrictEqual([0n, false])
    const present = await appClientLocalStorageMap.send.call({ method: 'maybeBalance', args: [account, 'USD'] })
    expect(present.return).toStrictEqual([100n, true])
  })

  test('local map has flag', async ({ appClientLocalStorageMap, testAccount }) => {
    await appClientLocalStorageMap.send.optIn({ method: 'optIn' })
    const account = testAccount.addr.toString()
    // opt_in set flags[(sender, 0)] = True
    const has = await appClientLocalStorageMap.send.call({ method: 'hasFlag', args: [account, 0] })
    expect(has.return).toBe(true)
    const missing = await appClientLocalStorageMap.send.call({ method: 'hasFlag', args: [account, 99] })
    expect(missing.return).toBe(false)
  })

  test('local map set balance', async ({ appClientLocalStorageMap, testAccount }) => {
    await appClientLocalStorageMap.send.optIn({ method: 'optIn' })
    const account = testAccount.addr.toString()
    await appClientLocalStorageMap.send.call({ method: 'setBalance', args: [account, 'USD', 500] })
    const result = await appClientLocalStorageMap.send.call({ method: 'getBalance', args: [account, 'USD'] })
    expect(result.return).toBe(500n)
  })

  test('local map set flag', async ({ appClientLocalStorageMap, testAccount }) => {
    await appClientLocalStorageMap.send.optIn({ method: 'optIn' })
    const account = testAccount.addr.toString()
    await appClientLocalStorageMap.send.call({ method: 'setFlag', args: [account, 7, true] })
    const result = await appClientLocalStorageMap.send.call({ method: 'hasFlag', args: [account, 7] })
    expect(result.return).toBe(true)
  })

  test('local map set flag false still exists', async ({ appClientLocalStorageMap, testAccount }) => {
    await appClientLocalStorageMap.send.optIn({ method: 'optIn' })
    const account = testAccount.addr.toString()
    await appClientLocalStorageMap.send.call({ method: 'setFlag', args: [account, 8, false] })
    // `in` reports key existence regardless of the truthiness of the value
    const result = await appClientLocalStorageMap.send.call({ method: 'hasFlag', args: [account, 8] })
    expect(result.return).toBe(true)
  })

  test('local map delete balance', async ({ appClientLocalStorageMap, testAccount }) => {
    await appClientLocalStorageMap.send.optIn({ method: 'optIn' })
    const account = testAccount.addr.toString()
    await appClientLocalStorageMap.send.call({ method: 'deleteBalance', args: [account, 'USD'] })
    const result = await appClientLocalStorageMap.send.call({ method: 'maybeBalance', args: [account, 'USD'] })
    expect(result.return).toStrictEqual([0n, false])
  })

  test('local map get slot proxy', async ({ appClientLocalStorageMap, testAccount }) => {
    await appClientLocalStorageMap.send.optIn({ method: 'optIn' })
    const account = testAccount.addr.toString()
    const result = await appClientLocalStorageMap.send.call({ method: 'getSlotProxy', args: [account, 'USD'] })
    expect(result.return).toBe(100n)
  })
})
