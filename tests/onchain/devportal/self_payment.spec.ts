import { algo, microAlgo } from '@algorandfoundation/algokit-utils'
import { LogicSigAccount } from '@algorandfoundation/algokit-utils/transact'
import { createHash } from 'node:crypto'
import { describe, expect } from 'vitest'
import { compileLogicSig, createArc4TestFixture } from '../util/test-fixture'

// Behaviour tests for examples/devportal/self_payment (a LogicSig, not an app contract).
// SelfPayment only approves a 0-amount self-payment pinned to the network (genesis hash), a
// specific lastValid round, the min fee, and a fixed lease — supplied as TemplateVars at compile
// time. `contracts: []` just yields a funded account; no app is deployed.
const SRC = 'examples/devportal/self_payment/contract.algo.ts'

// The program requires `Txn.lease === sha256(Bytes('self-payment'))`.
const LEASE = new Uint8Array(createHash('sha256').update(Buffer.from('self-payment')).digest())

describe('devportal self_payment example', () => {
  const test = createArc4TestFixture({ paths: SRC, contracts: [] })

  test('SelfPayment approves a 0-amount self payment matching every pinned condition', async ({ algorand, testAccount }) => {
    const sp = await algorand.getSuggestedParams()
    const program = await compileLogicSig(SRC, 'SelfPayment', {
      TARGET_NETWORK_GENESIS: sp.genesisHash,
      LAST_ROUND: sp.lastValid,
    })
    const lsig = new LogicSigAccount(program)

    // Fund the escrow so it can exist and pay its own fee.
    await algorand.send.payment({ sender: testAccount.addr, receiver: lsig.addr, amount: algo(1) })

    // An empty self-payment with the expected lease, fee and lastValid round.
    const result = await algorand.send.payment({
      sender: lsig.addr,
      receiver: lsig.addr, // self
      amount: microAlgo(0n),
      staticFee: microAlgo(sp.minFee), // fee === Global.minTxnFee
      lastValidRound: sp.lastValid, // lastValid === LAST_ROUND
      lease: LEASE,
      signer: lsig.signer,
    })
    expect(result.confirmation.confirmedRound).toBeGreaterThan(0n)
  })

  test('SelfPayment rejects a non-zero amount', async ({ algorand, testAccount }) => {
    const sp = await algorand.getSuggestedParams()
    const program = await compileLogicSig(SRC, 'SelfPayment', {
      TARGET_NETWORK_GENESIS: sp.genesisHash,
      LAST_ROUND: sp.lastValid,
    })
    const lsig = new LogicSigAccount(program)
    await algorand.send.payment({ sender: testAccount.addr, receiver: lsig.addr, amount: algo(2) })

    // Txn.amount === 0 is required by the lsig.
    await expect(
      algorand.send.payment({
        sender: lsig.addr,
        receiver: lsig.addr,
        amount: microAlgo(1n),
        staticFee: microAlgo(sp.minFee),
        lastValidRound: sp.lastValid,
        lease: LEASE,
        signer: lsig.signer,
      }),
    ).rejects.toThrow()
  })

  test('SelfPayment rejects a wrong receiver', async ({ algorand, testAccount }) => {
    const sp = await algorand.getSuggestedParams()
    const program = await compileLogicSig(SRC, 'SelfPayment', {
      TARGET_NETWORK_GENESIS: sp.genesisHash,
      LAST_ROUND: sp.lastValid,
    })
    const lsig = new LogicSigAccount(program)
    await algorand.send.payment({ sender: testAccount.addr, receiver: lsig.addr, amount: algo(2) })

    // Txn.receiver must equal Txn.sender; paying to another account is rejected.
    await expect(
      algorand.send.payment({
        sender: lsig.addr,
        receiver: testAccount.addr,
        amount: microAlgo(0n),
        staticFee: microAlgo(sp.minFee),
        lastValidRound: sp.lastValid,
        lease: LEASE,
        signer: lsig.signer,
      }),
    ).rejects.toThrow()
  })

  test('SelfPayment rejects a missing lease', async ({ algorand, testAccount }) => {
    const sp = await algorand.getSuggestedParams()
    const program = await compileLogicSig(SRC, 'SelfPayment', {
      TARGET_NETWORK_GENESIS: sp.genesisHash,
      LAST_ROUND: sp.lastValid,
    })
    const lsig = new LogicSigAccount(program)
    await algorand.send.payment({ sender: testAccount.addr, receiver: lsig.addr, amount: algo(2) })

    // Without the expected lease the lsig rejects the transaction.
    await expect(
      algorand.send.payment({
        sender: lsig.addr,
        receiver: lsig.addr,
        amount: microAlgo(0n),
        staticFee: microAlgo(sp.minFee),
        lastValidRound: sp.lastValid,
        signer: lsig.signer,
      }),
    ).rejects.toThrow()
  })

  test('SelfPayment rejects a wrong fee', async ({ algorand, testAccount }) => {
    const sp = await algorand.getSuggestedParams()
    const program = await compileLogicSig(SRC, 'SelfPayment', {
      TARGET_NETWORK_GENESIS: sp.genesisHash,
      LAST_ROUND: sp.lastValid,
    })
    const lsig = new LogicSigAccount(program)
    await algorand.send.payment({ sender: testAccount.addr, receiver: lsig.addr, amount: algo(2) })

    // Txn.fee must be exactly Global.minTxnFee.
    await expect(
      algorand.send.payment({
        sender: lsig.addr,
        receiver: lsig.addr,
        amount: microAlgo(0n),
        staticFee: microAlgo(sp.minFee * 2n),
        lastValidRound: sp.lastValid,
        lease: LEASE,
        signer: lsig.signer,
      }),
    ).rejects.toThrow()
  })

  test('SelfPayment rejects a rekey', async ({ algorand, testAccount }) => {
    const sp = await algorand.getSuggestedParams()
    const program = await compileLogicSig(SRC, 'SelfPayment', {
      TARGET_NETWORK_GENESIS: sp.genesisHash,
      LAST_ROUND: sp.lastValid,
    })
    const lsig = new LogicSigAccount(program)
    await algorand.send.payment({ sender: testAccount.addr, receiver: lsig.addr, amount: algo(2) })

    // Txn.rekeyTo must be the zero address; rekeying away is rejected.
    await expect(
      algorand.send.payment({
        sender: lsig.addr,
        receiver: lsig.addr,
        amount: microAlgo(0n),
        staticFee: microAlgo(sp.minFee),
        lastValidRound: sp.lastValid,
        lease: LEASE,
        rekeyTo: testAccount.addr,
        signer: lsig.signer,
      }),
    ).rejects.toThrow()
  })

  test('SelfPayment rejects a wrong lastValid round', async ({ algorand, testAccount }) => {
    const sp = await algorand.getSuggestedParams()
    // Compile pinned to a LAST_ROUND that the actual txn will not match.
    const program = await compileLogicSig(SRC, 'SelfPayment', {
      TARGET_NETWORK_GENESIS: sp.genesisHash,
      LAST_ROUND: sp.lastValid + 500n,
    })
    const lsig = new LogicSigAccount(program)
    await algorand.send.payment({ sender: testAccount.addr, receiver: lsig.addr, amount: algo(2) })

    // Txn.lastValid must equal the pinned LAST_ROUND template var.
    await expect(
      algorand.send.payment({
        sender: lsig.addr,
        receiver: lsig.addr,
        amount: microAlgo(0n),
        staticFee: microAlgo(sp.minFee),
        lastValidRound: sp.lastValid,
        lease: LEASE,
        signer: lsig.signer,
      }),
    ).rejects.toThrow()
  })
})
