import { describe } from 'vitest'
import { createBaseTestFixture } from './util/test-fixture'

describe('biguint expressions', () => {
  const test = createBaseTestFixture('tests/approvals/biguint-expressions.algo.ts', ['DemoContract'])

  test('should run', async ({ DemoContractInvoker }) => {
    await DemoContractInvoker.send()
  })
})
