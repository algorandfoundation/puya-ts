import { describe } from 'vitest'
import { createBaseTestFixture } from './util/test-fixture'

describe('Property ordering', () => {
  const test = createBaseTestFixture({ path: 'tests/approvals/property-ordering.algo.ts', contracts: ['Demo'] })

  test('it runs ', async ({ DemoInvoker }) => {
    await DemoInvoker.send()
  })
})
