import { describe } from 'vitest'
import { createBaseTestFixture } from './util/test-fixture'

describe('super calls', () => {
  const test = createBaseTestFixture({
    paths: 'tests/approvals/super-calls.algo.ts',
    contracts: ['SuperContract', 'SubContract', 'SubSubContract', 'SubSubSubContract'],
  })

  test('super contract runs', async ({ SuperContractInvoker }) => {
    await SuperContractInvoker.send({ schema: { globalInts: 1 } })
  })
  test('sub contract runs', async ({ SubContractInvoker }) => {
    await SubContractInvoker.send({ schema: { globalInts: 2 } })
  })
  test('sub sub contract runs', async ({ SubSubContractInvoker }) => {
    await SubSubContractInvoker.send({ schema: { globalInts: 2 } })
  })
  test('sub sub contract runs', async ({ SubSubSubContractInvoker }) => {
    await SubSubSubContractInvoker.send({ schema: { globalInts: 3 } })
  })
})
