import { describe } from 'vitest'
import { createBaseTestFixture } from './util/test-fixture'

describe('arc4-types', () => {
  const test = createBaseTestFixture('tests/approvals/arc4-types.algo.ts', ['Arc4TypesTestContract'])

  test('runs', async ({ Arc4TypesTestContractInvoker, expect, assetFactory, testAccount }) => {
    await Arc4TypesTestContractInvoker.send()
  })
})
