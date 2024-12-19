import { describe } from 'vitest'
import { createBaseTestFixture } from './util/test-fixture'

describe('boolean conversions match', () => {
  const test = createBaseTestFixture('tests/approvals/boolean-conversions.algo.ts', ['BooleanConversionsAlgo'])

  test('it can be called', async ({ BooleanConversionsAlgoInvoker }) => {
    await BooleanConversionsAlgoInvoker.send()
  })
})
