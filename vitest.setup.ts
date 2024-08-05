import { TestExecutionContext } from '@algorandfoundation/algo-ts-testing'
import { afterEach, beforeEach } from 'vitest'

export interface AlgorandTestContext {
  ctx: TestExecutionContext
}

beforeEach<AlgorandTestContext>(async (context) => {
  context.ctx = new TestExecutionContext()
})

afterEach<AlgorandTestContext>(async (context) => {
  context.ctx.reset()
})
