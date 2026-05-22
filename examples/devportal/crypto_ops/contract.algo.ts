import type { bytes } from '@algorandfoundation/algorand-typescript'
import { abimethod, contract, Contract, op } from '@algorandfoundation/algorand-typescript'
import { Ecdsa, VrfVerify } from '@algorandfoundation/algorand-typescript/op'

@contract({ avmVersion: 12 })
export class CryptoOps extends Contract {
  // example: SHA_HASHES
  @abimethod()
  hashes(data: bytes): readonly [bytes<32>, bytes<32>, bytes<32>, bytes<32>] {
    return [op.sha256(data), op.sha3_256(data), op.sha512_256(data), op.keccak256(data)] as const
  }

  // example: SHA_HASHES

  // example: ED25519_VERIFY
  @abimethod()
  ed25519(data: bytes, signature: bytes, publicKey: bytes): readonly [boolean, boolean] {
    const bound = op.ed25519verify(data, signature, publicKey)
    const bare = op.ed25519verifyBare(data, signature, publicKey)
    return [bound, bare] as const
  }

  // example: ED25519_VERIFY

  // example: ECDSA_VERIFY
  @abimethod()
  ecdsa(data: bytes, sigR: bytes, sigS: bytes, pubkeyX: bytes, pubkeyY: bytes): readonly [boolean, boolean] {
    const k1 = op.ecdsaVerify(Ecdsa.Secp256k1, data, sigR, sigS, pubkeyX, pubkeyY)
    const r1 = op.ecdsaVerify(Ecdsa.Secp256r1, data, sigR, sigS, pubkeyX, pubkeyY)
    return [k1, r1] as const
  }

  @abimethod()
  ecdsaRecoverCompressed(compressedPubkey: bytes): readonly [bytes<32>, bytes<32>] {
    return op.ecdsaPkDecompress(Ecdsa.Secp256k1, compressedPubkey)
  }

  // example: ECDSA_VERIFY

  // example: VRF_VERIFY
  @abimethod()
  vrf(message: bytes, proof: bytes, publicKey: bytes): readonly [bytes<64>, boolean] {
    return op.vrfVerify(VrfVerify.VrfAlgorand, message, proof, publicKey)
  }

  // example: VRF_VERIFY
}
