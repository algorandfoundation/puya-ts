import { describe } from 'vitest'
import { createBaseTestFixture } from './util/test-fixture'

describe('Shadowed variables', () => {
  const test = createBaseTestFixture({ path: 'tests/approvals/shadowed-variables.algo.ts', contracts: ['ShadowedVariablesAlgo'] })

  test('Should create and run', async ({ ShadowedVariablesAlgoInvoker }) => {
    await ShadowedVariablesAlgoInvoker.send()
  })
})
