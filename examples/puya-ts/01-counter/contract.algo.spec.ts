import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { afterEach, describe, expect, it } from 'vitest'
import { Counter } from './contract.algo'

describe('Counter', () => {
  const ctx = new TestExecutionContext()
  afterEach(() => ctx.reset())

  it('createApplication initializes counter to 0', () => {
    const contract = ctx.contract.create(Counter)
    contract.createApplication()
    expect(contract.counter.value).toEqual(0n)
  })

  it('increment returns correct value', () => {
    const contract = ctx.contract.create(Counter)
    contract.createApplication()
    expect(contract.increment(3)).toEqual(3n)
    expect(contract.counter.value).toEqual(3n)
    expect(contract.increment(2)).toEqual(5n)
    expect(contract.counter.value).toEqual(5n)
  })

  it('decrement returns correct value', () => {
    const contract = ctx.contract.create(Counter)
    contract.createApplication()
    contract.increment(10)
    expect(contract.decrement(3)).toEqual(7n)
    expect(contract.counter.value).toEqual(7n)
  })

  it('multiply returns correct value', () => {
    const contract = ctx.contract.create(Counter)
    contract.createApplication()
    contract.increment(5)
    expect(contract.multiply(3)).toEqual(15n)
    expect(contract.counter.value).toEqual(15n)
  })

  it('divide returns correct value', () => {
    const contract = ctx.contract.create(Counter)
    contract.createApplication()
    contract.increment(20)
    expect(contract.divide(4)).toEqual(5n)
    expect(contract.counter.value).toEqual(5n)
  })

  it('decrement below zero throws', () => {
    const contract = ctx.contract.create(Counter)
    contract.createApplication()
    expect(() => contract.decrement(1)).toThrow()
  })

  it('divide by zero throws', () => {
    const contract = ctx.contract.create(Counter)
    contract.createApplication()
    contract.increment(5)
    expect(() => contract.divide(0)).toThrow()
  })
})
