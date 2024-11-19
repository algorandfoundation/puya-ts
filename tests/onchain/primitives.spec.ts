import { describe } from 'vitest'
import { createBaseTestFixture } from './util/test-fixture'

describe('uint64', () => {
  const test = createBaseTestFixture('tests/approvals/uint64-expressions.algo.ts', ['DemoContract'])
  test('can be created', async ({ DemoContractInvoker }) => {
    await DemoContractInvoker.send()
  })
})
