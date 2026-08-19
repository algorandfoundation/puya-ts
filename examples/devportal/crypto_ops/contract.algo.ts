import type { bytes, uint64 } from '@algorandfoundation/algorand-typescript'
import { abimethod, contract, Contract, op } from '@algorandfoundation/algorand-typescript'
import { Ecdsa, VrfVerify } from '@algorandfoundation/algorand-typescript/op'

/**
 * A tour of the cryptographic opcodes exposed via `op`.
 *
 * All hash and verify opcodes accept byte-backed inputs: `bytes`, `string`,
 * `arc4` values, account addresses; basically any type that is represented as
 * a byte array in the TEAL code (including plain byte literals).
 *
 * Most of these opcodes are expensive: they cost far more than the 700
 * opcode-budget units a single application call provides, so callers typically
 * pool budget by grouping the call with extra app calls, or the contract
 * raises its own budget with `ensureBudget` (see the op_budget example).
 *
 * As many of these constitute some sort of cryptographic verification, many
 * times they can also be used in conjunction with logic signatures, which are
 * stateless programs executed at transaction signature verification time but
 * have a budget separate to app calls in a group.
 */
@contract({ avmVersion: 12 })
export class CryptoOps extends Contract {
  // example: SHA_HASHES
  /**
   * Most common hashing algorithms.
   * All return `bytes`. Always remember that the input arguments are visible
   * in the AVM, and thus the preimage of the hash is easily reconstructible
   * for anything being hashed on-chain.
   */
  @abimethod()
  hashes(data: bytes): readonly [bytes<32>, bytes<32>, bytes<32>, bytes<32>] {
    return [op.sha256(data), op.sha3_256(data), op.sha512_256(data), op.keccak256(data)] as const
  }

  // example: SHA_HASHES

  // example: ED25519_VERIFY
  /**
   * Two ed25519 verify variants:
   *   * `ed25519verify` given some data, a signature and a public key, it
   *     verifies the signature over `"ProgData" || program_hash || data`
   *     (where `program_hash` is the hash of the current program and "ProgData"
   *     is just a string used as domain separator).
   *   * `ed25519verifyBare` given the same 3 parameters, it verifies the
   *     signature over the raw data.
   */
  @abimethod()
  ed25519(data: bytes, signature: bytes, publicKey: bytes): readonly [boolean, boolean] {
    const bound = op.ed25519verify(data, signature, publicKey)
    const bare = op.ed25519verifyBare(data, signature, publicKey)
    return [bound, bare] as const
  }

  // example: ED25519_VERIFY

  // example: ECDSA_VERIFY
  /**
   * ECDSA verify over either Secp256k1 (Bitcoin-compatible) or Secp256r1 (used
   * by passkeys / WebAuthn). `data` must be a 32-byte digest of the signed
   * message (hash it before calling); the signature is supplied as (R, S) — in
   * canonical low-S form — and the public key as (X, Y), both decompressed.
   */
  @abimethod()
  ecdsa(data: bytes, sigR: bytes, sigS: bytes, pubkeyX: bytes, pubkeyY: bytes): readonly [boolean, boolean] {
    const k1 = op.ecdsaVerify(Ecdsa.Secp256k1, data, sigR, sigS, pubkeyX, pubkeyY)
    const r1 = op.ecdsaVerify(Ecdsa.Secp256r1, data, sigR, sigS, pubkeyX, pubkeyY)
    return [k1, r1] as const
  }

  /**
   * `ecdsaPkDecompress` expands a compressed (33-byte) Secp256k1 or Secp256r1
   * public key into its (X, Y) components. Useful for accepting compressed keys
   * on the wire while feeding `ecdsaVerify`.
   */
  @abimethod()
  ecdsaDecompress(compressedPubkey: bytes): readonly [bytes<32>, bytes<32>] {
    return op.ecdsaPkDecompress(Ecdsa.Secp256k1, compressedPubkey)
  }

  /**
   * `ecdsaPkRecover` recovers the signer's public key (X, Y) from a 32-byte
   * digest, a signature and its recovery id — Bitcoin/Ethereum style
   * "ecrecover". Only supported for Secp256k1.
   */
  @abimethod()
  ecdsaRecover(digest: bytes, recoveryId: uint64, sigR: bytes, sigS: bytes): readonly [bytes<32>, bytes<32>] {
    return op.ecdsaPkRecover(Ecdsa.Secp256k1, digest, recoveryId, sigR, sigS)
  }

  // example: ECDSA_VERIFY

  // example: VRF_VERIFY
  /**
   * VRF (Verifiable Random Function) verification using the `VrfAlgorand`
   * parameter set (ECVRF-ED25519-SHA512-Elligator2).
   *
   * Returns a `[vrfOutput, verified]` tuple: the output is the random bytes
   * derived from the message, and `verified` is true only if the proof checks
   * against `publicKey`. The output is meaningful only when `verified` is true.
   */
  @abimethod()
  vrf(message: bytes, proof: bytes, publicKey: bytes): readonly [bytes<64>, boolean] {
    return op.vrfVerify(VrfVerify.VrfAlgorand, message, proof, publicKey)
  }

  // example: VRF_VERIFY
}
