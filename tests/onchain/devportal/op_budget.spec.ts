import { algo, microAlgos } from '@algorandfoundation/algokit-utils'
import type { AppFactory } from '@algorandfoundation/algokit-utils/app-factory'
import { createHash } from 'node:crypto'
import { describe, expect } from 'vitest'
import { uint8ArrayToHex, utf8ToUint8Array } from '../../../src/util'
import { createArc4TestFixture } from '../util/test-fixture'

// Behaviour tests for examples/devportal/op_budget.
//
// Each method runs `rounds` chained sha256 hashes. Without `ensureBudget` the
// loop would exceed the per-application 700 opcode budget; the methods differ
// only in where the opup inner-transaction fees are sourced from. Each test
// deploys a fresh (unfunded) app so the fee-source scenarios stay independent.
describe('devportal op_budget example', () => {
  const test = createArc4TestFixture({
    paths: 'examples/devportal/op_budget/contract.algo.ts',
    contracts: { OpBudget: {} },
  })

  // Generous flat fee to cover the chain of inner OpUp application calls.
  const FEE = microAlgos(20_000n)
  // Just the min fee: no surplus, so nothing is available as group credit.
  const MIN_FEE = microAlgos(1_000n)

  // Mirror of the contract: chained sha256 applied `rounds` times, as a hex string.
  function expectedDigest(seed: Uint8Array, rounds: number): string {
    let digest: Buffer = Buffer.from(seed)
    for (let i = 0; i < rounds; i++) {
      digest = createHash('sha256').update(digest).digest()
    }
    return digest.toString('hex')
  }

  async function freshApp(factory: AppFactory) {
    const { appClient } = await factory.send.bare.create({})
    return appClient
  }

  test('manyHashesGroupCredit tops up the budget from group credit', async ({ appFactoryOpBudget }) => {
    const client = await freshApp(appFactoryOpBudget)
    const seed = utf8ToUint8Array('seed')
    const rounds = 20n
    // ensureBudget covers the extra ops; the static fee pays the inner OpUps.
    const result = await client.send.call({ method: 'manyHashesGroupCredit', args: [seed, rounds], staticFee: FEE })
    expect(uint8ArrayToHex(result.return as Uint8Array).toLowerCase()).toBe(expectedDigest(seed, Number(rounds)))
  })

  test('manyHashes uses the default GroupCredit fee source', async ({ appFactoryOpBudget }) => {
    const client = await freshApp(appFactoryOpBudget)
    const seed = utf8ToUint8Array('hello world')
    const rounds = 20n
    const result = await client.send.call({ method: 'manyHashes', args: [seed, rounds], staticFee: FEE })
    expect(uint8ArrayToHex(result.return as Uint8Array).toLowerCase()).toBe(expectedDigest(seed, Number(rounds)))
  })

  test('manyHashesAny tops up the budget from any available fee source', async ({ appFactoryOpBudget }) => {
    const client = await freshApp(appFactoryOpBudget)
    const seed = utf8ToUint8Array('abc')
    const rounds = 25n
    const result = await client.send.call({ method: 'manyHashesAny', args: [seed, rounds], staticFee: FEE })
    expect(uint8ArrayToHex(result.return as Uint8Array).toLowerCase()).toBe(expectedDigest(seed, Number(rounds)))
  })

  test('manyHashesAppPays tops up the budget from the funded app account', async ({ appFactoryOpBudget }) => {
    const client = await freshApp(appFactoryOpBudget)
    // AppAccount fee source: the application account itself pays inner OpUp
    // fees, so it must hold algos.
    await client.fundAppAccount({ amount: algo(1) })

    const seed = utf8ToUint8Array('app pays')
    const rounds = 20n
    // The app account pays the inner fees, so the outer txn only needs the
    // standard min fee.
    const result = await client.send.call({ method: 'manyHashesAppPays', args: [seed, rounds], staticFee: MIN_FEE })
    expect(uint8ArrayToHex(result.return as Uint8Array).toLowerCase()).toBe(expectedDigest(seed, Number(rounds)))
  })

  test('manyHashes chains several OpUp inner calls for a large round count', async ({ appFactoryOpBudget }) => {
    const client = await freshApp(appFactoryOpBudget)
    // rounds=100 requires ~4100 ops of budget, i.e. several chained OpUp inner
    // calls on top of the base 700.
    const seed = utf8ToUint8Array('lots of hashing')
    const rounds = 100n
    const result = await client.send.call({ method: 'manyHashes', args: [seed, rounds], staticFee: FEE })
    expect(uint8ArrayToHex(result.return as Uint8Array).toLowerCase()).toBe(expectedDigest(seed, Number(rounds)))
  })

  test('manyHashes with zero rounds returns the seed unchanged', async ({ appFactoryOpBudget }) => {
    const client = await freshApp(appFactoryOpBudget)
    // With rounds=0 the loop never runs and the seed is returned unchanged.
    const seed = utf8ToUint8Array('unchanged')
    const result = await client.send.call({ method: 'manyHashes', args: [seed, 0n], staticFee: FEE })
    expect(uint8ArrayToHex(result.return as Uint8Array).toLowerCase()).toBe(uint8ArrayToHex(seed).toLowerCase())
  })

  test('manyHashes fails when there is no group credit to pay the OpUps', async ({ appFactoryOpBudget }) => {
    const client = await freshApp(appFactoryOpBudget)
    // GroupCredit inner OpUp calls carry fee=0 and rely on excess fee paid by
    // the group; with only the min fee on the outer txn there is no credit.
    await expect(client.send.call({ method: 'manyHashes', args: [utf8ToUint8Array('seed'), 20n], staticFee: MIN_FEE })).rejects.toThrow()
  })

  test('manyHashesAppPays fails when the app account is unfunded', async ({ appFactoryOpBudget }) => {
    const client = await freshApp(appFactoryOpBudget)
    // AppAccount fee source with no algos in the app account cannot pay the
    // inner OpUp fees, so the call fails.
    await expect(
      client.send.call({ method: 'manyHashesAppPays', args: [utf8ToUint8Array('seed'), 20n], staticFee: MIN_FEE }),
    ).rejects.toThrow()
  })
})
