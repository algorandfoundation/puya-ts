import { Bytes } from '@algorandfoundation/algo-ts'
import { describe, expect, it } from 'vitest'
import type { AlgorandTestContext } from '../../vitest.setup'
import HelloWorldContract from './contract.algo'

describe('When calling the HelloWorldContract', () => {
  describe("with ['world']", () => {
    it('logs Hello, World', async ({ ctx }: AlgorandTestContext) => {
      const contract = ctx.contract.create(HelloWorldContract)
      const application = ctx.ledger.getApplicationForContract(contract)
      const result = ctx.txn
        .createExecutionScope([
          ctx.any.txn.applicationCall({
            appId: application,
            args: [Bytes('World')],
          }),
        ])
        .execute(contract.approvalProgram)

      expect(ctx.exportLogs(application.id, 's')).toStrictEqual(['Hello, World'])
      expect(result).toBe(true)
    })
  })
})
