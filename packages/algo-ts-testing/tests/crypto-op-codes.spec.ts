import { Bytes, internal, uint64 } from '@algorandfoundation/algo-ts';
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount';
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec';
import { ec } from 'elliptic';
import { keccak256 as js_keccak256 } from 'js-sha3';
import nacl from 'tweetnacl';
import { afterEach, describe, expect, it, test, vi } from 'vitest';
import { TestExecutionContext } from '../src';
import { MAX_BYTES_SIZE } from '../src/constants';
import * as op from '../src/impl/crypto';
import appSpecJson from './artifacts/crypto-ops/data/CryptoOpsContract.arc32.json';
import { getAlgorandAppClient, getAvmResult, getAvmResultRaw } from './avm-invoker';
import { asUint8Array, getPaddedUint8Array } from './util';

const MAX_ARG_LEN = 2048
const curveMap = {
  [internal.opTypes.Ecdsa.Secp256k1]: 'secp256k1',
  [internal.opTypes.Ecdsa.Secp256r1]: 'p256',
}

vi.mock('../src/impl/crypto', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../src/impl/crypto')>()
  return {
    ...mod,
    mockedVrfVerify: vi.fn()
  }
})
describe('crypto op codes', async () => {
  const appClient = await getAlgorandAppClient(appSpecJson as AppSpec)
  const ctx = new TestExecutionContext()

  afterEach(async () => {
    ctx.reset()
  })

  describe('sha256', async () => {
    test.each([
      ["", 0],
      ["0".repeat(MAX_ARG_LEN - 14), 0],
      ["abc", 0],
      ["abc", MAX_BYTES_SIZE - 3],
    ])('should return the correct sha256 hash', async (a, padSize) => {
      const avmResult = (await getAvmResultRaw({ appClient }, 'verify_sha256', asUint8Array(a), padSize))!
      const paddedA = getPaddedUint8Array(padSize, a)
      const result = op.sha256(paddedA)
      expect(asUint8Array(result)).toEqual(avmResult)
    })
  })

  describe('sha3_256', async () => {
    test.each([
      ["", 0],
      ["0".repeat(MAX_ARG_LEN - 14), 0],
      ["abc", 0],
      ["abc", MAX_BYTES_SIZE - 3],
    ])('should return the correct sha3_256 hash', async (a, padSize) => {
      const avmResult = (await getAvmResultRaw({ appClient }, 'verify_sha3_256', asUint8Array(a), padSize))!
      const paddedA = getPaddedUint8Array(padSize, a)
      const result = op.sha3_256(paddedA)
      expect(asUint8Array(result)).toEqual(avmResult)
    })
  })

  describe('keccak256', async () => {
    test.each([
      ["", 0],
      ["0".repeat(MAX_ARG_LEN - 14), 0],
      ["abc", 0],
      ["abc", MAX_BYTES_SIZE - 3],
    ])('should return the correct keccak256 hash', async (a, padSize) => {
      const avmResult = (await getAvmResultRaw({ appClient }, 'verify_keccak_256', asUint8Array(a), padSize))!
      const paddedA = getPaddedUint8Array(padSize, a)
      const result = op.keccak256(paddedA)
      expect(asUint8Array(result)).toEqual(avmResult)
      expect(result.length.valueOf()).toBe(32n)
    })
  })

  describe('sha512_256', async () => {
    test.each([
      ["", 0],
      ["0".repeat(MAX_ARG_LEN - 14), 0],
      ["abc", 0],
      ["abc", MAX_BYTES_SIZE - 3],
    ])('should return the correct sha512_256 hash', async (a, padSize) => {
      const avmResult = (await getAvmResultRaw({ appClient }, 'verify_sha512_256', asUint8Array(a), padSize))!
      const paddedA = getPaddedUint8Array(padSize, a)
      const result = op.sha512_256(paddedA)
      expect(asUint8Array(result)).toEqual(avmResult)
      expect(result.length.valueOf()).toBe(32n)
    })
  })

  describe('ed25519verifyBare', async () => {
    it('should return true for valid signature', async () => {
      const keyPair = nacl.sign.keyPair()
      const message = "Test message for ed25519 verification"
      const signature = nacl.sign.detached(asUint8Array(message), keyPair.secretKey)

      const avmResult = await getAvmResult<boolean>({ appClient, sendParams: { fee: AlgoAmount.Algos(2000) } }, 'verify_ed25519verify_bare', asUint8Array(message), signature, keyPair.publicKey)
      const result = op.ed25519verifyBare(message, signature, keyPair.publicKey)
      expect(result).toEqual(avmResult)
    })
  })

  describe('ecdsaVerify', async () => {
    it('should be able to verify k1 signature', async () => {
      const messageHash = Bytes.fromHex(
        "f809fd0aa0bb0f20b354c6b2f86ea751957a4e262a546bd716f34f69b9516ae1"
      )
      const sigR = Bytes.fromHex("f7f913754e5c933f3825d3aef22e8bf75cfe35a18bede13e15a6e4adcfe816d2")
      const sigS = Bytes.fromHex("0b5599159aa859d79677f33280848ae4c09c2061e8b5881af8507f8112966754")
      const pubkeyX = Bytes.fromHex("a710244d62747aa8db022ddd70617240adaf881b439e5f69993800e614214076")
      const pubkeyY = Bytes.fromHex("48d0d337704fe2c675909d2c93f7995e199156f302f63c74a8b96827b28d777b")

      const avmResult = await getAvmResult<boolean>({ appClient, sendParams: { fee: AlgoAmount.Algos(5000) } }, 'verify_ecdsa_verify_k1', asUint8Array(messageHash), asUint8Array(sigR), asUint8Array(sigS), asUint8Array(pubkeyX), asUint8Array(pubkeyY))
      const result = op.ecdsaVerify(internal.opTypes.Ecdsa.Secp256k1, messageHash, sigR, sigS, pubkeyX, pubkeyY)

      expect(result).toEqual(avmResult)
    })
    it('should be able to verify r1 signature', async () => {
      const messageHash = Bytes.fromHex(
        "f809fd0aa0bb0f20b354c6b2f86ea751957a4e262a546bd716f34f69b9516ae1"
      )
      const sigR = Bytes.fromHex("18d96c7cda4bc14d06277534681ded8a94828eb731d8b842e0da8105408c83cf")
      const sigS = Bytes.fromHex("7d33c61acf39cbb7a1d51c7126f1718116179adebd31618c4604a1f03b5c274a")
      const pubkeyX = Bytes.fromHex("f8140e3b2b92f7cbdc8196bc6baa9ce86cf15c18e8ad0145d50824e6fa890264")
      const pubkeyY = Bytes.fromHex("bd437b75d6f1db67155a95a0da4b41f2b6b3dc5d42f7db56238449e404a6c0a3")

      const avmResult = await getAvmResult<boolean>({ appClient, sendParams: { fee: AlgoAmount.Algos(5000) } }, 'verify_ecdsa_verify_r1', asUint8Array(messageHash), asUint8Array(sigR), asUint8Array(sigS), asUint8Array(pubkeyX), asUint8Array(pubkeyY))
      const result = op.ecdsaVerify(internal.opTypes.Ecdsa.Secp256r1, messageHash, sigR, sigS, pubkeyX, pubkeyY)

      expect(result).toEqual(avmResult)
    })
  })

  describe('ecdsaPkRecover', async () => {
    it('should be able to recover k1 public key', async () => {
      const testData = generateEcdsaTestData(internal.opTypes.Ecdsa.Secp256k1)
      const a = testData.data
      const b = testData.recoveryId
      const c = testData.r
      const d = testData.s
      const avmResult = await getAvmResult<uint64[][]>({ appClient, sendParams: { fee: AlgoAmount.Algos(5000) } }, 'verify_ecdsa_recover_k1', asUint8Array(a), b.asNumber(), asUint8Array(c), asUint8Array(d))
      const result = op.ecdsaPkRecover(internal.opTypes.Ecdsa.Secp256k1, a, b, c, d)

      expect(asUint8Array(result[0])).toEqual(new Uint8Array(avmResult[0]))
      expect(asUint8Array(result[1])).toEqual(new Uint8Array(avmResult[1]))
    })

    it('should throw unsupported error when trying to recover r1 public key', async () => {
      const testData = generateEcdsaTestData(internal.opTypes.Ecdsa.Secp256r1)
      const a = testData.data
      const b = testData.recoveryId
      const c = testData.r
      const d = testData.s
      await expect(getAvmResult<uint64[][]>({ appClient, sendParams: { fee: AlgoAmount.Algos(5000) } }, 'verify_ecdsa_recover_r1', asUint8Array(a), b.asNumber(), asUint8Array(c), asUint8Array(d))).rejects.toThrow('unsupported curve')

      expect(() => op.ecdsaPkRecover(internal.opTypes.Ecdsa.Secp256r1, a, b, c, d)).toThrow('Unsupported ECDSA curve')
    })

  })

  describe('ecdsaPkDecompress', async () => {
    it('should be able to decompress k1 public key', async () => {
      const v = internal.opTypes.Ecdsa.Secp256k1
      const testData = generateEcdsaTestData(v)
      const ecdsa = new ec(curveMap[v])
      const keyPair = ecdsa.keyFromPublic(testData.pubkeyX.concat(testData.pubkeyY).asUint8Array())
      const pubKeyArray = new Uint8Array(keyPair.getPublic(true, 'array'))
      const avmResult = await getAvmResult<uint64[][]>({ appClient, sendParams: { fee: AlgoAmount.Algos(3000) } }, 'verify_ecdsa_decompress_k1', pubKeyArray)
      const result = op.ecdsaPkDecompress(v, pubKeyArray)

      expect(asUint8Array(result[0])).toEqual(new Uint8Array(avmResult[0]))
      expect(asUint8Array(result[1])).toEqual(new Uint8Array(avmResult[1]))
    })
  })

  describe('vrfVerify', async () => {
    const a = internal.primitives.BytesCls.fromHex("528b9e23d93d0e020a119d7ba213f6beb1c1f3495a217166ecd20f5a70e7c2d7")
    const b = internal.primitives.BytesCls.fromHex("372a3afb42f55449c94aaa5f274f26543e77e8d8af4babee1a6fbc1c0391aa9e6e0b8d8d7f4ed045d5b517fea8ad3566025ae90d2f29f632e38384b4c4f5b9eb741c6e446b0f540c1b3761d814438b04")
    const c = internal.primitives.BytesCls.fromHex("3a2740da7a0788ebb12a52154acbcca1813c128ca0b249e93f8eb6563fee418d")

    it('should throw not impelemented error', async () => {
      expect(() => op.vrfVerify(internal.opTypes.VrfVerify.VrfAlgorand, a, b, c)).toThrow('vrfVerify is not available in test context')
    })

    it('should return mocked result', async () => {
      const avmResult = await getAvmResult<[Uint8Array,boolean]>({ appClient, sendParams: { fee: AlgoAmount.Algos(6000) } }, 'verify_vrf_verify', asUint8Array(a), asUint8Array(b), asUint8Array(c))
      const mockedVrfVerify = (op as any).mockedVrfVerify
      mockedVrfVerify.mockReturnValue([internal.primitives.BytesCls.fromCompat(new Uint8Array(avmResult[0])), avmResult[1]])
      const result = mockedVrfVerify(a, b, c)

      expect(asUint8Array(result[0])).toEqual(new Uint8Array(avmResult[0]))
      expect(result[1]).toEqual(avmResult[1])

    })
  })
})

const generateEcdsaTestData = (v: internal.opTypes.Ecdsa) => {
  const ecdsa = new ec(curveMap[v])
  const keyPair = ecdsa.genKeyPair()
  const pk = keyPair.getPublic("array")
  const data = internal.primitives.BytesCls.fromCompat("test data for ecdsa")
  const messageHash = js_keccak256.create().update(data.asUint8Array()).digest()
  const signature = keyPair.sign(messageHash)
  const recoveryId = 0  // Recovery ID is typically 0 or 1

  return {
    "data": internal.primitives.BytesCls.fromCompat(new Uint8Array(messageHash)),
    "r": internal.primitives.BytesCls.fromCompat(new Uint8Array(signature.r.toArray('be'))),
    "s": internal.primitives.BytesCls.fromCompat(new Uint8Array(signature.s.toArray('be'))),
    "recoveryId": internal.primitives.Uint64Cls.fromCompat(recoveryId),
    "pubkeyX": internal.primitives.BytesCls.fromCompat(new Uint8Array(pk.slice(0, 32))),
    "pubkeyY": internal.primitives.BytesCls.fromCompat(new Uint8Array(pk.slice(32))),
  }
}


