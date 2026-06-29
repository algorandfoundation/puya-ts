import type { AppClient } from '@algorandfoundation/algokit-utils/app-client'
import type { AppFactory } from '@algorandfoundation/algokit-utils/app-factory'
import { algo } from '@algorandfoundation/algokit-utils'
import { describe, expect } from 'vitest'
import { createArc4TestFixture } from '../util/test-fixture'

// Behaviour tests for examples/devportal/abimethod_options.
//
// AbiMethodOptions has `create` marked `onCreate: 'require'` and takes a
// governor account + fee asset, so each test creates a fresh app via the
// factory with the arguments it needs.
describe('devportal abimethod_options example', () => {
  const test = createArc4TestFixture({
    paths: 'examples/devportal/abimethod_options/contract.algo.ts',
    contracts: { AbiMethodOptions: {} },
  })

  // Creates a fee asset (held in full by the creator) and an app whose governor
  // is the creator, mirroring the Python `_create` helper + `asset_a` fixture.
  async function create(factory: AppFactory, governor: string, feeAsset: bigint): Promise<AppClient> {
    const { appClient } = await factory.send.create({ method: 'create', args: [governor, feeAsset] })
    return appClient
  }

  async function newAsset(assetFactory: (p: { sender: string; total: bigint; decimals: number }) => Promise<bigint>, sender: string) {
    return assetFactory({ sender, total: 1000n, decimals: 0 })
  }

  // --- create="require" -------------------------------------------------------

  test('create initializes governor and fee asset', async ({ appFactoryAbiMethodOptions, testAccount, assetFactory }) => {
    const assetA = await newAsset(assetFactory, testAccount.addr.toString())
    const client = await create(appFactoryAbiMethodOptions, testAccount.addr.toString(), assetA)
    expect(client.appId).toBeGreaterThan(0n)
  })

  test('bare create is rejected', async ({ appFactoryAbiMethodOptions }) => {
    // `onCreate: 'require'` on `create` means a bare app create must fail.
    await expect(appFactoryAbiMethodOptions.send.bare.create()).rejects.toThrow()
  })

  // --- @abimethod getter ------------------------------------------------------

  test('public governor getter returns the governor', async ({ appFactoryAbiMethodOptions, testAccount, assetFactory }) => {
    const assetA = await newAsset(assetFactory, testAccount.addr.toString())
    const client = await create(appFactoryAbiMethodOptions, testAccount.addr.toString(), assetA)
    const result = await client.send.call({ method: 'publicGovernorGetter' })
    expect(result.return).toBe(testAccount.addr.toString())
  })

  // --- name= ------------------------------------------------------------------

  test('ping uses the renamed abi method', async ({ appFactoryAbiMethodOptions, testAccount, assetFactory }) => {
    const assetA = await newAsset(assetFactory, testAccount.addr.toString())
    const client = await create(appFactoryAbiMethodOptions, testAccount.addr.toString(), assetA)
    // `name: 'ping'` decouples the ABI name from the TS name longInternalName.
    const result = await client.send.call({ method: 'ping' })
    expect(result.return).toBe('ping')
  })

  // --- readonly= --------------------------------------------------------------

  test('getJoinEventCount is readonly and starts at zero', async ({ appFactoryAbiMethodOptions, testAccount, assetFactory }) => {
    const assetA = await newAsset(assetFactory, testAccount.addr.toString())
    const client = await create(appFactoryAbiMethodOptions, testAccount.addr.toString(), assetA)
    const result = await client.send.call({ method: 'getJoinEventCount' })
    expect(result.return).toBe(0n)
  })

  // --- default_args= ----------------------------------------------------------

  test('adminAction accepts explicit args', async ({ appFactoryAbiMethodOptions, testAccount, assetFactory }) => {
    const assetA = await newAsset(assetFactory, testAccount.addr.toString())
    const client = await create(appFactoryAbiMethodOptions, testAccount.addr.toString(), assetA)
    // explicitly passing the values the defaults would resolve to
    const result = await client.send.call({ method: 'adminAction', args: [assetA, 0n] })
    expect(result.confirmation.confirmedRound).toBeGreaterThan(0n)
  })

  test('adminAction defaults are resolved by the client', async ({ appFactoryAbiMethodOptions, testAccount, assetFactory }) => {
    const assetA = await newAsset(assetFactory, testAccount.addr.toString())
    const client = await create(appFactoryAbiMethodOptions, testAccount.addr.toString(), assetA)
    // passing undefined makes the client resolve each default from the ARC-56
    // metadata: feeAsset from global state, expectedJoinEventCount by simulating
    // the readonly getJoinEventCount method
    const result = await client.send.call({ method: 'adminAction', args: [undefined, undefined] })
    expect(result.confirmation.confirmedRound).toBeGreaterThan(0n)
  })

  test('adminAction rejects a non-governor sender', async ({ appFactoryAbiMethodOptions, testAccount, assetFactory, localnet }) => {
    const assetA = await newAsset(assetFactory, testAccount.addr.toString())
    const client = await create(appFactoryAbiMethodOptions, testAccount.addr.toString(), assetA)
    const other = await localnet.context.generateAccount({ initialFunds: algo(1) })
    // a non-governor sender is rejected even when passing the correct state
    // values for every argument (auth checks stored state, not args)
    await expect(client.send.call({ method: 'adminAction', args: [assetA, 0n], sender: other.addr })).rejects.toThrow(/only governor/)
  })

  test('adminAction tolerates a mismatched fee asset via early return', async ({
    appFactoryAbiMethodOptions,
    testAccount,
    assetFactory,
  }) => {
    const assetA = await newAsset(assetFactory, testAccount.addr.toString())
    const assetB = await newAsset(assetFactory, testAccount.addr.toString())
    const client = await create(appFactoryAbiMethodOptions, testAccount.addr.toString(), assetA)
    // a mismatched asset takes the early-return branch instead of failing —
    // even the stale count (999) is never checked, since the branch returns first
    const result = await client.send.call({ method: 'adminAction', args: [assetB, 999n] })
    expect(result.confirmation.confirmedRound).toBeGreaterThan(0n)
  })

  test('adminAction rejects a stale join event count', async ({ appFactoryAbiMethodOptions, testAccount, assetFactory }) => {
    const assetA = await newAsset(assetFactory, testAccount.addr.toString())
    const client = await create(appFactoryAbiMethodOptions, testAccount.addr.toString(), assetA)
    await expect(client.send.call({ method: 'adminAction', args: [assetA, 5n] })).rejects.toThrow(/stale join event count/)
  })

  // --- resource_encoding= -----------------------------------------------------

  test('eligibleBalance returns the asset balance', async ({ appFactoryAbiMethodOptions, testAccount, assetFactory }) => {
    const assetA = await newAsset(assetFactory, testAccount.addr.toString())
    const client = await create(appFactoryAbiMethodOptions, testAccount.addr.toString(), assetA)
    // the testAccount created assetA (so holds it) and opts in to the app
    await client.send.optIn({ method: 'join' })
    const result = await client.send.call({ method: 'eligibleBalance', args: [assetA, client.appId, testAccount.addr.toString()] })
    expect(result.return).toBeGreaterThan(0n)
  })

  test('eligibleBalance requires the account to be opted in to the app', async ({
    appFactoryAbiMethodOptions,
    testAccount,
    assetFactory,
  }) => {
    const assetA = await newAsset(assetFactory, testAccount.addr.toString())
    const client = await create(appFactoryAbiMethodOptions, testAccount.addr.toString(), assetA)
    // no opt-in to the app has happened
    await expect(
      client.send.call({ method: 'eligibleBalance', args: [assetA, client.appId, testAccount.addr.toString()] }),
    ).rejects.toThrow(/account not opted in to app/)
  })

  test('eligibleBalance requires the account to hold the asset', async ({
    appFactoryAbiMethodOptions,
    testAccount,
    assetFactory,
    algorand,
    localnet,
  }) => {
    const assetA = await newAsset(assetFactory, testAccount.addr.toString())
    const client = await create(appFactoryAbiMethodOptions, testAccount.addr.toString(), assetA)
    const other = await localnet.context.generateAccount({ initialFunds: algo(1) })

    // `other` opts in to the fee asset (with zero balance) so it can join the app
    await algorand.send.assetOptIn({ sender: other.addr, assetId: assetA })
    await client.send.optIn({ method: 'join', sender: other.addr })
    // ...then opts back out of the asset, remaining opted in to the app only
    await algorand.send.assetOptOut({ sender: other.addr, assetId: assetA, creator: testAccount.addr, ensureZeroBalance: true })

    await expect(client.send.call({ method: 'eligibleBalance', args: [assetA, client.appId, other.addr.toString()] })).rejects.toThrow(
      /account is not opted in to the asset/,
    )
  })

  // --- allow_actions= ---------------------------------------------------------

  test('join lifecycle: noop, optin, closeout', async ({ appFactoryAbiMethodOptions, testAccount, assetFactory }) => {
    const assetA = await newAsset(assetFactory, testAccount.addr.toString())
    const client = await create(appFactoryAbiMethodOptions, testAccount.addr.toString(), assetA)

    // NoOp join: allowed, but does not count as a new member
    await client.send.call({ method: 'join' })
    expect((await client.send.call({ method: 'getJoinEventCount' })).return).toBe(0n)

    // OptIn join: allocates local state and increments the member count
    await client.send.optIn({ method: 'join' })
    expect((await client.send.call({ method: 'getJoinEventCount' })).return).toBe(1n)
    const localState = await client.getLocalState(testAccount)
    const joinedRound = localState['joinedRound'].value
    expect(typeof joinedRound).toBe('bigint')
    expect(joinedRound as bigint).toBeGreaterThan(0n)

    // NoOp join after opting in: still a member, count unchanged
    await client.send.call({ method: 'join' })
    expect((await client.send.call({ method: 'getJoinEventCount' })).return).toBe(1n)

    // CloseOut via optOut releases local state and counts the leave event;
    // the join event counter is never decremented
    await client.send.closeOut({ method: 'optOut' })
    expect((await client.send.call({ method: 'getJoinEventCount' })).return).toBe(1n)
    const globalState = await client.getGlobalState()
    expect(globalState['leaveEventCount'].value).toBe(1n)
  })

  test('a second opt-in is rejected by the network', async ({ appFactoryAbiMethodOptions, testAccount, assetFactory }) => {
    const assetA = await newAsset(assetFactory, testAccount.addr.toString())
    const client = await create(appFactoryAbiMethodOptions, testAccount.addr.toString(), assetA)
    await client.send.optIn({ method: 'join' })
    // an already-opted-in account cannot opt in again — the node rejects the
    // transaction before any contract logic runs, so join_event_count cannot be
    // inflated by repeating OptIn
    await expect(client.send.optIn({ method: 'join' })).rejects.toThrow(/already opted in/)
    expect((await client.send.call({ method: 'getJoinEventCount' })).return).toBe(1n)
  })

  test('join event count drifts after a clear state', async ({ appFactoryAbiMethodOptions, testAccount, assetFactory }) => {
    const assetA = await newAsset(assetFactory, testAccount.addr.toString())
    const client = await create(appFactoryAbiMethodOptions, testAccount.addr.toString(), assetA)
    await client.send.optIn({ method: 'join' })
    expect((await client.send.call({ method: 'getJoinEventCount' })).return).toBe(1n)

    // ClearState wipes local state but cannot be blocked and bypasses the
    // CloseOut handler, so the leave is never recorded...
    await client.send.bare.clearState({})
    expect((await client.getGlobalState())['leaveEventCount'].value).toBe(0n)

    // ...and rejoining records a second join event for the same account, so
    // join - leave now overcounts active members: the "best-effort" drift the
    // optOut docstring warns about
    await client.send.optIn({ method: 'join' })
    expect((await client.send.call({ method: 'getJoinEventCount' })).return).toBe(2n)
    expect((await client.getGlobalState())['leaveEventCount'].value).toBe(0n)
  })

  test('join requires the sender to hold the fee asset', async ({ appFactoryAbiMethodOptions, testAccount, assetFactory, localnet }) => {
    const assetA = await newAsset(assetFactory, testAccount.addr.toString())
    const client = await create(appFactoryAbiMethodOptions, testAccount.addr.toString(), assetA)
    const other = await localnet.context.generateAccount({ initialFunds: algo(1) })
    // `other` is not opted in to the fee asset, so joining is rejected
    await expect(client.send.optIn({ method: 'join', sender: other.addr })).rejects.toThrow(/must be opted in to fee asset/)
  })

  test('shutDown can only be called by the governor', async ({ appFactoryAbiMethodOptions, testAccount, assetFactory, localnet }) => {
    const assetA = await newAsset(assetFactory, testAccount.addr.toString())
    const client = await create(appFactoryAbiMethodOptions, testAccount.addr.toString(), assetA)
    const other = await localnet.context.generateAccount({ initialFunds: algo(1) })

    await expect(client.send.delete({ method: 'shutDown', sender: other.addr })).rejects.toThrow(/only governor can delete/)

    // the governor can delete the app
    const result = await client.send.delete({ method: 'shutDown' })
    expect(result.confirmation.confirmedRound).toBeGreaterThan(0n)
  })
})
