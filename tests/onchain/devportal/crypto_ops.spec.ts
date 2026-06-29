import type { AlgorandClient } from '@algorandfoundation/algokit-utils'
import type { AppClient } from '@algorandfoundation/algokit-utils/app-client'
import crypto from 'node:crypto'
import { describe, expect } from 'vitest'
import { bigIntToUint8Array, uint8ArrayToBigInt, uint8ArrayToHex, utf8ToUint8Array } from '../../../src/util'
import { createArc4TestFixture } from '../util/test-fixture'

// Curve group orders; AVM ecdsa_verify requires canonical low-S signatures.
const SECP256K1_N = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n
const SECP256R1_N = 0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551n

// Legacy Keccak-256 of the empty input (pre-NIST padding), distinct from SHA3-256.
// node's crypto cannot compute Keccak-256, so we assert against this known vector.
const KECCAK256_EMPTY = 'c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'

// ECVRF-ED25519-SHA512-Elligator2 test vector from draft-irtf-cfrg-vrf-03
// (appendix A.4, example 10: alpha is the empty string).
const VRF_PUBLIC_KEY = Buffer.from('d75a980182b10ab7d54bfed3c964073a0ee172f3daa62325af021a68f707511a', 'hex')
const VRF_PROOF = Buffer.from(
  'b6b4699f87d56126c9117a7da55bd0085246f4c56dbc95d20172612e9d38e8d7' +
    'ca65e573a126ed88d4e30a46f80a666854d675cf3ba81de0de043c3774f06156' +
    '0f55edc256a787afe701677c0f602900',
  'hex',
)
const VRF_OUTPUT =
  '5b49b554d05c0cd5a5325376b3387de59d924fd1e13ded44648ab33c21349a60' + '3f25b84ec5ed887995b33da5e3bfcb87cd2f64521c4c62cf825cffabbe5d31cc'

// Crypto opcodes are budget-hungry (vrf_verify alone costs ~5700, well over the
// 700 opcode-budget units a single app call provides). Pool budget by padding
// the group with cheap "op-up" app calls; each extra app call in the group adds
// 700 to the shared budget. A group is capped at 16 transactions, so we keep
// opUps + 1 <= 16. The op-ups target a trivial app (control_flow's isEven) so
// they contribute their full 700 without burning it on their own work.
async function callPooled(
  appClient: AppClient,
  opUpClient: AppClient,
  algorand: AlgorandClient,
  method: string,
  args: NonNullable<Parameters<AppClient['params']['call']>[0]['args']>,
  opUps = 12,
): Promise<unknown> {
  const group = algorand.newGroup()
  for (let i = 0; i < opUps; i++) {
    // Unique note so repeated padding calls don't collide as duplicate transactions.
    group.addAppCallMethodCall(await opUpClient.params.call({ method: 'isEven', args: [4n], note: `opup-${method}-${i}` }))
  }
  group.addAppCallMethodCall(await appClient.params.call({ method, args }))
  const result = await group.send()
  return result.returns?.at(-1)?.returnValue
}

// The raw 32-byte ed25519 public key is the tail of the DER (SPKI) encoding.
function ed25519RawPublicKey(publicKey: crypto.KeyObject): Uint8Array {
  return new Uint8Array(publicKey.export({ type: 'spki', format: 'der' }).subarray(-32))
}

// Sign a message with an EC key and return the raw (R, S) components in
// canonical low-S form, as the AVM ecdsa_verify op requires. node hashes the
// message with SHA-256 internally, so the signature is over sha256(message) —
// which is exactly the digest handed to the contract.
function ecSignLowS(privateKey: crypto.KeyObject, message: Uint8Array, curveOrder: bigint): { r: Uint8Array; s: Uint8Array } {
  const raw = crypto.sign('sha256', Buffer.from(message), { key: privateKey, dsaEncoding: 'ieee-p1363' })
  const r = new Uint8Array(raw.subarray(0, 32))
  let s = uint8ArrayToBigInt(new Uint8Array(raw.subarray(32, 64)))
  if (s > curveOrder / 2n) s = curveOrder - s
  return { r, s: bigIntToUint8Array(s, 32) }
}

// The (X, Y) public-key components as 32-byte arrays, read from the JWK export.
function ecPublicXY(publicKey: crypto.KeyObject): { x: Uint8Array; y: Uint8Array } {
  const jwk = publicKey.export({ format: 'jwk' })
  return {
    x: new Uint8Array(Buffer.from(jwk.x as string, 'base64url')),
    y: new Uint8Array(Buffer.from(jwk.y as string, 'base64url')),
  }
}

// Behaviour tests for examples/devportal/crypto_ops.
describe('devportal crypto_ops example', () => {
  const test = createArc4TestFixture({
    // control_flow's IfElseExample is deployed alongside purely as a cheap op-up
    // app: its `isEven` method costs almost nothing, so op-up calls to it pool
    // budget without eating into it (unlike a crypto method would).
    paths: ['examples/devportal/crypto_ops/contract.algo.ts', 'examples/devportal/control_flow/contract.algo.ts'],
    contracts: { CryptoOps: {}, IfElseExample: {} },
  })

  // -- hashes ---------------------------------------------------------------

  const hashInputs: Array<[string, Uint8Array]> = [
    ['empty', new Uint8Array(0)],
    ['hello world', utf8ToUint8Array('hello world')],
    ['\\x00\\xff * 32', Uint8Array.from({ length: 64 }, (_v, i) => (i % 2 === 0 ? 0x00 : 0xff))],
  ]

  for (const [label, data] of hashInputs) {
    test(`hashes match the reference sha256/sha3_256/sha512_256 for input ${label}`, async ({ appClientCryptoOps }) => {
      const result = await appClientCryptoOps.send.call({ method: 'hashes', args: [data] })
      const [sha256, sha3_256, sha512_256, keccak256] = result.return as readonly Uint8Array[]

      // Each AVM hash op produces a 32-byte digest.
      expect(sha256.length).toBe(32)
      expect(sha3_256.length).toBe(32)
      expect(sha512_256.length).toBe(32)
      expect(keccak256.length).toBe(32)

      // node's crypto implements sha256, sha3-256 and sha512-256 identically to the AVM ops.
      expect(uint8ArrayToHex(sha256).toLowerCase()).toBe(crypto.createHash('sha256').update(data).digest('hex'))
      expect(uint8ArrayToHex(sha3_256).toLowerCase()).toBe(crypto.createHash('sha3-256').update(data).digest('hex'))
      expect(uint8ArrayToHex(sha512_256).toLowerCase()).toBe(crypto.createHash('sha512-256').update(data).digest('hex'))

      // keccak256 (legacy padding) differs from sha3_256 (NIST padding).
      expect(uint8ArrayToHex(keccak256)).not.toBe(uint8ArrayToHex(sha3_256))
    })
  }

  test('keccak256 matches the legacy Keccak-256 reference vector', async ({ appClientCryptoOps }) => {
    // Keccak-256 of the empty input is a well-known constant (the Ethereum empty hash).
    const result = await appClientCryptoOps.send.call({ method: 'hashes', args: [new Uint8Array(0)] })
    const keccak256 = (result.return as readonly Uint8Array[])[3]
    expect(uint8ArrayToHex(keccak256).toLowerCase()).toBe(KECCAK256_EMPTY)
  })

  test('hashes are deterministic', async ({ appClientCryptoOps }) => {
    const data = utf8ToUint8Array('determinism check')
    const first = (await appClientCryptoOps.send.call({ method: 'hashes', args: [data] })).return as readonly Uint8Array[]
    const second = (await appClientCryptoOps.send.call({ method: 'hashes', args: [data] })).return as readonly Uint8Array[]
    expect(first.map((h) => uint8ArrayToHex(h))).toStrictEqual(second.map((h) => uint8ArrayToHex(h)))
  })

  // -- ed25519 --------------------------------------------------------------

  test('ed25519 bare variant verifies a signature over the raw data', async ({ appClientCryptoOps, appClientIfElseExample, algorand }) => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519')
    const data = utf8ToUint8Array('signed message')
    const signature = new Uint8Array(crypto.sign(null, Buffer.from(data), privateKey))
    const rawPubkey = ed25519RawPublicKey(publicKey)

    const [bound, bare] = (await callPooled(appClientCryptoOps, appClientIfElseExample, algorand, 'ed25519', [
      data,
      signature,
      rawPubkey,
    ])) as [boolean, boolean]
    // ed25519verify_bare checks the raw data and must succeed.
    expect(bare).toBe(true)
    // ed25519verify (bound) signs over "ProgData"||program_hash||data, which the
    // bare signature does not satisfy, so it is false.
    expect(bound).toBe(false)
  })

  test('ed25519 bound variant verifies a program-bound signature', async ({ appClientCryptoOps, appClientIfElseExample, algorand }) => {
    // ed25519verify binds the signature to the executing program: the signed
    // message is "ProgData" || program_hash || data, where the program hash is
    // sha512_256("Program" || approval_program).
    const app = await algorand.app.getById(appClientCryptoOps.appId)
    const programHash = crypto
      .createHash('sha512-256')
      .update(Buffer.concat([Buffer.from('Program'), Buffer.from(app.approvalProgram)]))
      .digest()

    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519')
    const data = utf8ToUint8Array('program bound message')
    const signature = new Uint8Array(
      crypto.sign(null, Buffer.concat([Buffer.from('ProgData'), programHash, Buffer.from(data)]), privateKey),
    )
    const rawPubkey = ed25519RawPublicKey(publicKey)

    const [bound, bare] = (await callPooled(appClientCryptoOps, appClientIfElseExample, algorand, 'ed25519', [
      data,
      signature,
      rawPubkey,
    ])) as [boolean, boolean]
    expect(bound).toBe(true)
    // the bare variant sees only `data`, not the domain-separated message.
    expect(bare).toBe(false)
  })

  test('ed25519 rejects a signature over tampered data', async ({ appClientCryptoOps, appClientIfElseExample, algorand }) => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519')
    const signature = new Uint8Array(crypto.sign(null, Buffer.from('original'), privateKey))
    const rawPubkey = ed25519RawPublicKey(publicKey)

    const result = (await callPooled(appClientCryptoOps, appClientIfElseExample, algorand, 'ed25519', [
      utf8ToUint8Array('tampered'),
      signature,
      rawPubkey,
    ])) as [boolean, boolean]
    expect(result).toStrictEqual([false, false])
  })

  test('ed25519 rejects a signature against the wrong public key', async ({ appClientCryptoOps, appClientIfElseExample, algorand }) => {
    const { privateKey } = crypto.generateKeyPairSync('ed25519')
    const data = utf8ToUint8Array('signed message')
    const signature = new Uint8Array(crypto.sign(null, Buffer.from(data), privateKey))
    const wrongPubkey = ed25519RawPublicKey(crypto.generateKeyPairSync('ed25519').publicKey)

    const result = (await callPooled(appClientCryptoOps, appClientIfElseExample, algorand, 'ed25519', [data, signature, wrongPubkey])) as [
      boolean,
      boolean,
    ]
    expect(result).toStrictEqual([false, false])
  })

  // -- ecdsa ----------------------------------------------------------------

  test('ecdsa verifies a valid Secp256k1 signature (k1 only)', async ({ appClientCryptoOps, appClientIfElseExample, algorand }) => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', { namedCurve: 'secp256k1' })
    const message = utf8ToUint8Array('ecdsa secp256k1 message')
    const digest = new Uint8Array(crypto.createHash('sha256').update(message).digest())
    const { r, s } = ecSignLowS(privateKey, message, SECP256K1_N)
    const { x, y } = ecPublicXY(publicKey)

    const [k1, r1] = (await callPooled(appClientCryptoOps, appClientIfElseExample, algorand, 'ecdsa', [digest, r, s, x, y])) as [
      boolean,
      boolean,
    ]
    // signature was produced on Secp256k1, so only the k1 result is true.
    expect(k1).toBe(true)
    expect(r1).toBe(false)
  })

  test('ecdsa verifies a valid Secp256r1 signature (r1 only)', async ({ appClientCryptoOps, appClientIfElseExample, algorand }) => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', { namedCurve: 'prime256v1' })
    const message = utf8ToUint8Array('ecdsa secp256r1 message')
    const digest = new Uint8Array(crypto.createHash('sha256').update(message).digest())
    const { r, s } = ecSignLowS(privateKey, message, SECP256R1_N)
    const { x, y } = ecPublicXY(publicKey)

    const [k1, r1] = (await callPooled(appClientCryptoOps, appClientIfElseExample, algorand, 'ecdsa', [digest, r, s, x, y])) as [
      boolean,
      boolean,
    ]
    // signature was produced on Secp256r1, so only the r1 result is true.
    expect(k1).toBe(false)
    expect(r1).toBe(true)
  })

  test('ecdsa rejects a Secp256k1 signature against tampered data', async ({ appClientCryptoOps, appClientIfElseExample, algorand }) => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', { namedCurve: 'secp256k1' })
    const message = utf8ToUint8Array('original ecdsa message')
    const { r, s } = ecSignLowS(privateKey, message, SECP256K1_N)
    const { x, y } = ecPublicXY(publicKey)
    const wrongDigest = new Uint8Array(crypto.createHash('sha256').update('different ecdsa message').digest())

    const result = (await callPooled(appClientCryptoOps, appClientIfElseExample, algorand, 'ecdsa', [wrongDigest, r, s, x, y])) as [
      boolean,
      boolean,
    ]
    expect(result).toStrictEqual([false, false])
  })

  test('ecdsaDecompress expands a compressed Secp256k1 public key', async ({ appClientCryptoOps }) => {
    // Generate a real secp256k1 keypair so we know the expected uncompressed X/Y.
    const ecdh = crypto.createECDH('secp256k1')
    ecdh.generateKeys()
    const compressed = new Uint8Array(ecdh.getPublicKey(null, 'compressed')) // 33 bytes
    const uncompressed = ecdh.getPublicKey(null, 'uncompressed') // 0x04 || X(32) || Y(32)
    expect(compressed.length).toBe(33)

    const result = await appClientCryptoOps.send.call({ method: 'ecdsaDecompress', args: [compressed] })
    const [x, y] = result.return as readonly Uint8Array[]
    // decompressing the compressed key yields the original (X, Y) components.
    expect(uint8ArrayToHex(x)).toBe(uint8ArrayToHex(new Uint8Array(uncompressed.subarray(1, 33))))
    expect(uint8ArrayToHex(y)).toBe(uint8ArrayToHex(new Uint8Array(uncompressed.subarray(33, 65))))
  })

  test('ecdsaRecover recovers the signer public key from a signature', async ({ appClientCryptoOps, appClientIfElseExample, algorand }) => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', { namedCurve: 'secp256k1' })
    const message = utf8ToUint8Array('ecdsa recover message')
    const digest = new Uint8Array(crypto.createHash('sha256').update(message).digest())
    const { r, s } = ecSignLowS(privateKey, message, SECP256K1_N)
    const { x: expectedX, y: expectedY } = ecPublicXY(publicKey)

    // The recovery id is not knowable from (r, s) alone; one of the two candidate
    // ids must recover the signer's public key.
    const recovered: string[] = []
    for (const recoveryId of [0n, 1n]) {
      const [x, y] = (await callPooled(appClientCryptoOps, appClientIfElseExample, algorand, 'ecdsaRecover', [
        digest,
        recoveryId,
        r,
        s,
      ])) as [Uint8Array, Uint8Array]
      recovered.push(`${uint8ArrayToHex(x)}:${uint8ArrayToHex(y)}`)
    }
    expect(recovered).toContain(`${uint8ArrayToHex(expectedX)}:${uint8ArrayToHex(expectedY)}`)
  })

  // -- vrf ------------------------------------------------------------------

  test('vrf verifies a known ECVRF-ED25519-SHA512-Elligator2 test vector', async ({
    appClientCryptoOps,
    appClientIfElseExample,
    algorand,
  }) => {
    const [output, verified] = (await callPooled(
      appClientCryptoOps,
      appClientIfElseExample,
      algorand,
      'vrf',
      [new Uint8Array(0), VRF_PROOF, VRF_PUBLIC_KEY],
      15,
    )) as [Uint8Array, boolean]
    expect(verified).toBe(true)
    expect(uint8ArrayToHex(output).toLowerCase()).toBe(VRF_OUTPUT)
  })

  test('vrf rejects an invalid proof', async ({ appClientCryptoOps, appClientIfElseExample, algorand }) => {
    // An all-zero proof / public key cannot verify against a random message.
    const [output, verified] = (await callPooled(
      appClientCryptoOps,
      appClientIfElseExample,
      algorand,
      'vrf',
      [utf8ToUint8Array('vrf message'), new Uint8Array(80), new Uint8Array(32)],
      15,
    )) as [Uint8Array, boolean]
    expect(verified).toBe(false)
    // output is only meaningful when verified is true, but is always 64 bytes.
    expect(output.length).toBe(64)
  })
})
