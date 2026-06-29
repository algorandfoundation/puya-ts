import { algo, microAlgo } from '@algorandfoundation/algokit-utils'
import type { Address, AlgorandClient } from '@algorandfoundation/algokit-utils'
import { LogicSigAccount } from '@algorandfoundation/algokit-utils/transact'
import crypto from 'node:crypto'
import { describe, expect } from 'vitest'
import { bigIntToUint8Array, utf8ToUint8Array } from '../../../src/util'
import { encodeDynamicBytes, joinUint8Arrays } from '../../util'
import { compileLogicSig, createArc4TestFixture } from '../util/test-fixture'

// Behaviour tests for examples/devportal/lsig_with_args (LogicSig classes, not app contracts).
// Pattern (per puya's tests/test_logic_sig.py): compile the lsig to bytecode (substituting
// TemplateVars), wrap in a LogicSigAccount, fund it, then submit a payment SENT BY the lsig —
// confirmed = approved, `rejects` = denied. `contracts: []` just yields a funded account; no app.
const SRC = 'examples/devportal/lsig_with_args/contract.algo.ts'

// Compiling the source compiles EVERY logic sig in the module, so all TemplateVars used
// anywhere in the file must be defined on each compile. We supply a zero-address base and
// override only the ones the logic sig under test actually reads.
const ZERO_ADDR = new Uint8Array(32)
const BASE_VARS = { BENEFICIARY: ZERO_ADDR, PAYEE_A: ZERO_ADDR, PAYEE_B: ZERO_ADDR }

const sha256 = (data: Uint8Array): Uint8Array => new Uint8Array(crypto.createHash('sha256').update(data).digest())

// ARC-4 arg encoders matching the Python test's `arc4_encode` calls.
const encUint64 = (v: bigint): Uint8Array => bigIntToUint8Array(v, 8)
const encAddress = (pk: Uint8Array): Uint8Array => pk // arc4.Address == raw 32-byte public key

// Fund a freshly-derived lsig contract account so it can pay out.
async function fund(algorand: AlgorandClient, sender: Address, lsigAddr: Address): Promise<void> {
  await algorand.send.payment({ sender, receiver: lsigAddr, amount: algo(2) })
}

describe('devportal lsig_with_args example', () => {
  const test = createArc4TestFixture({ paths: SRC, contracts: [] })

  // --- EscrowRelease: contract account, single beneficiary baked in via TemplateVar, uint64 arg ---

  test('EscrowRelease pays the beneficiary the pinned amount', async ({ algorand, testAccount }) => {
    const amount = 1_000_000n
    const program = await compileLogicSig(SRC, 'EscrowRelease', { ...BASE_VARS, BENEFICIARY: testAccount.addr.publicKey })
    const lsig = new LogicSigAccount(program, [encUint64(amount)])
    await fund(algorand, testAccount.addr, lsig.addr)

    const result = await algorand.send.payment({
      sender: lsig.addr,
      receiver: testAccount.addr,
      amount: microAlgo(amount),
      signer: lsig.signer,
    })
    expect(result.confirmation.confirmedRound).toBeGreaterThan(0n)
  })

  test('EscrowRelease rejects an amount mismatch', async ({ algorand, testAccount }) => {
    // the lsig arg pins Txn.amount; paying a different amount must fail
    const program = await compileLogicSig(SRC, 'EscrowRelease', { ...BASE_VARS, BENEFICIARY: testAccount.addr.publicKey })
    const lsig = new LogicSigAccount(program, [encUint64(1_000_000n)])
    await fund(algorand, testAccount.addr, lsig.addr)

    await expect(
      algorand.send.payment({ sender: lsig.addr, receiver: testAccount.addr, amount: microAlgo(999_999n), signer: lsig.signer }),
    ).rejects.toThrow()
  })

  test('EscrowRelease rejects a wrong receiver', async ({ algorand, testAccount }) => {
    // the beneficiary is baked into the program; paying anyone else must fail
    const outsider = (await algorand.account.random()).addr
    const amount = 1_000_000n
    const program = await compileLogicSig(SRC, 'EscrowRelease', { ...BASE_VARS, BENEFICIARY: testAccount.addr.publicKey })
    const lsig = new LogicSigAccount(program, [encUint64(amount)])
    await fund(algorand, testAccount.addr, lsig.addr)

    await expect(
      algorand.send.payment({ sender: lsig.addr, receiver: outsider, amount: microAlgo(amount), signer: lsig.signer }),
    ).rejects.toThrow()
  })

  test('EscrowRelease rejects a malformed arg encoding', async ({ algorand, testAccount }) => {
    // default validateEncoding="args" checks the encoded bytes against the
    // declared type: a 7-byte arg is not a valid uint64 encoding
    const program = await compileLogicSig(SRC, 'EscrowRelease', { ...BASE_VARS, BENEFICIARY: testAccount.addr.publicKey })
    const lsig = new LogicSigAccount(program, [new Uint8Array(7)])
    await fund(algorand, testAccount.addr, lsig.addr)

    await expect(
      algorand.send.payment({ sender: lsig.addr, receiver: testAccount.addr, amount: microAlgo(1_000_000n), signer: lsig.signer }),
    ).rejects.toThrow()
  })

  // --- VoucherRedeem: arc4.Struct arg, lease-based single-use guard ---

  // Voucher is a static ARC-4 struct: address(32) ++ uint64(8) ++ uint64(8).
  // The lsig enforces `Txn.lastValid === expiresAt` and `Txn.lease === sha256(voucher)`,
  // so expiresAt must sit inside the node's ~1000-round max validity window.
  async function buildVoucher(
    algorand: AlgorandClient,
    recipientPk: Uint8Array,
    maxAmount: bigint,
  ): Promise<{ voucher: Uint8Array; lease: Uint8Array; expiresAt: bigint }> {
    const { lastValid: expiresAt } = await algorand.getSuggestedParams()
    const voucher = joinUint8Arrays(encAddress(recipientPk), encUint64(maxAmount), encUint64(expiresAt))
    return { voucher, lease: sha256(voucher), expiresAt }
  }

  test('VoucherRedeem authorises a payment within the voucher limits', async ({ algorand, testAccount }) => {
    const { voucher, lease, expiresAt } = await buildVoucher(algorand, testAccount.addr.publicKey, 5_000_000n)
    const program = await compileLogicSig(SRC, 'VoucherRedeem', BASE_VARS)
    const lsig = new LogicSigAccount(program, [voucher])
    await fund(algorand, testAccount.addr, lsig.addr)

    const result = await algorand.send.payment({
      sender: lsig.addr,
      receiver: testAccount.addr,
      amount: microAlgo(1_000_000n),
      lease,
      lastValidRound: expiresAt,
      signer: lsig.signer,
    })
    expect(result.confirmation.confirmedRound).toBeGreaterThan(0n)
  })

  test('VoucherRedeem is single-use', async ({ algorand, testAccount }) => {
    const { voucher, lease, expiresAt } = await buildVoucher(algorand, testAccount.addr.publicKey, 5_000_000n)
    const program = await compileLogicSig(SRC, 'VoucherRedeem', BASE_VARS)
    const lsig = new LogicSigAccount(program, [voucher])
    await fund(algorand, testAccount.addr, lsig.addr)

    const result = await algorand.send.payment({
      sender: lsig.addr,
      receiver: testAccount.addr,
      amount: microAlgo(1_000_000n),
      note: utf8ToUint8Array('first'),
      lease,
      lastValidRound: expiresAt,
      signer: lsig.signer,
    })
    expect(result.confirmation.confirmedRound).toBeGreaterThan(0n)

    // replaying the same voucher is blocked by the ledger's lease mechanism:
    // the (sender, lease) slot is held until expiresAt, and after expiresAt
    // the pinned lastValid makes any redemption impossible
    await expect(
      algorand.send.payment({
        sender: lsig.addr,
        receiver: testAccount.addr,
        amount: microAlgo(1_000_000n),
        note: utf8ToUint8Array('second'),
        lease,
        lastValidRound: expiresAt,
        signer: lsig.signer,
      }),
    ).rejects.toThrow()
  })

  test('VoucherRedeem rejects an amount over max', async ({ algorand, testAccount }) => {
    const { voucher, lease, expiresAt } = await buildVoucher(algorand, testAccount.addr.publicKey, 5_000_000n)
    const program = await compileLogicSig(SRC, 'VoucherRedeem', BASE_VARS)
    const lsig = new LogicSigAccount(program, [voucher])
    await fund(algorand, testAccount.addr, lsig.addr)

    await expect(
      algorand.send.payment({
        sender: lsig.addr,
        receiver: testAccount.addr,
        amount: microAlgo(5_000_001n),
        lease,
        lastValidRound: expiresAt,
        signer: lsig.signer,
      }),
    ).rejects.toThrow()
  })

  test('VoucherRedeem rejects an expired voucher', async ({ algorand, testAccount }) => {
    // expiresAt is far in the past, so the pinned `Txn.lastValid === expiresAt`
    // check cannot hold for any currently-valid transaction
    const voucher = joinUint8Arrays(encAddress(testAccount.addr.publicKey), encUint64(5_000_000n), encUint64(1n))
    const program = await compileLogicSig(SRC, 'VoucherRedeem', BASE_VARS)
    const lsig = new LogicSigAccount(program, [voucher])
    await fund(algorand, testAccount.addr, lsig.addr)

    await expect(
      algorand.send.payment({
        sender: lsig.addr,
        receiver: testAccount.addr,
        amount: microAlgo(1_000_000n),
        lease: sha256(voucher),
        signer: lsig.signer,
      }),
    ).rejects.toThrow()
  })

  // --- MixedArgs (compiled name 'MixedArgsLsig'): native + arc4 args, returns uint64, lease guard ---

  // args = [uint64 amount, arc4.Address recipient, arc4.DynamicBytes note]
  const mixedArgs = (receiverPk: Uint8Array, note: Uint8Array): Uint8Array[] => [
    encUint64(500_000n),
    encAddress(receiverPk),
    encodeDynamicBytes(note),
  ]
  // the lsig requires Txn.lease === sha256(arg0 || arg1 || arg2)
  const mixedArgsLease = (args: Uint8Array[]): Uint8Array => sha256(joinUint8Arrays(...args))

  test('MixedArgs approves a payment matching all three args', async ({ algorand, testAccount }) => {
    // the note feeds the lease preimage (the lsig contract account address is the same
    // every run, since MixedArgs reads no TemplateVars), so it must be unique per run or
    // reruns within the ~1000-round lease window are rejected as duplicate (sender, lease) pairs
    const note = joinUint8Arrays(utf8ToUint8Array('mixed-args-'), new Uint8Array(crypto.randomBytes(8)))
    const args = mixedArgs(testAccount.addr.publicKey, note)
    const program = await compileLogicSig(SRC, 'MixedArgsLsig', BASE_VARS)
    const lsig = new LogicSigAccount(program, args)
    await fund(algorand, testAccount.addr, lsig.addr)

    const result = await algorand.send.payment({
      sender: lsig.addr,
      receiver: testAccount.addr,
      amount: microAlgo(500_000n),
      note,
      lease: mixedArgsLease(args),
      signer: lsig.signer,
    })
    expect(result.confirmation.confirmedRound).toBeGreaterThan(0n)
  })

  test('MixedArgs rejects a wrong note', async ({ algorand, testAccount }) => {
    const args = mixedArgs(testAccount.addr.publicKey, utf8ToUint8Array('expected-note'))
    const program = await compileLogicSig(SRC, 'MixedArgsLsig', BASE_VARS)
    const lsig = new LogicSigAccount(program, args)
    await fund(algorand, testAccount.addr, lsig.addr)

    await expect(
      algorand.send.payment({
        sender: lsig.addr,
        receiver: testAccount.addr,
        amount: microAlgo(500_000n),
        note: utf8ToUint8Array('wrong-note'),
        lease: mixedArgsLease(args),
        signer: lsig.signer,
      }),
    ).rejects.toThrow()
  })

  test('MixedArgs rejects a missing lease', async ({ algorand, testAccount }) => {
    // without the lease committing to the encoded args, the lsig must reject
    const note = utf8ToUint8Array('mixed-args-note')
    const args = mixedArgs(testAccount.addr.publicKey, note)
    const program = await compileLogicSig(SRC, 'MixedArgsLsig', BASE_VARS)
    const lsig = new LogicSigAccount(program, args)
    await fund(algorand, testAccount.addr, lsig.addr)

    await expect(
      algorand.send.payment({ sender: lsig.addr, receiver: testAccount.addr, amount: microAlgo(500_000n), note, signer: lsig.signer }),
    ).rejects.toThrow()
  })

  // --- EscrowReleaseTo: arc4.Address arg, validateEncoding="unsafe-disabled", two baked-in payees ---

  test('EscrowReleaseTo pays the approved first payee', async ({ algorand, testAccount }) => {
    const payeeB = (await algorand.account.random()).addr
    const program = await compileLogicSig(SRC, 'EscrowReleaseTo', {
      ...BASE_VARS,
      PAYEE_A: testAccount.addr.publicKey,
      PAYEE_B: payeeB.publicKey,
    })
    // caller selects PAYEE_A
    const lsig = new LogicSigAccount(program, [encAddress(testAccount.addr.publicKey)])
    await fund(algorand, testAccount.addr, lsig.addr)

    const result = await algorand.send.payment({
      sender: lsig.addr,
      receiver: testAccount.addr,
      amount: microAlgo(1_000_000n),
      signer: lsig.signer,
    })
    expect(result.confirmation.confirmedRound).toBeGreaterThan(0n)
  })

  test('EscrowReleaseTo pays the second baked-in payee', async ({ algorand, testAccount }) => {
    // the caller can select either baked-in payee; here PAYEE_B
    const payeeB = (await algorand.account.random()).addr
    const program = await compileLogicSig(SRC, 'EscrowReleaseTo', {
      ...BASE_VARS,
      PAYEE_A: testAccount.addr.publicKey,
      PAYEE_B: payeeB.publicKey,
    })
    const lsig = new LogicSigAccount(program, [encAddress(payeeB.publicKey)])
    await fund(algorand, testAccount.addr, lsig.addr)

    const result = await algorand.send.payment({
      sender: lsig.addr,
      receiver: payeeB,
      amount: microAlgo(1_000_000n),
      signer: lsig.signer,
    })
    expect(result.confirmation.confirmedRound).toBeGreaterThan(0n)
  })

  test('EscrowReleaseTo rejects an unapproved payee', async ({ algorand, testAccount }) => {
    const payeeB = (await algorand.account.random()).addr
    const outsider = (await algorand.account.random()).addr
    const program = await compileLogicSig(SRC, 'EscrowReleaseTo', {
      ...BASE_VARS,
      PAYEE_A: testAccount.addr.publicKey,
      PAYEE_B: payeeB.publicKey,
    })
    // caller passes an address that is not on the allow-list
    const lsig = new LogicSigAccount(program, [encAddress(outsider.publicKey)])
    await fund(algorand, testAccount.addr, lsig.addr)

    await expect(
      algorand.send.payment({ sender: lsig.addr, receiver: outsider, amount: microAlgo(1_000_000n), signer: lsig.signer }),
    ).rejects.toThrow()
  })
})
