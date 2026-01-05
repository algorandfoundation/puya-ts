import { describe } from 'vitest'
import { createBaseTestFixture } from './util/test-fixture'

describe('Extract bytes contract', () => {
  const test = createBaseTestFixture({ paths: 'tests/approvals/extract-bytes.algo.ts', contracts: ['ExtractBytesAlgo'] })

  test('runs', async ({ ExtractBytesAlgoInvoker }) => {
    await ExtractBytesAlgoInvoker.send()
  })
})
