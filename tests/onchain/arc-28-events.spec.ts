import { describe } from 'vitest'
import { uint8ArrayToHex, utf8ToUint8Array } from '../../src/util'
import { createArc4TestFixture } from './util/test-fixture'

describe('arc 28 events', () => {
  const test = createArc4TestFixture({ paths: 'tests/approvals/arc-28-events.algo.ts', contracts: { EventEmitter: {} } })

  test('It works with struct types', async ({ appClientEventEmitter, expect }) => {
    const result = await appClientEventEmitter.send.call({ method: 'emitSwapped', args: [0, 255] })

    expect(result.confirmation.logs?.length).toBe(13)

    const [first, second, third, fourth, fifth, sixth, seventh, eighth, ninth, tenth, eleventh, twelfth, thirteenth] =
      result.confirmation.logs!.map(uint8ArrayToHex)

    // sha_512_256("Swapped(uint8,uint8)").slice(0, 4)
    const eventPrefixHex = '0B6325ED'
    // sha_512_256("SwappedArc4(uint8,uint8)").slice(0,4)
    const arc4EventPrefixHex = '441E2CD8'

    const swappedUint8 = 'FF00'
    expect(first).toEqual(`${eventPrefixHex}${swappedUint8}`)
    expect(second).toEqual(`${eventPrefixHex}${swappedUint8}`)
    expect(third).toEqual(`${arc4EventPrefixHex}${swappedUint8}`)
    expect(fourth).toEqual(`0E72193A${swappedUint8}`)
    expect(fifth).toEqual(`CA59EDB2${swappedUint8}`)

    // sha_512_256("Swapped6((uint8,uint8),uint8)").slice(0, 4) => d4a6bd33
    expect(sixth).toEqual(`D4A6BD33FFFF00`)
    expect(seventh).toEqual(`D4A6BD33FFFF00`)

    // sha_512_256("Swapped7(uint8[],uint8)").slice(0, 4) => 25b5f91a
    expect(eighth).toEqual('25B5F91A0003000002FFFF')

    // sha_512_256("Swapped8(((uint8,uint8)),uint8)").slice(0, 4) => 331f84f2
    expect(ninth).toEqual('331F84F2FFFF00')

    // sha_512_256("Swapped9(uint8[][],uint8)").slice(0, 4) => dcc0f6fb
    expect(tenth).toEqual('DCC0F6FB000300000100020002FFFF')

    // sha_512_256("Swapped10((uint8,uint8)[],uint8)").slice(0, 4) => 9bb72837
    expect(eleventh).toEqual('9BB728370003000001FFFF')

    // sha_512_256("Swapped11((uint8[]),uint8)").slice(0, 4) => f3b666de
    expect(twelfth).toEqual('F3B666DE00030000020002FFFF')

    // sha_512_256("Swapped12(uint64[],uint64)").slice(0, 4) => 5bf09e07
    expect(thirteenth).toEqual('5BF09E07000A0000000000000000000200000000000000FF00000000000000FF')
  })

  test('It works with dynamic bytes', async ({ appClientEventEmitter, expect }) => {
    const result = await appClientEventEmitter.send.call({
      method: 'emitDynamicBytes',
      args: [utf8ToUint8Array('abc'), utf8ToUint8Array('def')],
    })

    expect(result.confirmation.logs?.length).toBe(1)

    const [first] = result.confirmation.logs!.map(uint8ArrayToHex)

    const prefix = '4524E1DD'
    const abc = '616263'
    const def = '646566'
    expect(first).toEqual(`${prefix}000400090003${abc}0003${def}`)
  })
})
