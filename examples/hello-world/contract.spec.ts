import { Bytes } from '@algorandfoundation/algo-ts'
import { TestExecutionContext } from '@algorandfoundation/algo-ts-testing'
import { afterEach, describe, expect, it } from 'vitest'
import HelloWorldContract from './contract.algo'

describe('When calling the HelloWorldContract', () => {
  const ctx = new TestExecutionContext()
  afterEach(() => {
    ctx.reset()
  })
  describe("with ['world']", () => {
    it('logs Hello, World', async () => {
      const contract = ctx.contract.create(HelloWorldContract)
      const application = ctx.ledger.getApplicationForContract(contract)
      const result = ctx.txn
        .createScope([
          ctx.any.txn.applicationCall({
            appId: application,
            appArgs: [Bytes('World')],
          }),
        ])
        .execute(contract.approvalProgram)

      expect(ctx.exportLogs(application.id, 's')).toStrictEqual(['Hello, World'])
      expect(result).toBe(true)
    })
  })
})
