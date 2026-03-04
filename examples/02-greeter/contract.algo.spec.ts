import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { afterEach, describe, expect, it } from 'vitest'
import { Greeter } from './contract.algo'

describe('Greeter', () => {
  const ctx = new TestExecutionContext()
  afterEach(() => ctx.reset())

  it('greet returns Hello, {name}!', () => {
    const contract = ctx.contract.create(Greeter)
    contract.createApplication()
    expect(contract.greet('World')).toEqual('Hello, World!')
  })

  it('greetTwo returns Hello, {a} and {b}!', () => {
    const contract = ctx.contract.create(Greeter)
    contract.createApplication()
    expect(contract.greetTwo('Alice', 'Bob')).toEqual('Hello, Alice and Bob!')
  })

  it('greet with empty string', () => {
    const contract = ctx.contract.create(Greeter)
    contract.createApplication()
    expect(contract.greet('')).toEqual('Hello, !')
  })

  it('greetTwo with empty strings', () => {
    const contract = ctx.contract.create(Greeter)
    contract.createApplication()
    expect(contract.greetTwo('', '')).toEqual('Hello,  and !')
  })

  it('greet with special characters', () => {
    const contract = ctx.contract.create(Greeter)
    contract.createApplication()
    expect(contract.greet("O'Brien")).toEqual("Hello, O'Brien!")
    expect(contract.greet('foo@bar')).toEqual('Hello, foo@bar!')
    expect(contract.greet('a & b <>')).toEqual('Hello, a & b <>!')
  })

  it('greetTwo with special characters', () => {
    const contract = ctx.contract.create(Greeter)
    contract.createApplication()
    expect(contract.greetTwo('José', 'François')).toEqual('Hello, José and François!')
  })
})
