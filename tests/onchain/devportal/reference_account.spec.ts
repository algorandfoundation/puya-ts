import { algo } from '@algorandfoundation/algokit-utils'
import type { AppClient } from '@algorandfoundation/algokit-utils/app-client'
import type { AppFactory } from '@algorandfoundation/algokit-utils/app-factory'
import { randomBytes } from 'node:crypto'
import { describe, expect } from 'vitest'
import { createArc4TestFixture } from '../util/test-fixture'

// Behaviour tests for examples/devportal/reference_account.
//
// ReferenceAccount reads an external account's balance either from the
// `TMPL_KNOWN_ACCOUNT` template variable (no-arg variant) or from a
// caller-supplied reference (with-argument variant). Each test deploys a fresh
// app via the factory, baking in the account it needs at deploy time.
describe('devportal reference_account example', () => {
  const test = createArc4TestFixture({
    paths: 'examples/devportal/reference_account/contract.algo.ts',
    contracts: { ReferenceAccount: {} },
  })

  // Deploy ReferenceAccount with the KNOWN_ACCOUNT template variable filled with
  // the given account's public key (mirrors the Python `_deploy` helper).
  async function deploy(factory: AppFactory, knownAccount: Uint8Array): Promise<AppClient> {
    const { appClient } = await factory.send.bare.create({
      deployTimeParams: { KNOWN_ACCOUNT: knownAccount },
      note: randomBytes(8),
    })
    return appClient
  }

  test('the template-provided account balance is read by the no-arg variant', async ({
    appFactoryReferenceAccount,
    algorand,
    testAccount,
  }) => {
    // A dedicated fresh account funded with an exact, known amount. Because it
    // never sends a transaction it pays no fees, so its balance stays exactly
    // the funded amount.
    const funded = await algorand.account.random()
    const fundAmount = algo(5)
    await algorand.send.payment({ sender: testAccount.addr, receiver: funded.addr, amount: fundAmount })

    const client = await deploy(appFactoryReferenceAccount, funded.addr.publicKey)

    const result = await client.send.call({ method: 'getAccountBalance' })
    expect(result.return).toBe(fundAmount.microAlgo)
  })

  test('reading an unfunded template account fails', async ({ appFactoryReferenceAccount, algorand }) => {
    // Reading `.balance` of an unfunded account triggers the AVM
    // `acct_params_get AcctBalance` funded assertion, so the call fails. puya-ts
    // does not attach a source message to that compiler-generated assert (unlike
    // Python's "account funded"), and because the account is only referenced via
    // the template var, AlgoKit's resource-population simulate is what trips —
    // surfacing the bare `acct_params_get AcctBalance` opcode error.
    const unfunded = await algorand.account.random()
    const client = await deploy(appFactoryReferenceAccount, unfunded.addr.publicKey)

    await expect(client.send.call({ method: 'getAccountBalance' })).rejects.toThrow(/account funded|AcctBalance/)
  })

  test('a funded account balance is read via the with-argument variant', async ({ appFactoryReferenceAccount, algorand, testAccount }) => {
    const client = await deploy(appFactoryReferenceAccount, testAccount.addr.publicKey)

    const funded = await algorand.account.random()
    const fundAmount = algo(7)
    await algorand.send.payment({ sender: testAccount.addr, receiver: funded.addr, amount: fundAmount })

    const result = await client.send.call({
      method: 'getAccountBalanceWithArg',
      args: [funded.addr.toString()],
    })
    expect(result.return).toBe(fundAmount.microAlgo)
  })

  test('an unfunded account passed as an argument fails', async ({ appFactoryReferenceAccount, algorand, testAccount }) => {
    // An unfunded account has no balance entry, so `.balance` asserts.
    const client = await deploy(appFactoryReferenceAccount, testAccount.addr.publicKey)

    const fresh = await algorand.account.random()
    await expect(
      client.send.call({
        method: 'getAccountBalanceWithArg',
        args: [fresh.addr.toString()],
      }),
    ).rejects.toThrow(/account funded|AcctBalance/)
  })

  test('the reported balance grows as the account receives more payments', async ({
    appFactoryReferenceAccount,
    algorand,
    testAccount,
  }) => {
    const client = await deploy(appFactoryReferenceAccount, testAccount.addr.publicKey)

    // The target only ever receives payments (never sends), so its balance is
    // exactly the sum of what it has been funded.
    const target = await algorand.account.random()

    const balance = async () =>
      (
        await client.send.call({
          method: 'getAccountBalanceWithArg',
          args: [target.addr.toString()],
          note: randomBytes(8),
        })
      ).return

    const first = algo(3)
    await algorand.send.payment({ sender: testAccount.addr, receiver: target.addr, amount: first, note: randomBytes(8) })
    expect(await balance()).toBe(first.microAlgo)

    const second = algo(2)
    await algorand.send.payment({ sender: testAccount.addr, receiver: target.addr, amount: second, note: randomBytes(8) })
    expect(await balance()).toBe(first.microAlgo + second.microAlgo)
  })
})
