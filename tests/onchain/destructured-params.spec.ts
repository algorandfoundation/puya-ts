import { describe, expect } from 'vitest'
import { bigIntToUint8Array, hexToUint8Array, joinUint8Arrays, utf8ToUint8Array } from '../../src/util'
import { createArc4TestFixture } from './util/test-fixture'

describe('destructed params', () => {
  const test = createArc4TestFixture('tests/approvals/destructured-params.algo.ts', {
    DestructuredParamsAlgo: {},
  })
  test('Works from abi', async ({ appClientDestructuredParamsAlgo }) => {
    const result = await appClientDestructuredParamsAlgo.send.call({ method: 'test', args: [{ a: 1, b: hexToUint8Array('FF'), c: true }] })

    const [log] = result.confirmation.logs ?? []

    const a = bigIntToUint8Array(1n, 8)
    const b = hexToUint8Array('FF')
    const c = bigIntToUint8Array(1n, 8)
    expect(log).toStrictEqual(joinUint8Arrays(a, b, c))
  })
  test('Works with encoded types', async ({ appClientDestructuredParamsAlgo }) => {
    const result = await appClientDestructuredParamsAlgo.send.call({
      method: 'testMutable',
      args: [{ a: 1, b: hexToUint8Array('FF'), c: true }],
    })

    const [log] = result.confirmation.logs ?? []

    const a = bigIntToUint8Array(1n, 8)
    const b = hexToUint8Array('0001FF')
    const c = bigIntToUint8Array(128n, 1)
    expect(log).toStrictEqual(joinUint8Arrays(a, b, c))
  })

  test('Works internally', async ({ appClientDestructuredParamsAlgo }) => {
    const result = await appClientDestructuredParamsAlgo.send.call({ method: 'init', args: [] })

    const [log1, log2] = result.confirmation.logs ?? []

    expect(log1).toStrictEqual(joinUint8Arrays(bigIntToUint8Array(456n, 8), bigIntToUint8Array(0n, 8)))
    expect(log2).toStrictEqual(joinUint8Arrays(bigIntToUint8Array(2n, 8), utf8ToUint8Array('Hello'), bigIntToUint8Array(1n, 8)))
  })
})
