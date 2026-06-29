import crypto from 'node:crypto'
import { describe, expect } from 'vitest'
import { bigIntToUint8Array, uint8ArrayToHex } from '../../../src/util'
import { createArc4TestFixture } from '../util/test-fixture'

function concatBytes(...parts: Uint8Array[]): Uint8Array {
  const total = parts.reduce((n, p) => n + p.length, 0)
  const out = new Uint8Array(total)
  let offset = 0
  for (const part of parts) {
    out.set(part, offset)
    offset += part.length
  }
  return out
}

function encodeArg(type: string, value: unknown): Uint8Array {
  switch (type) {
    case 'address':
      return value as Uint8Array
    case 'uint64':
      return bigIntToUint8Array(BigInt(value as number | bigint), 8)
    case 'string': {
      const utf8 = new TextEncoder().encode(value as string)
      return concatBytes(bigIntToUint8Array(BigInt(utf8.length), 2), utf8)
    }
    default:
      throw new Error(`unhandled arg type: ${type}`)
  }
}

// Encodes a value tuple as an ARC-4 tuple: static values inline, dynamic values
// (strings) replaced in the head by a 2-byte offset into the tail section.
function arc4EncodeTuple(types: readonly string[], values: readonly unknown[]): Uint8Array {
  const encoded = types.map((type, i) => encodeArg(type, values[i]))
  const isDynamic = (type: string) => type === 'string'
  const headSize = types.reduce((n, type, i) => n + (isDynamic(type) ? 2 : encoded[i].length), 0)

  const head: Uint8Array[] = []
  const tail: Uint8Array[] = []
  let tailOffset = headSize
  types.forEach((type, i) => {
    if (isDynamic(type)) {
      head.push(bigIntToUint8Array(BigInt(tailOffset), 2))
      tail.push(encoded[i])
      tailOffset += encoded[i].length
    } else {
      head.push(encoded[i])
    }
  })
  return concatBytes(...head, ...tail)
}

// Expected ARC-28 log: 4-byte selector (SHA-512/256 of the event signature)
// followed by the ARC-4 tuple encoding of the values.
function eventLog(signature: string, ...values: unknown[]): Uint8Array {
  const selector = new Uint8Array(crypto.createHash('sha512-256').update(Buffer.from(signature, 'utf8')).digest()).subarray(0, 4)
  const argTypes = signature.slice(signature.indexOf('(') + 1, signature.lastIndexOf(')')).split(',')
  return concatBytes(selector, arc4EncodeTuple(argTypes, values))
}

// Behaviour tests for examples/devportal/events.
describe('devportal events example', () => {
  const test = createArc4TestFixture({
    paths: 'examples/devportal/events/contract.algo.ts',
    contracts: { MintContract: {}, SwapContract: {}, TransferContract: {} },
  })

  test('swap_emit_struct emits two ARC-28 events (typed struct + native struct)', async ({ appClientSwapContract, testAccount }) => {
    const address = testAccount.addr.toString()
    const pk = testAccount.addr.publicKey
    const result = await appClientSwapContract.send.call({
      method: 'swapEmitStruct',
      args: [address, address, 100n, 90n],
    })

    const logs = result.confirmation.logs ?? []
    // two emit calls -> two ARC-28 event logs
    expect(logs.map(uint8ArrayToHex)).toEqual([
      uint8ArrayToHex(eventLog('Swapped(address,address,uint64,uint64)', pk, pk, 100n, 90n)),
      // the native struct is emitted using the equivalent ARC-4 types
      uint8ArrayToHex(eventLog('NativeStruct(uint64,string)', 100n, 'payment received')),
    ])
  })

  test('transfer_emit_signature emits an ARC-28 event by signature', async ({ appClientTransferContract, testAccount }) => {
    const address = testAccount.addr.toString()
    const pk = testAccount.addr.publicKey
    const result = await appClientTransferContract.send.call({
      method: 'transferEmitSignature',
      args: [address, address, 50n],
    })

    const logs = result.confirmation.logs ?? []
    expect(logs.map(uint8ArrayToHex)).toEqual([uint8ArrayToHex(eventLog('Transfer(address,address,uint64)', pk, pk, 50n))])
  })

  test('mint_emit_by_name emits an ARC-28 event whose signature is inferred from arg types', async ({
    appClientMintContract,
    testAccount,
  }) => {
    const address = testAccount.addr.toString()
    const pk = testAccount.addr.publicKey
    const result = await appClientMintContract.send.call({
      method: 'mintEmitByName',
      args: [address, 25n],
    })

    const logs = result.confirmation.logs ?? []
    // the signature (and thus the selector) is inferred from the arg types
    expect(logs.map(uint8ArrayToHex)).toEqual([uint8ArrayToHex(eventLog('Mint(address,uint64)', pk, 25n))])
  })
})
