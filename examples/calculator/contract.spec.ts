import { internal, op, Uint64 } from '@algorandfoundation/algo-ts'
import { describe, expect, it } from 'vitest'
import type { AlgorandTestContext } from '../../vitest.setup'
import MyContract from './contract.algo'

describe('Calculator', () => {
  describe('when calling with with no args', () => {
    it('errors', async ({ ctx }: AlgorandTestContext) => {
      const contract = ctx.contract.create(MyContract)
      ctx.txn.executeInScope([
        ctx.any.txn.applicationCall({
          app_id: ctx.ledger.getApplicationForContract(contract),
          args: [],
        }),
      ])(() => {
        expect(() => contract.approvalProgram()).toThrowError(new internal.errors.AvmError('Unknown operation'))
      })
    })
  })
  describe('when calling with with three args', () => {
    it('Returns 1', async ({ ctx }: AlgorandTestContext) => {
      const contract = ctx.contract.create(MyContract)
      const application = ctx.ledger.getApplicationForContract(contract)
      const result = ctx.txn.executeInScope([
        ctx.any.txn.applicationCall({
          app_id: application,
          args: [op.itob(Uint64(1)), op.itob(Uint64(2)), op.itob(Uint64(3))],
        }),
      ])(contract.approvalProgram)

      const [left, right, outcome] = ctx.exportLogs(application.id, 'i', 'i', 's')

      expect(left).toBe(2n)
      expect(right).toBe(3n)
      expect(outcome).toBe('2 + 3 = 5')
      expect(result).toBe(true)
    })
  })
})
