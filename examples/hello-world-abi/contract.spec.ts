import type { gtxn } from '@algorandfoundation/algo-ts'
import { describe, expect, it } from 'vitest'
import type { AlgorandTestContext } from '../../vitest.setup'
import HelloWorldContract from './contract.algo'

describe('HelloWorldContract', () => {
  it('logs the returned value when sayBananas is called', async ({ ctx }: AlgorandTestContext) => {
    const contract = ctx.contract.create(HelloWorldContract)
    const result = contract.sayBananas()

    const application = (ctx.txn.lastActive as gtxn.ApplicationTxn).appId

    expect(result).toBe('Bananas')
    expect(ctx.exportLogs(application.id, 's')).toStrictEqual([result])
  })
  it('logs the returned value when sayHello is called', async ({ ctx }: AlgorandTestContext) => {
    const contract = ctx.contract.create(HelloWorldContract)
    const result = contract.sayHello('John', 'Doe')

    const application = (ctx.txn.lastActive as gtxn.ApplicationTxn).appId

    expect(result).toBe('Hello John Doe')
    expect(ctx.exportLogs(application.id, 's')).toStrictEqual([result])
  })
})
