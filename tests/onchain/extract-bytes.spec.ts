import { describe } from 'vitest'
import { createBaseTestFixture } from './util/test-fixture'

describe('Extract bytes contract', () => {
  const test = createBaseTestFixture('tests/approvals/extract-bytes.algo.ts', ['ExtractBytesAlgo'])

  test('runs', async ({ ExtractBytesAlgoInvoker }) => {
    await ExtractBytesAlgoInvoker.send()
  })
})
