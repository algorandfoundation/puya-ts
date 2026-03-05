import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'
import { afterEach, describe, expect, it } from 'vitest'
import { MultiTxnDistributor } from './contract.algo'

describe('MultiTxnDistributor', () => {
  const ctx = new TestExecutionContext()
  afterEach(() => ctx.reset())

  function createContract() {
    const contract = ctx.contract.create(MultiTxnDistributor)
    contract.createApplication()
    return contract
  }

  describe('distributePair', () => {
    it('distributes equal shares to two recipients via inner txns', () => {
      const contract = createContract()
      const app = ctx.ledger.getApplicationForContract(contract)
      const recipientA = ctx.any.account()
      const recipientB = ctx.any.account()

      const fundingTxn = ctx.any.txn.payment({
        receiver: app.address,
        amount: 1000,
      })

      ctx.txn.createScope([fundingTxn, ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        contract.distributePair(fundingTxn, recipientA, recipientB)
      })

      // itxn.submitGroup creates separate ItxnGroups per txn
      const txnA = ctx.txn.lastGroup.getItxnGroup(0).getPaymentInnerTxn()
      const txnB = ctx.txn.lastGroup.getItxnGroup(1).getPaymentInnerTxn()
      expect(txnA.receiver).toEqual(recipientA)
      expect(txnA.amount).toEqual(500n)
      expect(txnB.receiver).toEqual(recipientB)
      expect(txnB.amount).toEqual(500n)
    })

    it('handles odd amount (integer division)', () => {
      const contract = createContract()
      const app = ctx.ledger.getApplicationForContract(contract)
      const recipientA = ctx.any.account()
      const recipientB = ctx.any.account()

      const fundingTxn = ctx.any.txn.payment({
        receiver: app.address,
        amount: 1001,
      })

      ctx.txn.createScope([fundingTxn, ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        contract.distributePair(fundingTxn, recipientA, recipientB)
      })

      const txnA = ctx.txn.lastGroup.getItxnGroup(0).getPaymentInnerTxn()
      const txnB = ctx.txn.lastGroup.getItxnGroup(1).getPaymentInnerTxn()
      // 1001 / 2 = 500 (integer division)
      expect(txnA.amount).toEqual(500n)
      expect(txnB.amount).toEqual(500n)
    })

    it('rejects when funds not sent to contract', () => {
      const contract = createContract()
      const recipientA = ctx.any.account()
      const recipientB = ctx.any.account()
      const wrongReceiver = ctx.any.account()

      const fundingTxn = ctx.any.txn.payment({
        receiver: wrongReceiver,
        amount: 1000,
      })

      ctx.txn.createScope([fundingTxn, ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        expect(() => contract.distributePair(fundingTxn, recipientA, recipientB)).toThrow('Funds must be sent to this contract')
      })
    })

    it('rejects zero-amount funding', () => {
      const contract = createContract()
      const app = ctx.ledger.getApplicationForContract(contract)
      const recipientA = ctx.any.account()
      const recipientB = ctx.any.account()

      const fundingTxn = ctx.any.txn.payment({
        receiver: app.address,
        amount: 0,
      })

      ctx.txn.createScope([fundingTxn, ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        expect(() => contract.distributePair(fundingTxn, recipientA, recipientB)).toThrow('Funds must be sent to this contract')
      })
    })
  })

  describe('distributeWithOptIn', () => {
    it('distributes payment and opts contract into asset', () => {
      const contract = createContract()
      const app = ctx.ledger.getApplicationForContract(contract)
      const recipientA = ctx.any.account()
      const recipientB = ctx.any.account()
      const asset = ctx.any.asset()

      const fundingTxn = ctx.any.txn.payment({
        receiver: app.address,
        amount: 2000,
      })

      ctx.txn.createScope([fundingTxn, ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        contract.distributeWithOptIn(fundingTxn, asset, recipientA, recipientB)
      })

      // itxn.submitGroup creates separate ItxnGroups: [0]=payment, [1]=assetTransfer
      const payResult = ctx.txn.lastGroup.getItxnGroup(0).getPaymentInnerTxn()
      const optInResult = ctx.txn.lastGroup.getItxnGroup(1).getAssetTransferInnerTxn()
      expect(payResult.receiver).toEqual(recipientA)
      expect(payResult.amount).toEqual(1000n)
      expect(optInResult.xferAsset).toEqual(asset)
      expect(optInResult.assetAmount).toEqual(0n)
      expect(optInResult.assetReceiver).toEqual(app.address)
    })

    it('rejects when funds not sent to contract', () => {
      const contract = createContract()
      const recipientA = ctx.any.account()
      const recipientB = ctx.any.account()
      const asset = ctx.any.asset()
      const wrongReceiver = ctx.any.account()

      const fundingTxn = ctx.any.txn.payment({
        receiver: wrongReceiver,
        amount: 2000,
      })

      ctx.txn.createScope([fundingTxn, ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        expect(() => contract.distributeWithOptIn(fundingTxn, asset, recipientA, recipientB)).toThrow(
          'Funding must be a payment to this contract',
        )
      })
    })

    it('rejects non-payment funding transaction type', () => {
      const contract = createContract()
      const app = ctx.ledger.getApplicationForContract(contract)
      const recipientA = ctx.any.account()
      const recipientB = ctx.any.account()
      const asset = ctx.any.asset()

      // Use an asset transfer instead of a payment
      const fundingTxn = ctx.any.txn.assetTransfer({
        assetReceiver: app.address,
        assetAmount: 2000,
      })

      ctx.txn.createScope([fundingTxn, ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expect(() => contract.distributeWithOptIn(fundingTxn as any, asset, recipientA, recipientB)).toThrow()
      })
    })
  })

  describe('distributeDynamic', () => {
    it('distributes to multiple recipients via itxnCompose', () => {
      const contract = createContract()
      const app = ctx.ledger.getApplicationForContract(contract)
      const acctA = ctx.any.account()
      const acctB = ctx.any.account()
      const acctC = ctx.any.account()

      const recipients = [new Address(acctA), new Address(acctB), new Address(acctC)]

      const fundingTxn = ctx.any.txn.payment({
        receiver: app.address,
        amount: 3000,
      })

      ctx.txn.createScope([fundingTxn, ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        contract.distributeDynamic(fundingTxn, recipients)
      })

      // itxnCompose creates a single ItxnGroup with all inner txns
      const itxnGroup = ctx.txn.lastGroup.lastItxnGroup()
      for (let i = 0; i < 3; i++) {
        const payTxn = itxnGroup.getPaymentInnerTxn(i)
        expect(payTxn.amount).toEqual(1000n)
        expect(payTxn.receiver).toEqual(recipients[i].native)
      }
    })

    it('rejects empty recipients list', () => {
      const contract = createContract()
      const app = ctx.ledger.getApplicationForContract(contract)

      const fundingTxn = ctx.any.txn.payment({
        receiver: app.address,
        amount: 1000,
      })

      ctx.txn.createScope([fundingTxn, ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        expect(() => contract.distributeDynamic(fundingTxn, [])).toThrow('Must have recipients')
      })
    })

    it('distributes to a single recipient', () => {
      const contract = createContract()
      const app = ctx.ledger.getApplicationForContract(contract)
      const acct = ctx.any.account()
      const recipients = [new Address(acct)]

      const fundingTxn = ctx.any.txn.payment({
        receiver: app.address,
        amount: 5000,
      })

      ctx.txn.createScope([fundingTxn, ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        contract.distributeDynamic(fundingTxn, recipients)
      })

      const itxnGroup = ctx.txn.lastGroup.lastItxnGroup()
      const payTxn = itxnGroup.getPaymentInnerTxn(0)
      expect(payTxn.amount).toEqual(5000n)
      expect(payTxn.receiver).toEqual(acct)
    })

    it('rejects when funds not sent to contract', () => {
      const contract = createContract()
      const wrongReceiver = ctx.any.account()
      const recipients = [new Address(ctx.any.account())]

      const fundingTxn = ctx.any.txn.payment({
        receiver: wrongReceiver,
        amount: 1000,
      })

      ctx.txn.createScope([fundingTxn, ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        expect(() => contract.distributeDynamic(fundingTxn, recipients)).toThrow('Funds must be sent to this contract')
      })
    })
  })

  describe('verifyGroupPayments', () => {
    it('passes when all preceding transactions are payments', () => {
      const contract = createContract()

      const pay1 = ctx.any.txn.payment()
      const pay2 = ctx.any.txn.payment()

      ctx.txn.createScope([pay1, pay2, ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        contract.verifyGroupPayments()
      })
    })

    it('passes with no preceding transactions', () => {
      const contract = createContract()

      ctx.txn.createScope([ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        contract.verifyGroupPayments()
      })
    })

    it('rejects when a preceding transaction is not a payment', () => {
      const contract = createContract()

      const nonPayment = ctx.any.txn.assetTransfer()

      ctx.txn.createScope([nonPayment, ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        expect(() => contract.verifyGroupPayments()).toThrow('All preceding txns must be payments')
      })
    })
  })
})
