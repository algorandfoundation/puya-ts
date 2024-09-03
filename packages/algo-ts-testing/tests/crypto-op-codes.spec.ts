import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount';
import { AppSpec } from '@algorandfoundation/algokit-utils/types/app-spec';
import nacl from 'tweetnacl';
import { afterEach, describe, expect, it, test } from 'vitest';
import { TestExecutionContext } from '../src';
import { MAX_BYTES_SIZE } from '../src/constants';
import * as op from '../src/impl/crypto';
import appSpecJson from './artifacts/crypto-ops/data/CryptoOpsContract.arc32.json';
import { getAlgorandAppClient, getAvmResult, getAvmResultRaw } from './avm-invoker';
import { asUint8Array, getPaddedUint8Array } from './util';

const MAX_ARG_LEN = 2048

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
})
