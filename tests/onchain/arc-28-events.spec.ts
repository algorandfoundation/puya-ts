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

    assertLog(first, { eventPrefix: eventPrefixHex, data: swappedUint8 })
    assertLog(second, { eventPrefix: eventPrefixHex, data: swappedUint8 })
    assertLog(third, { eventPrefix: arc4EventPrefixHex, data: swappedUint8 })
    assertLog(fourth, { eventPrefix: '0E72193A', data: swappedUint8 })
    assertLog(fifth, { eventPrefix: 'CA59EDB2', data: swappedUint8 })

    // sha_512_256("Swapped6((uint8,uint8),uint8)").slice(0, 4) => d4a6bd33
    assertLog(sixth, { eventPrefix: 'D4A6BD33', data: 'FFFF00' })
    assertLog(seventh, { eventPrefix: 'D4A6BD33', data: 'FFFF00' })

    // sha_512_256("Swapped7(uint8[],uint8)").slice(0, 4) => 25b5f91a
    assertLog(eighth, { eventPrefix: '25B5F91A', data: '0003000002FFFF' })

    // sha_512_256("Swapped8(((uint8,uint8)),uint8)").slice(0, 4) => 331f84f2
    assertLog(ninth, { eventPrefix: '331F84F2', data: 'FFFF00' })

    // sha_512_256("Swapped9(uint8[][],uint8)").slice(0, 4) => dcc0f6fb
    assertLog(tenth, { eventPrefix: 'DCC0F6FB', data: '000300000100020002FFFF' })

    // sha_512_256("Swapped10((uint8,uint8)[],uint8)").slice(0, 4) => 9bb72837
    assertLog(eleventh, { eventPrefix: '9BB72837', data: '0003000001FFFF' })

    // sha_512_256("Swapped11((uint8[]),uint8)").slice(0, 4) => f3b666de
    assertLog(twelfth, { eventPrefix: 'F3B666DE', data: '00030000020002FFFF' })

    // sha_512_256("Swapped12(uint64[],uint64)").slice(0, 4) => 5bf09e07
    assertLog(thirteenth, { eventPrefix: '5BF09E07', data: '000A0000000000000000000200000000000000FF00000000000000FF' })

    function assertLog(log: string, obj: Record<string, string>) {
      return expect(log).toEqual(Object.values(obj).join(''))
    }
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
