import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('byte expressions', () => {
  const test = createArc4TestFixture('tests/approvals/byte-expressions.algo.ts', { DemoContract: {} })

  test('runs', async ({ appClientDemoContract }) => {
    await appClientDemoContract.send.call({ method: 'test' })
  })
})
