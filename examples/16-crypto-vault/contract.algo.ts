/**
 * Example 16: Crypto Vault
 *
 * This example demonstrates hash functions, signature verification, and scratch space.
 *
 * Features:
 * - Hash functions (op.sha256, op.sha3_256, op.sha512_256, op.keccak256)
 * - Signature verification (op.ed25519verifyBare)
 * - Opcode budget management (ensureBudget, OpUpFeeSource)
 * - Scratch space (op.Scratch.store, op.Scratch.loadBytes, op.Scratch.loadUint64)
 * - Contract decorator options (@contract with avmVersion and scratchSlots)
 *
 * Prerequisites: LocalNet
 */
import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
// Contract: ABI-routed base; ensureBudget/OpUpFeeSource: budget management; contract: decorator
import {
  abimethod,
  assert,
  Contract,
  contract,
  ensureBudget,
  GlobalState,
  OpUpFeeSource,
  Uint64,
} from '@algorandfoundation/algorand-typescript'
// op namespace: hash functions, signature verification, scratch space
import { ed25519verifyBare, keccak256, Scratch, sha256, sha3_256, sha512_256 } from '@algorandfoundation/algorand-typescript/op'

// @contract decorator: avmVersion 11 for latest opcodes, scratchSlots reserves slots 0–3 for manual use
@contract({ avmVersion: 11, scratchSlots: [{ from: 0, to: 3 }] })
export class CryptoVault extends Contract {
  // GlobalState storing the hash commitment that guards the vault
  secretHash = GlobalState<bytes>()

  // Create the vault by storing a SHA-256 hash of the secret
  @abimethod({ allowActions: 'NoOp', onCreate: 'require' })
  public createApplication(commitment: bytes): void {
    // op.sha256: compute SHA-256 hash of the commitment (returns bytes<32>)
    this.secretHash.value = sha256(commitment)
  }

  // Demonstrate all four hash algorithms on the same input
  public hashShowcase(data: bytes): bytes {
    // ensureBudget: request 2000 opcode budget using excess group fee credit
    ensureBudget(Uint64(2000), OpUpFeeSource.GroupCredit)

    // op.sha256: SHA-256 hash (32 bytes) — most common on-chain hash
    const h1 = sha256(data)
    // op.sha3_256: SHA3-256 hash (32 bytes) — NIST standard
    const h2 = sha3_256(data)
    // op.sha512_256: SHA-512/256 hash (32 bytes) — Algorand's native hash
    const h3 = sha512_256(data)
    // op.keccak256: Keccak-256 hash (32 bytes) — Ethereum compatible
    const h4 = keccak256(data)

    // op.Scratch.store: persist intermediate results in scratch slots 0–3
    Scratch.store(0, h1) // Scratch slot 0 ← SHA-256 result
    Scratch.store(1, h2) // Scratch slot 1 ← SHA3-256 result
    Scratch.store(2, h3) // Scratch slot 2 ← SHA-512/256 result
    Scratch.store(3, h4) // Scratch slot 3 ← Keccak-256 result

    // op.Scratch.loadBytes: read back from scratch to verify round-trip
    const loaded0 = Scratch.loadBytes(0) // Load SHA-256 from slot 0
    const loaded1 = Scratch.loadBytes(1) // Load SHA3-256 from slot 1
    assert(loaded0 === h1, 'scratch 0 mismatch') // Verify scratch read matches original
    assert(loaded1 === h2, 'scratch 1 mismatch') // Verify scratch read matches original

    // Concatenate all four hashes as proof of computation
    return h1.concat(h2).concat(h3).concat(h4)
  }

  // Verify an Ed25519 signature and unlock the vault
  public verifyAndUnlock(data: bytes, signature: bytes, publicKey: bytes): boolean {
    // ensureBudget: signature verification is expensive — request budget from app account
    ensureBudget(Uint64(2500), OpUpFeeSource.AppAccount)

    // op.ed25519verifyBare: verify Ed25519 signature (data, 64-byte sig, 32-byte pubkey) → boolean
    const valid = ed25519verifyBare(data, signature, publicKey)
    assert(valid, 'Invalid Ed25519 signature')
    return valid
  }

  // Demonstrate scratch space with uint64 values
  public scratchCounter(iterations: uint64): uint64 {
    // op.Scratch.store: write initial uint64 value to scratch slot 0
    Scratch.store(0, iterations)

    // op.Scratch.loadUint64: read uint64 back from scratch slot 0
    const loaded: uint64 = Scratch.loadUint64(0)
    assert(loaded === iterations, 'uint64 scratch mismatch') // Verify round-trip

    // ensureBudget: request budget with Any fee source (group credit first, then app account)
    ensureBudget(Uint64(1000), OpUpFeeSource.Any)

    // op.Scratch.store: accumulate a result in scratch slot 1
    const doubled: uint64 = loaded + loaded // uint64 arithmetic — explicit annotation
    Scratch.store(1, doubled) // Write doubled value to slot 1

    // op.Scratch.loadUint64: load final result
    return Scratch.loadUint64(1) // Read and return doubled value from slot 1
  }

  // Verify a preimage matches the stored commitment
  public checkPreimage(preimage: bytes): boolean {
    // op.sha256: hash the preimage candidate
    const computed = sha256(preimage)
    // Compare computed hash with stored commitment
    return computed === this.secretHash.value
  }
}
