import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('prefix postfix operators', () => {
  const test = createArc4TestFixture({ path: 'tests/approvals/prefix-postfix-operators.algo.ts', contracts: ['DemoContract'] })

  test('it runs', async ({ appClientDemoContract }) => {
    await appClientDemoContract.send.call({ method: 'test' })
  })
})
