import { Bytes } from '@algorandfoundation/algorand-typescript'
import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import crypto from 'node:crypto'
import { afterEach, describe, expect, it } from 'vitest'
import { CryptoVault } from './contract.algo'

const ctx = new TestExecutionContext()

describe('CryptoVault', () => {
  afterEach(() => ctx.reset())

  describe('createApplication', () => {
    it('stores SHA-256 hash of commitment', () => {
      const contract = ctx.contract.create(CryptoVault)
      const secret = Bytes('my-secret')
      contract.createApplication(secret)
      // secretHash should be set (non-empty)
      expect(contract.secretHash.value.length).toEqual(32)
    })
  })

  describe('hashShowcase', () => {
    it('returns 128 bytes (4 x 32-byte hashes concatenated)', () => {
      const contract = ctx.contract.create(CryptoVault)
      const data = Bytes('hello')
      const result = contract.hashShowcase(data)
      expect(result.length).toEqual(128)
    })

    it('returns consistent results for same input', () => {
      const contract = ctx.contract.create(CryptoVault)
      const data = Bytes('test-data')
      const result1 = contract.hashShowcase(data)
      const result2 = contract.hashShowcase(data)
      expect(result1).toEqual(result2)
    })

    it('returns different results for different inputs', () => {
      const contract = ctx.contract.create(CryptoVault)
      const result1 = contract.hashShowcase(Bytes('aaa'))
      const result2 = contract.hashShowcase(Bytes('bbb'))
      expect(result1).not.toEqual(result2)
    })

    it('SHA-256 portion matches Node.js SHA-256', () => {
      const contract = ctx.contract.create(CryptoVault)
      const input = 'hello'
      const result = contract.hashShowcase(Bytes(input))
      // First 32 bytes = SHA-256
      const sha256Portion = result.slice(0, 32)
      const expected = crypto.createHash('sha256').update(input).digest()
      expect(sha256Portion).toEqual(Bytes.fromHex(expected.toString('hex')))
    })
  })

  describe('verifyAndUnlock', () => {
    it('succeeds with valid Ed25519 signature', () => {
      const contract = ctx.contract.create(CryptoVault)
      const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519')

      const rawPubKey = publicKey.export({ type: 'spki', format: 'der' }).subarray(-32)
      const data = Buffer.from('unlock-vault')
      const signature = crypto.sign(null, data, privateKey)

      const result = contract.verifyAndUnlock(Bytes(data), Bytes(signature), Bytes(rawPubKey))
      expect(result).toBe(true)
    })

    it('fails with invalid signature', () => {
      const contract = ctx.contract.create(CryptoVault)
      const { publicKey } = crypto.generateKeyPairSync('ed25519')
      const rawPubKey = publicKey.export({ type: 'spki', format: 'der' }).subarray(-32)

      const data = Bytes('some-data')
      const badSig = Bytes.fromHex('00'.repeat(64))

      expect(() => contract.verifyAndUnlock(data, badSig, Bytes(rawPubKey))).toThrow('Invalid Ed25519 signature')
    })

    it('fails when signature is for different data', () => {
      const contract = ctx.contract.create(CryptoVault)
      const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519')
      const rawPubKey = publicKey.export({ type: 'spki', format: 'der' }).subarray(-32)

      const originalData = Buffer.from('original')
      const signature = crypto.sign(null, originalData, privateKey)

      expect(() => contract.verifyAndUnlock(Bytes('tampered'), Bytes(signature), Bytes(rawPubKey))).toThrow('Invalid Ed25519 signature')
    })
  })

  describe('scratchCounter', () => {
    it('returns doubled value', () => {
      const contract = ctx.contract.create(CryptoVault)
      expect(contract.scratchCounter(5)).toEqual(10n)
    })

    it('handles zero', () => {
      const contract = ctx.contract.create(CryptoVault)
      expect(contract.scratchCounter(0)).toEqual(0n)
    })

    it('handles large values', () => {
      const contract = ctx.contract.create(CryptoVault)
      expect(contract.scratchCounter(2 ** 32)).toEqual(2n ** 32n * 2n)
    })
  })

  describe('checkPreimage', () => {
    it('returns true for correct preimage', () => {
      const contract = ctx.contract.create(CryptoVault)
      const secret = Bytes('my-secret')
      contract.createApplication(secret)
      expect(contract.checkPreimage(secret)).toBe(true)
    })

    it('returns false for wrong preimage', () => {
      const contract = ctx.contract.create(CryptoVault)
      contract.createApplication(Bytes('correct-secret'))
      expect(contract.checkPreimage(Bytes('wrong-secret'))).toBe(false)
    })
  })
})
