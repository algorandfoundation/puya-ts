import type { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { microAlgos } from '@algorandfoundation/algokit-utils'
import { describe, expect } from 'vitest'
import { createArc4TestFixture } from '../util/test-fixture'

// Behaviour tests for examples/devportal/reject_version.
// Demonstrates the AVM 12 "reject version" feature: RejectVersion issues an inner ApplicationCall
// into a `hello(string)string` target, either pinning the accepted callee version via
// rejectVersion (callPinned) or reading target.version explicitly first (callChecked). Hello is a
// real v0 callee; raw approve-all apps are used where a specific (e.g. upgraded to v1) version is
// needed.

// callPinned / callChecked each issue one inner ApplicationCall with fee: 0, so callers cover it.
const INNER_FEE = microAlgos(1000n)

const ALWAYS_APPROVE = '#pragma version 10\nint 1'
// approve-all program that also logs an ARC-4 return value: the 0x151f7c75 ABI return prefix
// followed by the encoded string "Hello, Upgraded".
const HELLO_UPGRADED = '#pragma version 10\npushbytes 0x151f7c75000f48656c6c6f2c205570677261646564\nlog\npushint 1'

function randomNote(): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(8))
}

async function createRawApp(algorand: AlgorandClient, sender: string, approval: string): Promise<bigint> {
  const { appId } = await algorand.send.appCreate({
    sender,
    approvalProgram: approval,
    clearStateProgram: ALWAYS_APPROVE,
    note: randomNote(),
  })
  return appId
}

// Create a raw approve-all app, then update it once so its version becomes 1.
async function createUpgradedApp(algorand: AlgorandClient, sender: string, updatedApproval: string = ALWAYS_APPROVE): Promise<bigint> {
  const appId = await createRawApp(algorand, sender, ALWAYS_APPROVE)
  await algorand.send.appUpdate({
    sender,
    appId,
    approvalProgram: updatedApproval,
    clearStateProgram: ALWAYS_APPROVE,
    note: randomNote(),
  })
  return appId
}

describe('devportal reject_version example', () => {
  const test = createArc4TestFixture({
    paths: 'examples/devportal/reject_version/contract.algo.ts',
    contracts: {
      Hello: {},
      RejectVersion: {},
    },
  })

  test('callPinned invokes target within version pin', async ({ appClientRejectVersion, appClientHello }) => {
    // target is v0, so rejectVersion = maxVersion + 1 = 1 does not trip
    const { return: result } = await appClientRejectVersion.send.call({
      method: 'callPinned',
      args: [appClientHello.appId, 0n],
      extraFee: INNER_FEE,
    })
    expect(result).toBe('Hello, World')
  })

  test('callChecked rejects unpatched target', async ({ appClientRejectVersion, appClientHello }) => {
    // the freshly created target is version 0, i.e. still the version declared unsafe, so the
    // minimum-version guard rejects the call
    await expect(
      appClientRejectVersion.send.call({
        method: 'callChecked',
        args: [appClientHello.appId, 0n],
        extraFee: INNER_FEE,
      }),
    ).rejects.toThrow(/target bug has not been patched yet/)
  })

  test('callPinned rejects upgraded target', async ({ appClientRejectVersion, algorand, testAccount }) => {
    // the target has been updated once, so it is now version 1
    const targetId = await createUpgradedApp(algorand, testAccount.addr.toString())

    // rejectVersion = maxVersion + 1 = 1 and version 1 >= 1, so the AVM rejects the inner call
    // before the target's code runs
    await expect(
      appClientRejectVersion.send.call({
        method: 'callPinned',
        args: [targetId, 0n],
        extraFee: INNER_FEE,
      }),
    ).rejects.toThrow()
  })

  test('callPinned allows target at version pin boundary', async ({ appClientRejectVersion, algorand, testAccount }) => {
    const targetId = await createUpgradedApp(algorand, testAccount.addr.toString(), HELLO_UPGRADED)

    // target version (1) == maxVersion (1): rejectVersion = 2 does not trip
    const { return: result } = await appClientRejectVersion.send.call({
      method: 'callPinned',
      args: [targetId, 1n],
      extraFee: INNER_FEE,
    })
    expect(result).toBe('Hello, Upgraded')
  })

  test('callChecked allows patched target', async ({ appClientRejectVersion, algorand, testAccount }) => {
    // the target has been updated once (version 0 -> 1), i.e. patched past the unsafe version 0,
    // so the guard passes and the inner call runs
    const targetId = await createUpgradedApp(algorand, testAccount.addr.toString(), HELLO_UPGRADED)

    const { return: result } = await appClientRejectVersion.send.call({
      method: 'callChecked',
      args: [targetId, 0n],
      extraFee: INNER_FEE,
    })
    expect(result).toBe('Hello, Upgraded')
  })

  test('callChecked rejects target at unsafe version boundary', async ({ appClientRejectVersion, algorand, testAccount }) => {
    const targetId = await createUpgradedApp(algorand, testAccount.addr.toString(), HELLO_UPGRADED)

    // target.version (1) is not strictly greater than unsafeVersion (1): being AT the unsafe
    // version is still unsafe, so the guard rejects
    await expect(
      appClientRejectVersion.send.call({
        method: 'callChecked',
        args: [targetId, 1n],
        extraFee: INNER_FEE,
      }),
    ).rejects.toThrow(/target bug has not been patched yet/)
  })

  test('callChecked fails for missing app', async ({ appClientRejectVersion, algorand, testAccount }) => {
    // create then delete an app, leaving a dangling app id
    const sender = testAccount.addr.toString()
    const targetId = await createRawApp(algorand, sender, ALWAYS_APPROVE)
    await algorand.send.appDelete({ sender, appId: targetId, note: randomNote() })

    // reading target.version fails because the app no longer exists
    await expect(
      appClientRejectVersion.send.call({
        method: 'callChecked',
        args: [targetId, 0n],
        extraFee: INNER_FEE,
      }),
    ).rejects.toThrow()
  })
})
