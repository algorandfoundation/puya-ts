import { algos } from '@algorandfoundation/algokit-utils'
import type { AppClient } from '@algorandfoundation/algokit-utils/app-client'
import type { AppFactory } from '@algorandfoundation/algokit-utils/app-factory'
import { OnApplicationComplete } from '@algorandfoundation/algokit-utils/transact'
import { beforeEach, describe, expect } from 'vitest'
import { createArc4TestFixture } from '../util/test-fixture'

// A minimal "#pragma version 10; int 1" program, used to stand up a raw app
// whose OptIn writes nothing, so an opted-in account has no `my_counter` key.
const APPROVE = new Uint8Array([0x0a, 0x81, 0x01])

// Behaviour tests for examples/devportal/reference_account_app.
// MyCounter keeps a per-account counter in local state; ReferenceAccountApp reads
// that counter out of another app, either from a template-baked account/app pair
// (getMyCounter) or from caller-supplied references (getMyCounterWithArg).
// A fresh scope per test (beforeEach) keeps opt-in/counter state from leaking.
describe('devportal reference_account_app example', () => {
  const test = createArc4TestFixture({
    paths: 'examples/devportal/reference_account_app/contract.algo.ts',
    contracts: { MyCounter: {}, ReferenceAccountApp: {} },
    newScopeAt: beforeEach,
  })

  // Deploy ReferenceAccountApp with both template variables filled. The account
  // is passed as its raw 32-byte public key and the app as its numeric id,
  // mirroring the deploy-time params the Python test supplies.
  const deployRef = async (appFactory: AppFactory, knownAccount: Uint8Array, knownApp: bigint): Promise<AppClient> => {
    const { appClient } = await appFactory.deploy({
      deployTimeParams: {
        TMPL_KNOWN_ACCOUNT: knownAccount,
        TMPL_KNOWN_APP: knownApp,
      },
    })
    return appClient
  }

  test('increment_my_counter tracks a per-account counter', async ({ appClientMyCounter }) => {
    await appClientMyCounter.send.optIn({ method: 'optIn' })
    expect((await appClientMyCounter.send.call({ method: 'incrementMyCounter', args: [] })).return).toBe(1n)
    expect((await appClientMyCounter.send.call({ method: 'incrementMyCounter', args: [] })).return).toBe(2n)
    expect((await appClientMyCounter.send.call({ method: 'incrementMyCounter', args: [] })).return).toBe(3n)
  })

  test('increment without opting in trips the is_opted_in assertion', async ({ appClientMyCounter }) => {
    await expect(appClientMyCounter.send.call({ method: 'incrementMyCounter', args: [] })).rejects.toThrow(
      /Account is not opted in to the app/,
    )
  })

  test('getMyCounterWithArg reads another app local state via account and app references', async ({
    appClientMyCounter,
    appFactoryReferenceAccountApp,
    testAccount,
  }) => {
    await appClientMyCounter.send.optIn({ method: 'optIn' })
    await appClientMyCounter.send.call({ method: 'incrementMyCounter', args: [] })
    await appClientMyCounter.send.call({ method: 'incrementMyCounter', args: [] })

    const ref = await deployRef(appFactoryReferenceAccountApp, testAccount.addr.publicKey, appClientMyCounter.appId)
    const result = await ref.send.call({
      method: 'getMyCounterWithArg',
      args: [testAccount.addr.toString(), appClientMyCounter.appId],
    })

    expect(result.return).toBe(2n)
  })

  test('getMyCounterWithArg fails when the account never opted in to the referenced app', async ({
    appClientMyCounter,
    appFactoryReferenceAccountApp,
    testAccount,
    localnet,
  }) => {
    // For an account that never opted in, app_local_get_ex returns exists=0 and
    // the contract's `assert(exists, ...)` trips. Depending on whether AlgoKit's
    // resource-population simulate intercepts the failure, this surfaces either as
    // the mapped assert message or the bare `app_local_get_ex` opcode error.
    const notOptedIn = await localnet.context.generateAccount({ initialFunds: algos(1) })
    const ref = await deployRef(appFactoryReferenceAccountApp, testAccount.addr.publicKey, appClientMyCounter.appId)

    await expect(
      ref.send.call({
        method: 'getMyCounterWithArg',
        args: [notOptedIn.addr.toString(), appClientMyCounter.appId],
      }),
    ).rejects.toThrow(/my_counter is not set for this account|app_local_get_ex|cannot fetch key/)
  })

  test('getMyCounterWithArg fails when the account is opted in but the key was never written', async ({
    appFactoryReferenceAccountApp,
    testAccount,
    algorand,
  }) => {
    // A raw app with a local-state schema whose opt-in writes nothing, so the
    // opted-in account has no "my_counter" key — the case the assert guards.
    const raw = await algorand.send.appCreate({
      sender: testAccount.addr,
      approvalProgram: APPROVE,
      clearStateProgram: APPROVE,
      schema: { globalInts: 0, globalByteSlices: 0, localInts: 1, localByteSlices: 0 },
    })
    await algorand.send.appCall({
      sender: testAccount.addr,
      appId: raw.appId,
      onComplete: OnApplicationComplete.OptIn,
    })

    const ref = await deployRef(appFactoryReferenceAccountApp, testAccount.addr.publicKey, 0n)

    await expect(
      ref.send.call({
        method: 'getMyCounterWithArg',
        args: [testAccount.addr.toString(), raw.appId],
      }),
    ).rejects.toThrow(/my_counter is not set for this account|app_local_get_ex/)
  })

  test('getMyCounter reads the template-provided account/app pair counter', async ({
    appClientMyCounter,
    appFactoryReferenceAccountApp,
    testAccount,
  }) => {
    await appClientMyCounter.send.optIn({ method: 'optIn' })
    await appClientMyCounter.send.call({ method: 'incrementMyCounter', args: [] })

    const ref = await deployRef(appFactoryReferenceAccountApp, testAccount.addr.publicKey, appClientMyCounter.appId)
    const result = await ref.send.call({ method: 'getMyCounter', args: [] })

    expect(result.return).toBe(1n)
  })

  test('getMyCounter fails when the template account never opted in to the known app', async ({
    appClientMyCounter,
    appFactoryReferenceAccountApp,
    localnet,
  }) => {
    // The template-provided account never opted in, so app_local_get_ex returns
    // exists=0 and the contract's `assert(exists, ...)` trips — surfaced either as
    // the mapped assert message or the bare `app_local_get_ex` opcode error.
    const notOptedIn = await localnet.context.generateAccount({ initialFunds: algos(1) })
    const ref = await deployRef(appFactoryReferenceAccountApp, notOptedIn.addr.publicKey, appClientMyCounter.appId)

    await expect(ref.send.call({ method: 'getMyCounter', args: [] })).rejects.toThrow(
      /my_counter is not set for this account|app_local_get_ex|cannot fetch key/,
    )
  })
})
