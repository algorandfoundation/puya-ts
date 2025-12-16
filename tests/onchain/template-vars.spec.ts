import { Address } from '@algorandfoundation/algokit-utils'
import { describe, expect } from 'vitest'
import { hexToUint8Array } from '../../src/util'
import { createArc4TestFixture } from './util/test-fixture'

describe('template var', () => {
  const address = Address.fromString('A7NMWS3NT3IUDMLVO26ULGXGIIOUQ3ND2TXSER6EBGRZNOBOUIQXHIBGDE')

  const templateVars = {
    AN_INT: 356n,
    A_STRING: 'Hello world',
    SOME_BYTES: hexToUint8Array('FF0044'),
    AN_ADDRESS: address.publicKey,
  }
  const test = createArc4TestFixture({
    paths: 'tests/approvals/template-var.algo.ts',
    contracts: {
      MyContract: {
        deployParams: {
          deployTimeParams: templateVars,
        },
      },
    },
  })
  test('it runs', async ({ appClientMyContract, testAccount }) => {
    testAccount.addr
    const resultInt = await appClientMyContract.send.call({ method: 'getInt' })
    expect(resultInt.return).toBe(templateVars.AN_INT)
    const resultString = await appClientMyContract.send.call({ method: 'getString' })
    expect(resultString.return).toBe(templateVars.A_STRING)
    const resultBytes = await appClientMyContract.send.call({ method: 'getBytes' })
    expect(resultBytes.return).toStrictEqual(templateVars.SOME_BYTES)
    const resultAddress = await appClientMyContract.send.call({ method: 'getAddress' })
    expect(resultAddress.return).toStrictEqual(address)
  })
})
