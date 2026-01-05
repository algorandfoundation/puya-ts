import { describe } from 'vitest'
import { uint8ArrayToHex, utf8ToUint8Array } from '../../src/util'
import { createArc4TestFixture } from './util/test-fixture'

describe('arc 28 events', () => {
  const test = createArc4TestFixture({ paths: 'tests/approvals/arc-28-events.algo.ts', contracts: { EventEmitter: {} } })

  test('It works with struct types', async ({ appClientEventEmitter, expect }) => {
    const result = await appClientEventEmitter.send.call({ method: 'emitSwapped', args: [0, 255] })

    expect(result.confirmation.logs?.length).toBe(8)

    const [first, second, third, fourth, fifth, sixth, seventh, eighth] = result.confirmation.logs!.map(uint8ArrayToHex)

    // sha_512_256("Swapped(uint8,uint8)").slice(0, 4)
    const eventPrefixHex = '0B6325ED'
    // sha_512_256("SwappedArc4(uint8,uint8)").slice(0,4)
    const arc4EventPrefixHex = '441E2CD8'

    const swappedUint8 = 'FF00'
    expect(first).toEqual(`${eventPrefixHex}${swappedUint8}`)
    expect(second).toEqual(`${eventPrefixHex}${swappedUint8}`)
    expect(third).toEqual(`${arc4EventPrefixHex}${swappedUint8}`)
    expect(fourth).toEqual(`${eventPrefixHex}${swappedUint8}`)
    expect(fifth).toEqual(`${eventPrefixHex}${swappedUint8}`)

    // sha_512_256("Swapped((uint8,uint8),uint8)").slice(0, 4) => 388cc12d
    expect(sixth).toEqual(`388CC12DFFFF00`)
    expect(seventh).toEqual(`388CC12DFFFF00`)

    // sha_512_256("Swapped(uint8[],uint8)").slice(0, 4) => 08754e0c
    expect(eighth).toEqual('08754E0C0003000002FFFF')
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
