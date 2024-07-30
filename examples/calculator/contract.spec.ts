import { op, Uint64 } from '@algorandfoundation/algo-ts'
import { AvmError } from '@algorandfoundation/algo-ts-testing'
import { beforeEach, describe, expect, it } from 'vitest'
import type { AlgorandTestContext } from '../../vitest.setup'
import type MyContract from './contract.algo'

interface ContractTestContext extends AlgorandTestContext {
  contract: MyContract
}

beforeEach<ContractTestContext>(async (context) => {
  context.contract = new (await import('./contract.algo')).default()
})

describe('Calculator', () => {
  describe('when calling with with no args', () => {
    it<ContractTestContext>('errors', async ({ ctx, contract }) => {
      ctx.gtxn = [
        ctx.anyApplicationCallTransaction({
          args: [],
        }),
      ]

      expect(() => contract.approvalProgram()).toThrowError(new AvmError('Unknown operation'))
    })
  })
  describe('when calling with with three args', () => {
    it<ContractTestContext>('Returns 1', async ({ ctx, contract }) => {
      ctx.gtxn = [
        ctx.anyApplicationCallTransaction({
          args: [op.itob(Uint64(1)), op.itob(Uint64(2)), op.itob(Uint64(3))],
        }),
      ]
      const result = contract.approvalProgram()
      const [left, right, outcome] = ctx.exportLogs('i', 'i', 's')

      expect(left).toBe(2n)
      expect(right).toBe(3n)
      expect(outcome).toBe('2 + 3 = 5')
      expect(result).toBe(true)
    })
  })
})
