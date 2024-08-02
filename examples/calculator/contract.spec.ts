import { internal, op, Uint64 } from '@algorandfoundation/algo-ts'
import { describe, expect, it } from 'vitest'
import { AlgorandTestContext } from '../../vitest.setup'
import MyContract from './contract.algo'

describe('Calculator', () => {
  describe('when calling with with no args', () => {
    it('errors', async ({ ctx }: AlgorandTestContext) => {
      ctx.setTransactionGroup([
        ctx.anyApplicationCallTransaction({
          args: [],
        }),
      ])
      const contract = new MyContract()

      expect(() => contract.approvalProgram()).toThrowError(new internal.errors.AvmError('Unknown operation'))
    })
  })
  describe('when calling with with three args', () => {
    it('Returns 1', async ({ ctx }: AlgorandTestContext) => {
      ctx.setTransactionGroup([
        ctx.anyApplicationCallTransaction({
          args: [op.itob(Uint64(1)), op.itob(Uint64(2)), op.itob(Uint64(3))],
        }),
      ])
      const contract = new MyContract()
      const result = contract.approvalProgram()
      const [left, right, outcome] = ctx.exportLogs('i', 'i', 's')

      expect(left).toBe(2n)
      expect(right).toBe(3n)
      expect(outcome).toBe('2 + 3 = 5')
      expect(result).toBe(true)
    })
  })
})
