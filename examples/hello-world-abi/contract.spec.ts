import type { gtxn } from '@algorandfoundation/algo-ts'
import { afterEach, describe, expect, it } from 'vitest'
import HelloWorldContract from './contract.algo'
import { TestExecutionContext } from '@algorandfoundation/algo-ts-testing'

describe('HelloWorldContract', () => {
  const ctx = new TestExecutionContext()
  afterEach(() => {
    ctx.reset()
  })
  it('logs the returned value when sayBananas is called', async () => {
    const contract = ctx.contract.create(HelloWorldContract)
    const result = contract.sayBananas()

    const application = (ctx.txn.lastActive as gtxn.ApplicationTxn).appId

    expect(result).toBe('Bananas')
    expect(ctx.exportLogs(application.id, 's')).toStrictEqual([result])
  })
  it('logs the returned value when sayHello is called', async () => {
    const contract = ctx.contract.create(HelloWorldContract)
    const result = contract.sayHello('John', 'Doe')

    const application = (ctx.txn.lastActive as gtxn.ApplicationTxn).appId

    expect(result).toBe('Hello John Doe')
    expect(ctx.exportLogs(application.id, 's')).toStrictEqual([result])
  })
})
