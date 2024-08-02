import { Bytes } from '@algorandfoundation/algo-ts'
import { describe, expect, it } from 'vitest'
import { AlgorandTestContext } from '../../vitest.setup'
import HelloWorldContract from './contract.algo'

describe('When calling the HelloWorldContract', () => {
  describe("with ['world']", () => {
    it('logs Hello, World', async ({ ctx }: AlgorandTestContext) => {
      ctx.gtxn = [
        ctx.anyApplicationCallTransaction({
          args: [Bytes('World')],
        }),
      ]
      const contract = new HelloWorldContract()
      const result = contract.approvalProgram()
      expect(ctx.exportLogs('s')).toStrictEqual(['Hello, World'])
      expect(result).toBe(true)
    })
  })
})
