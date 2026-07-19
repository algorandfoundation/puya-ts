import { describe, expect } from 'vitest'
import { uint8ArrayToHex } from '../../src/util'
import { createArc4TestFixture } from './util/test-fixture'

describe('comma operator', () => {
  const test = createArc4TestFixture({ paths: 'tests/approvals/comma-operator.algo.ts', contracts: { CommaOperatorTest: {} } })
  test('runs', async ({ appClientCommaOperatorTest }) => {
    const res = await appClientCommaOperatorTest.send.call({ method: 'emitEmitAdd', args: [0x11, 0x22] })
    expect(res.return).toBe(0x33)

    const aHex = '11'
    const bHex = '22'
    const resHex = '33'

    // sha_512_256("Event(uint8,uint8)").slice(0, 4)
    const eventPrefixHex = 'D8DF8271'
    // sha_512_256("return").slice(0, 4)
    const methodPrefixHex = '151F7C75'
    const logs = (res.confirmation.logs ?? []).map(uint8ArrayToHex)
    expect(logs.length).toBe(3)
    expect(logs[0]).toBe(`${eventPrefixHex}${aHex}${aHex}`)
    expect(logs[1]).toBe(`${eventPrefixHex}${bHex}${resHex}`)
    expect(logs[2]).toBe(`${methodPrefixHex}${resHex}`)
  })
})
