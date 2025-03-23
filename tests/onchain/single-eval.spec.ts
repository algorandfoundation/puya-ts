import { describe } from 'vitest'
import { createArc4TestFixture } from './util/test-fixture'

describe('single-eval', () => {
  const test = createArc4TestFixture('tests/approvals/single-eval.algo.ts', { SingleEvalAlgo: {} })

  test('Works as expected', async ({ appClientSingleEvalAlgo }) => {
    await appClientSingleEvalAlgo.send.call({ method: 'test' })
  })
})
