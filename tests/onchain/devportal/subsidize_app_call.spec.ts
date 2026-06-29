import type { AlgorandClient, Address } from '@algorandfoundation/algokit-utils'
import { algo, microAlgo } from '@algorandfoundation/algokit-utils'
import type { AppClient } from '@algorandfoundation/algokit-utils/app-client'
import type { AppFactory } from '@algorandfoundation/algokit-utils/app-factory'
import { LogicSigAccount } from '@algorandfoundation/algokit-utils/transact'
import { describe, expect } from 'vitest'
import { compileLogicSig, createArc4TestFixture } from '../util/test-fixture'

// Behaviour tests for examples/devportal/subsidize_app_call (a LogicSig).
// SubsidizeAppCall approves a 0-amount self-payment carrying 2x the min fee, but only when the
// preceding group txn is a fee-0 app call to a pinned app id (KNOWN_APP). We deploy a small app
// (control_flow's IfElseExample) as KNOWN_APP, then submit [fee-0 app call, lsig payment paying both].
// Mirrors puya's tests/onchain/devportal/test_subsidize_app_call.py.
const LSIG_SRC = 'examples/devportal/subsidize_app_call/contract.algo.ts'

const MIN_FEE = 1000n

describe('devportal subsidize_app_call example', () => {
  const test = createArc4TestFixture({
    paths: 'examples/devportal/control_flow/contract.algo.ts',
    contracts: { IfElseExample: {} },
  })

  // Compile the lsig pinned to `knownApp`, wrap it in a funded escrow account so it can pay the
  // pooled (2x) fee for the group.
  const fundedLsig = async (
    algorand: AlgorandClient,
    testAccount: Address,
    genesisHash: Uint8Array,
    expirationRound: bigint,
    knownApp: bigint,
  ): Promise<LogicSigAccount> => {
    const program = await compileLogicSig(LSIG_SRC, 'SubsidizeAppCall', {
      TARGET_NETWORK_GENESIS: genesisHash,
      EXPIRATION_ROUND: expirationRound,
      KNOWN_APP: knownApp,
    })
    const lsig = new LogicSigAccount(program)
    await algorand.send.payment({ sender: testAccount, receiver: lsig.addr, amount: algo(1) })
    return lsig
  }

  // Deploy a second, distinct instance of IfElseExample (a unique appName avoids idempotent reuse
  // of the fixture's primary app) so it can stand in as an "unknown" app the lsig is not pinned to.
  const deploySecondInstance = async (appFactory: AppFactory): Promise<AppClient> => {
    const { appClient } = await appFactory.deploy({ appName: 'IfElseExample-other' })
    return appClient
  }

  // Deploys the app contract AND compiles the logic sig, so allow extra time over the default.
  test('SubsidizeAppCall covers the fee of a fee-0 call to the known app', async ({ appClientIfElseExample, algorand, testAccount }) => {
    const sp = await algorand.getSuggestedParams()
    const lsig = await fundedLsig(algorand, testAccount, sp.genesisHash, sp.lastValid, appClientIfElseExample.appId)

    // The subsidised call: a real app method, but with fee 0 — the lsig payment pays for it.
    const appCall = await appClientIfElseExample.createTransaction.call({
      method: 'isEven',
      args: [4n],
      staticFee: microAlgo(0n),
    })

    const result = await algorand
      .newGroup()
      .addTransaction(appCall.transactions[0]) // index 0: the fee-0 app call
      .addPayment({
        sender: lsig.addr,
        receiver: lsig.addr, // self payment, amount 0
        amount: microAlgo(0n),
        staticFee: microAlgo(MIN_FEE * 2n), // pays for both txns
        lastValidRound: sp.lastValid, // <= EXPIRATION_ROUND
        signer: lsig.signer,
      })
      .send()

    // Both transactions confirmed in the same round => the lsig approved subsidising the call.
    expect(result.confirmations).toHaveLength(2)
    expect(result.confirmations[1].confirmedRound).toBeGreaterThan(0n)
  }, 120_000)

  test('SubsidizeAppCall rejects an app call to an unknown app', async ({
    appClientIfElseExample,
    appFactoryIfElseExample,
    algorand,
    testAccount,
  }) => {
    const sp = await algorand.getSuggestedParams()
    const other = await deploySecondInstance(appFactoryIfElseExample)
    // lsig is pinned to the primary app, but the group calls `other`.
    const lsig = await fundedLsig(algorand, testAccount, sp.genesisHash, sp.lastValid, appClientIfElseExample.appId)

    const appCall = await other.createTransaction.call({ method: 'isEven', args: [4n], staticFee: microAlgo(0n) })

    await expect(
      algorand
        .newGroup()
        .addTransaction(appCall.transactions[0])
        .addPayment({
          sender: lsig.addr,
          receiver: lsig.addr,
          amount: microAlgo(0n),
          staticFee: microAlgo(MIN_FEE * 2n),
          lastValidRound: sp.lastValid,
          signer: lsig.signer,
        })
        .send(),
    ).rejects.toThrow()
  }, 120_000)

  test('SubsidizeAppCall rejects when the app call pays its own fee', async ({ appClientIfElseExample, algorand, testAccount }) => {
    const sp = await algorand.getSuggestedParams()
    const lsig = await fundedLsig(algorand, testAccount, sp.genesisHash, sp.lastValid, appClientIfElseExample.appId)

    // A normally-paying app call breaks the `previousAppCall.fee === 0` condition.
    const appCall = await appClientIfElseExample.createTransaction.call({
      method: 'isEven',
      args: [4n],
      staticFee: microAlgo(MIN_FEE),
    })

    await expect(
      algorand
        .newGroup()
        .addTransaction(appCall.transactions[0])
        .addPayment({
          sender: lsig.addr,
          receiver: lsig.addr,
          amount: microAlgo(0n),
          staticFee: microAlgo(MIN_FEE * 2n),
          lastValidRound: sp.lastValid,
          signer: lsig.signer,
        })
        .send(),
    ).rejects.toThrow()
  }, 120_000)

  test('SubsidizeAppCall rejects a payment carrying the wrong fee', async ({ appClientIfElseExample, algorand, testAccount }) => {
    const sp = await algorand.getSuggestedParams()
    const lsig = await fundedLsig(algorand, testAccount, sp.genesisHash, sp.lastValid, appClientIfElseExample.appId)

    const appCall = await appClientIfElseExample.createTransaction.call({
      method: 'isEven',
      args: [4n],
      staticFee: microAlgo(0n),
    })

    // The lsig payment fee must be exactly 2 * min_txn_fee; 3x is rejected.
    await expect(
      algorand
        .newGroup()
        .addTransaction(appCall.transactions[0])
        .addPayment({
          sender: lsig.addr,
          receiver: lsig.addr,
          amount: microAlgo(0n),
          staticFee: microAlgo(MIN_FEE * 3n),
          lastValidRound: sp.lastValid,
          signer: lsig.signer,
        })
        .send(),
    ).rejects.toThrow()
  }, 120_000)

  test('SubsidizeAppCall rejects when the preceding txn is not an app call', async ({ appClientIfElseExample, algorand, testAccount }) => {
    const sp = await algorand.getSuggestedParams()
    const lsig = await fundedLsig(algorand, testAccount, sp.genesisHash, sp.lastValid, appClientIfElseExample.appId)

    // The typed `gtxn.ApplicationCallTxn(groupIndex - 1)` lookup asserts the preceding txn is an
    // app call; a Payment in that slot fails outright.
    await expect(
      algorand
        .newGroup()
        .addPayment({ sender: testAccount.addr, receiver: testAccount.addr, amount: microAlgo(0n) })
        .addPayment({
          sender: lsig.addr,
          receiver: lsig.addr,
          amount: microAlgo(0n),
          staticFee: microAlgo(MIN_FEE * 2n),
          lastValidRound: sp.lastValid,
          signer: lsig.signer,
        })
        .send(),
    ).rejects.toThrow()
  }, 120_000)

  test('SubsidizeAppCall rejects a non-zero-amount lsig payment', async ({ appClientIfElseExample, algorand, testAccount }) => {
    const sp = await algorand.getSuggestedParams()
    const lsig = await fundedLsig(algorand, testAccount, sp.genesisHash, sp.lastValid, appClientIfElseExample.appId)

    const appCall = await appClientIfElseExample.createTransaction.call({
      method: 'isEven',
      args: [4n],
      staticFee: microAlgo(0n),
    })

    // The lsig payment must be an empty self-payment (amount === 0).
    await expect(
      algorand
        .newGroup()
        .addTransaction(appCall.transactions[0])
        .addPayment({
          sender: lsig.addr,
          receiver: lsig.addr,
          amount: microAlgo(1n),
          staticFee: microAlgo(MIN_FEE * 2n),
          lastValidRound: sp.lastValid,
          signer: lsig.signer,
        })
        .send(),
    ).rejects.toThrow()
  }, 120_000)

  test('SubsidizeAppCall rejects an expired lsig', async ({ appClientIfElseExample, algorand, testAccount }) => {
    const sp = await algorand.getSuggestedParams()
    // EXPIRATION_ROUND is far in the past, so `Txn.lastValid <= EXPIRATION_ROUND` fails.
    const lsig = await fundedLsig(algorand, testAccount, sp.genesisHash, 1n, appClientIfElseExample.appId)

    const appCall = await appClientIfElseExample.createTransaction.call({
      method: 'isEven',
      args: [4n],
      staticFee: microAlgo(0n),
    })

    await expect(
      algorand
        .newGroup()
        .addTransaction(appCall.transactions[0])
        .addPayment({
          sender: lsig.addr,
          receiver: lsig.addr,
          amount: microAlgo(0n),
          staticFee: microAlgo(MIN_FEE * 2n),
          lastValidRound: sp.lastValid,
          signer: lsig.signer,
        })
        .send(),
    ).rejects.toThrow()
  }, 120_000)
})
