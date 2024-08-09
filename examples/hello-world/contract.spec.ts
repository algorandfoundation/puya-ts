import { Bytes } from '@algorandfoundation/algo-ts'
import { describe, expect, it } from 'vitest'
import type { AlgorandTestContext } from '../../vitest.setup'
import HelloWorldContract from './contract.algo'

describe('When calling the HelloWorldContract', () => {
  describe("with ['world']", () => {
    it('logs Hello, World', async ({ ctx }: AlgorandTestContext) => {
      const contract = ctx.contract.create(HelloWorldContract)
      ctx.txn.addTxnGroup([
        ctx.any.txn.applicationCall({
          app_id: ctx.ledger.getApplicationForContract(contract),
          args: [Bytes('World')],
        }),
      ])

      const result = contract.approvalProgram()
      expect(ctx.exportLogs('s')).toStrictEqual(['Hello, World'])
      expect(result).toBe(true)
    })
  })
})
