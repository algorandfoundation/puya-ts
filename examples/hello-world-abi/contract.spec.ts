import { TransactionType } from '@algorandfoundation/algo-ts'
import { TestExecutionContext } from '@algorandfoundation/algo-ts-testing'
import { afterEach, describe, expect, it } from 'vitest'
import { invariant } from '../../src/util'
import HelloWorldContract from './contract.algo'

describe('HelloWorldContract', () => {
  const ctx = new TestExecutionContext()
  afterEach(() => {
    ctx.reset()
  })
  it('logs the returned value when sayBananas is called', async () => {
    const contract = ctx.contract.create(HelloWorldContract)
    const result = contract.sayBananas()
    invariant(ctx.txn.lastActive.type === TransactionType.ApplicationCall, 'Last txn must be app')

    expect(result).toBe('Bananas')
    expect(ctx.exportLogs(ctx.txn.lastActive.appId.id, 's')).toStrictEqual([result])
  })
  it('logs the returned value when sayHello is called', async () => {
    const contract = ctx.contract.create(HelloWorldContract)
    const result = contract.sayHello('John', 'Doe')
    invariant(ctx.txn.lastActive.type === TransactionType.ApplicationCall, 'Last txn must be app')

    expect(result).toBe('Hello John Doe')
    expect(ctx.exportLogs(ctx.txn.lastActive.appId.id, 's')).toStrictEqual([result])
  })
})
