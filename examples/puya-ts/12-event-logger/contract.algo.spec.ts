import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { afterEach, describe, expect, it } from 'vitest'
import { EventLogger } from './contract.algo'

describe('EventLogger', () => {
  const ctx = new TestExecutionContext()
  afterEach(() => ctx.reset())

  function setup() {
    const contract = ctx.contract.create(EventLogger)
    contract.createApplication()
    const appId = ctx.ledger.getApplicationForContract(contract).id
    return { contract, appId }
  }

  describe('logTransfer', () => {
    it('emits a Transfer event and increments counter', () => {
      const { contract, appId } = setup()
      contract.logTransfer(1, 2, 100)

      const [log] = ctx.exportLogs(appId, 'b')
      expect(log).toBeTruthy()
      expect(contract.eventCount.value).toEqual(1n)
    })

    it('emits log with ARC-28 prefix (4 bytes) plus encoded data', () => {
      const { contract, appId } = setup()
      contract.logTransfer(1, 2, 100)

      const [log] = ctx.exportLogs(appId, 'b')
      // ARC-28 prefix is 4 bytes; remainder is ARC4-encoded event data
      expect(Number(log.length)).toBeGreaterThan(4)
    })
  })

  describe('logApproval', () => {
    it('emits an Approval event and increments counter', () => {
      const { contract, appId } = setup()
      contract.logApproval(10, 20, 500)

      const [log] = ctx.exportLogs(appId, 'b')
      expect(log).toBeTruthy()
      expect(Number(log.length)).toBeGreaterThan(4)
      expect(contract.eventCount.value).toEqual(1n)
    })
  })

  describe('logDeposit (positional args)', () => {
    it('emits a Deposit event with positional args', () => {
      const { contract, appId } = setup()
      contract.logDeposit(42, 1000)

      const [log] = ctx.exportLogs(appId, 'b')
      expect(log).toBeTruthy()
      expect(Number(log.length)).toBeGreaterThan(4)
      expect(contract.eventCount.value).toEqual(1n)
    })
  })

  describe('logWithdrawal (explicit signature)', () => {
    it('emits a Withdrawal event with explicit ARC-28 signature', () => {
      const { contract, appId } = setup()
      contract.logWithdrawal(7, 300)

      const [log] = ctx.exportLogs(appId, 'b')
      expect(log).toBeTruthy()
      expect(contract.eventCount.value).toEqual(1n)
    })
  })

  describe('logStatusChange (typed variable)', () => {
    it('emits a StatusChanged event via typed variable inference', () => {
      const { contract, appId } = setup()
      contract.logStatusChange('activated', 200)

      const [log] = ctx.exportLogs(appId, 'b')
      expect(log).toBeTruthy()
      expect(contract.eventCount.value).toEqual(1n)
    })
  })

  describe('logBatch (multiple events)', () => {
    it('emits two events and increments counter by 2', () => {
      const { contract, appId } = setup()
      contract.logBatch(1, 2, 50)

      const [transferLog, batchLog] = ctx.exportLogs(appId, 'b', 'b')
      expect(transferLog).toBeTruthy()
      expect(batchLog).toBeTruthy()
      expect(Number(transferLog.length)).toBeGreaterThan(4)
      expect(Number(batchLog.length)).toBeGreaterThan(4)
      expect(contract.eventCount.value).toEqual(2n)
    })
  })

  describe('event counter accumulation', () => {
    it('increments across multiple method calls', () => {
      const { contract } = setup()
      expect(contract.eventCount.value).toEqual(0n)

      contract.logTransfer(1, 2, 3)
      expect(contract.eventCount.value).toEqual(1n)

      contract.logApproval(4, 5, 6)
      expect(contract.eventCount.value).toEqual(2n)

      contract.logDeposit(7, 8)
      expect(contract.eventCount.value).toEqual(3n)

      contract.logStatusChange('done', 0)
      expect(contract.eventCount.value).toEqual(4n)

      contract.logBatch(1, 2, 3)
      expect(contract.eventCount.value).toEqual(6n)
    })
  })

  describe('event data correctness', () => {
    it('different inputs produce different event logs', () => {
      const { contract, appId } = setup()
      contract.logTransfer(1, 2, 100)
      const [log1] = ctx.exportLogs(appId, 'b')

      ctx.reset()
      const { contract: contract2, appId: appId2 } = setup()
      contract2.logTransfer(3, 4, 200)
      const [log2] = ctx.exportLogs(appId2, 'b')

      // Same prefix (same event type) but different data
      expect(log1.slice(0, 4)).toEqual(log2.slice(0, 4))
      expect(log1).not.toEqual(log2)
    })

    it('Transfer and Approval have different ARC-28 prefixes', () => {
      const { contract, appId } = setup()
      contract.logTransfer(1, 2, 100)
      const [transferLog] = ctx.exportLogs(appId, 'b')

      ctx.reset()
      const { contract: contract2, appId: appId2 } = setup()
      contract2.logApproval(1, 2, 100)
      const [approvalLog] = ctx.exportLogs(appId2, 'b')

      // Same field types but different event names → different prefixes
      expect(transferLog.slice(0, 4)).not.toEqual(approvalLog.slice(0, 4))
    })
  })
})
