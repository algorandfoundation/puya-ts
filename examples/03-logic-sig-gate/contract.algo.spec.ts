import { Account, Bytes } from '@algorandfoundation/algorand-typescript'
import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { generateKeyPairSync, sign } from 'node:crypto'
import { afterEach, describe, expect, it } from 'vitest'
import { LogicSigGate } from './contract.algo'

// Ed25519 keypair for testing
const keyPair = generateKeyPairSync('ed25519')
const pubKeyDer = keyPair.publicKey.export({ type: 'spki', format: 'der' })
const authorityKey = Bytes.fromHex(Buffer.from(pubKeyDer.subarray(pubKeyDer.length - 32)).toString('hex'))

const MAX_FEE = 10_000n
const ZERO_ADDRESS = Account(Bytes.fromHex('00'.repeat(32)))

function signMessage(message: string) {
  const sig = sign(null, Buffer.from(message, 'utf-8'), keyPair.privateKey)
  return Bytes.fromHex(Buffer.from(sig).toString('hex'))
}

describe('LogicSigGate', () => {
  const ctx = new TestExecutionContext()
  afterEach(() => ctx.reset())

  it('approves valid payment with correct signature', () => {
    ctx.setTemplateVar('AUTHORITY_KEY', authorityKey)
    ctx.setTemplateVar('MAX_FEE', MAX_FEE)

    const message = 'authorized-payment'
    const signature = signMessage(message)

    ctx.txn
      .createScope([
        ctx.any.txn.payment({
          fee: 1000,
          note: Bytes(message),
          rekeyTo: ZERO_ADDRESS,
          closeRemainderTo: ZERO_ADDRESS,
        }),
      ])
      .execute(() => {
        const result = ctx.executeLogicSig(new LogicSigGate(), signature)
        expect(result).toBe(true)
      })
  })

  it('rejects when fee exceeds maximum', () => {
    ctx.setTemplateVar('AUTHORITY_KEY', authorityKey)
    ctx.setTemplateVar('MAX_FEE', MAX_FEE)

    const message = 'payment'
    const signature = signMessage(message)

    ctx.txn
      .createScope([
        ctx.any.txn.payment({
          fee: 20_000,
          note: Bytes(message),
          rekeyTo: ZERO_ADDRESS,
          closeRemainderTo: ZERO_ADDRESS,
        }),
      ])
      .execute(() => {
        expect(() => ctx.executeLogicSig(new LogicSigGate(), signature)).toThrow('Fee exceeds maximum')
      })
  })

  it('rejects non-payment transaction type', () => {
    ctx.setTemplateVar('AUTHORITY_KEY', authorityKey)
    ctx.setTemplateVar('MAX_FEE', MAX_FEE)

    ctx.txn
      .createScope([
        ctx.any.txn.assetTransfer({
          fee: 1000,
        }),
      ])
      .execute(() => {
        expect(() => ctx.executeLogicSig(new LogicSigGate(), Bytes())).toThrow('Must be a payment transaction')
      })
  })

  it('rejects invalid signature', () => {
    ctx.setTemplateVar('AUTHORITY_KEY', authorityKey)
    ctx.setTemplateVar('MAX_FEE', MAX_FEE)

    const badSignature = Bytes.fromHex('00'.repeat(64))

    ctx.txn
      .createScope([
        ctx.any.txn.payment({
          fee: 1000,
          note: Bytes('some-message'),
          rekeyTo: ZERO_ADDRESS,
          closeRemainderTo: ZERO_ADDRESS,
        }),
      ])
      .execute(() => {
        expect(() => ctx.executeLogicSig(new LogicSigGate(), badSignature)).toThrow('Invalid signature')
      })
  })

  it('rejects rekey attempt', () => {
    ctx.setTemplateVar('AUTHORITY_KEY', authorityKey)
    ctx.setTemplateVar('MAX_FEE', MAX_FEE)

    const message = 'payment'
    const signature = signMessage(message)
    const otherAccount = ctx.any.account()

    ctx.txn
      .createScope([
        ctx.any.txn.payment({
          fee: 1000,
          note: Bytes(message),
          rekeyTo: otherAccount,
          closeRemainderTo: ZERO_ADDRESS,
        }),
      ])
      .execute(() => {
        expect(() => ctx.executeLogicSig(new LogicSigGate(), signature)).toThrow('Rekey not allowed')
      })
  })

  it('rejects close-remainder attempt', () => {
    ctx.setTemplateVar('AUTHORITY_KEY', authorityKey)
    ctx.setTemplateVar('MAX_FEE', MAX_FEE)

    const message = 'payment'
    const signature = signMessage(message)
    const otherAccount = ctx.any.account()

    ctx.txn
      .createScope([
        ctx.any.txn.payment({
          fee: 1000,
          note: Bytes(message),
          rekeyTo: ZERO_ADDRESS,
          closeRemainderTo: otherAccount,
        }),
      ])
      .execute(() => {
        expect(() => ctx.executeLogicSig(new LogicSigGate(), signature)).toThrow('Close remainder not allowed')
      })
  })
})
