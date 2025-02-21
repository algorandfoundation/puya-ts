import { describe, expect } from 'vitest'
import { hexToUint8Array } from '../../src/util'
import { createArc4TestFixture } from './util/test-fixture'

describe('template var', () => {
  const test = createArc4TestFixture('tests/approvals/template-var.algo.ts', {
    MyContract: {
      deployParams: {
        deployTimeParams: {
          AN_INT: 356n,
          A_STRING: 'Hello world',
          SOME_BYTES: hexToUint8Array('FF0044'),
        },
      },
    },
  })
  test('it runs', async ({ appClientMyContract }) => {
    const resultInt = await appClientMyContract.send.call({ method: 'getInt' })
    expect(resultInt.return).toBe(356n)
    const resultString = await appClientMyContract.send.call({ method: 'getString' })
    expect(resultString.return).toBe('Hello world')
    const resultBytes = await appClientMyContract.send.call({ method: 'getBytes' })
    expect(resultBytes.return).toStrictEqual(Array.from(hexToUint8Array('FF0044')))
  })
})
