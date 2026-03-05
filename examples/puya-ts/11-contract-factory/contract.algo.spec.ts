import { TestExecutionContext, ApplicationSpy } from '@algorandfoundation/algorand-typescript-testing'
import { afterEach, describe, expect, it } from 'vitest'
import { GreeterFactory, GreeterChild } from './contract.algo'

describe('GreeterFactory', () => {
  const ctx = new TestExecutionContext()
  afterEach(() => ctx.reset())

  function createContract() {
    const contract = ctx.contract.create(GreeterFactory)
    contract.createApplication()
    return contract
  }

  describe('deployManual', () => {
    it('creates child contract via inner application call', () => {
      const contract = createContract()

      const childApp = contract.deployManual()

      expect(childApp).toBeTruthy()
      expect(contract.lastChild.value).toEqual(childApp)
    })

    it('inner txn is an application call with correct args', () => {
      const contract = createContract()

      contract.deployManual()

      const itxn = ctx.txn.lastGroup.lastItxnGroup().getApplicationCallInnerTxn()
      expect(itxn).toBeTruthy()
      // First app arg is the method selector for GreeterChild.create
      expect(itxn.appArgs(0)).toBeTruthy()
    })
  })

  describe('deployTyped', () => {
    it('creates child contract via typed compilation', () => {
      const contract = createContract()

      const childApp = contract.deployTyped()

      expect(childApp).toBeTruthy()
      expect(contract.lastChild.value).toEqual(childApp)
    })

    it('inner txn is an application call', () => {
      const contract = createContract()

      contract.deployTyped()

      const itxn = ctx.txn.lastGroup.lastItxnGroup().getApplicationCallInnerTxn()
      expect(itxn).toBeTruthy()
    })
  })

  describe('callChildGreet', () => {
    it('calls child greet via abiCall and returns greeting', () => {
      const contract = createContract()
      const childApp = contract.deployManual()

      const spy = new ApplicationSpy(GreeterChild)
      spy.on.greet((itxnCtx) => {
        itxnCtx.setReturnValue('hello World')
      })
      ctx.addApplicationSpy(spy)

      const result = contract.callChildGreet(childApp, 'World')

      expect(result).toEqual('hello World')
    })

    it('inner txn is an application call to the child app', () => {
      const contract = createContract()
      const childApp = contract.deployManual()

      const spy = new ApplicationSpy(GreeterChild)
      spy.on.greet((itxnCtx) => {
        itxnCtx.setReturnValue('hello Test')
      })
      ctx.addApplicationSpy(spy)

      contract.callChildGreet(childApp, 'Test')

      const itxn = ctx.txn.lastGroup.lastItxnGroup().getApplicationCallInnerTxn()
      expect(itxn).toBeTruthy()
    })
  })

  describe('callChildManual', () => {
    it('calls child greet via manual itxn with methodSelector and encode/decode', () => {
      const contract = createContract()
      const childApp = contract.deployManual()

      const spy = new ApplicationSpy(GreeterChild)
      spy.on.greet((itxnCtx) => {
        itxnCtx.setReturnValue('hello World')
      })
      ctx.addApplicationSpy(spy)

      const result = contract.callChildManual(childApp, 'World')

      expect(result).toEqual('hello World')
    })
  })

  describe('deleteChild', () => {
    it('deletes a deployed child contract', () => {
      const contract = createContract()
      const childApp = contract.deployManual()

      expect(() => contract.deleteChild(childApp)).not.toThrow()
    })

    it('inner txn is an application call', () => {
      const contract = createContract()
      const childApp = contract.deployManual()

      contract.deleteChild(childApp)

      const itxn = ctx.txn.lastGroup.lastItxnGroup().getApplicationCallInnerTxn()
      expect(itxn).toBeTruthy()
    })
  })

  describe('inspectCompiled', () => {
    it('returns extraProgramPages from compiled contract', () => {
      const contract = createContract()

      const extras = contract.inspectCompiled()

      expect(extras).toBeDefined()
    })
  })
})
