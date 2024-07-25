import { TestHarness } from '@algorandfoundation/algo-ts-testing'
import { afterEach, beforeEach } from 'vitest'

export interface AlgorandTestContext {
  ctx: TestHarness
}

beforeEach<AlgorandTestContext>(async (context) => {
  context.ctx = new TestHarness()
})

afterEach<AlgorandTestContext>(async (context) => {
  context.ctx.reset()
})
