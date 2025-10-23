import { algo } from '@algorandfoundation/algokit-utils'
import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('box-enum-contract', () => {
  const test = createArc4TestFixture({ path: 'tests/approvals/box-enum-contract.algo.ts', contracts: { BoxContract: {} } })

  test('can store and load enums', async ({ appClientBoxContract, expect }) => {
    await appClientBoxContract.fundAppAccount({ amount: algo(1) })

    await appClientBoxContract.send.call({ method: 'store_enums', boxReferences: ['oca', 'txn'] })

    const result = await appClientBoxContract.send.call({ method: 'read_enums', boxReferences: ['oca', 'txn'] })

    expect(result.return).toStrictEqual([1n, 6n])
  })
})
