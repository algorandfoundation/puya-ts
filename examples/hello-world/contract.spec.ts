import { beforeEach, describe, expect, it } from 'vitest'
import { AlgorandTestContext } from '../../vitest.setup'
import HelloWorldContract from './contract.algo'

interface ContractTestContext extends AlgorandTestContext {
  contract: HelloWorldContract
}

beforeEach<ContractTestContext>(async (context) => {
  context.contract = new (await import('./contract.algo')).default()
})

describe('When calling the HelloWorldContract', () => {
  describe("with ['world']", () => {
    it<ContractTestContext>('logs Hello, World', async ({ ctx, contract }) => {
      ctx.gtxn = [
        {
          sender: '',
          type: 'appl',
          args: ['World'],
        },
      ]
      const result = contract.approvalProgram()
      expect(ctx.exportLogs('s')).toStrictEqual(['Hello, World'])
      expect(result).toBe(true)
    })
  })
})
