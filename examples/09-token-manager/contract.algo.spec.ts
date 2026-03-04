import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { afterEach, describe, expect, it } from 'vitest'
import { TokenManager } from './contract.algo'

describe('TokenManager', () => {
  const ctx = new TestExecutionContext()
  afterEach(() => ctx.reset())

  function createContract() {
    const contract = ctx.contract.create(TokenManager)
    contract.createApplication()
    return contract
  }

  function bootstrapToken(contract: ReturnType<typeof createContract>) {
    return contract.createToken('Test Token', 'TST', 1_000_000, 6, 'https://example.com', false)
  }

  describe('createToken (bootstrap)', () => {
    it('creates ASA via inner transaction and returns asset id', () => {
      const contract = createContract()

      const assetId = bootstrapToken(contract)

      expect(assetId).toBeTruthy()
      expect(contract.totalMinted.value).toEqual(1_000_000n)
      expect(contract.managedAsset.hasValue).toBe(true)
    })

    it('inner txn has correct asset config fields', () => {
      const contract = createContract()
      const app = ctx.ledger.getApplicationForContract(contract)

      bootstrapToken(contract)

      const itxn = ctx.txn.lastGroup.lastItxnGroup().getAssetConfigInnerTxn()
      expect(itxn.total).toEqual(1_000_000n)
      expect(itxn.decimals).toEqual(6n)
      expect(itxn.assetName).toEqual('Test Token')
      expect(itxn.unitName).toEqual('TST')
      expect(itxn.url).toEqual('https://example.com')
      expect(itxn.defaultFrozen).toBe(false)
      expect(itxn.manager).toEqual(app.address)
      expect(itxn.reserve).toEqual(app.address)
      expect(itxn.freeze).toEqual(app.address)
      expect(itxn.clawback).toEqual(app.address)
    })

    it('rejects double bootstrap', () => {
      const contract = createContract()
      bootstrapToken(contract)

      expect(() => bootstrapToken(contract)).toThrow('Token already created')
    })
  })

  describe('transfer (mint)', () => {
    it('transfers tokens via inner asset transfer', () => {
      const contract = createContract()
      bootstrapToken(contract)

      const asset = contract.managedAsset.value
      const receiver = ctx.any.account()

      contract.optInToAsset(asset)
      contract.transfer(asset, receiver, 500)

      const itxn = ctx.txn.lastGroup.lastItxnGroup().getAssetTransferInnerTxn()
      expect(itxn.assetReceiver).toEqual(receiver)
      expect(itxn.xferAsset).toEqual(asset)
      expect(itxn.assetAmount).toEqual(500n)
    })

    it('rejects zero amount', () => {
      const contract = createContract()
      bootstrapToken(contract)
      const asset = contract.managedAsset.value
      const receiver = ctx.any.account()

      expect(() => contract.transfer(asset, receiver, 0)).toThrow('Amount must be positive')
    })

    it('rejects wrong asset', () => {
      const contract = createContract()
      bootstrapToken(contract)
      const wrongAsset = ctx.any.asset()
      const receiver = ctx.any.account()

      expect(() => contract.transfer(wrongAsset, receiver, 100)).toThrow('Wrong asset')
    })
  })

  describe('freezeAccount', () => {
    it('freezes an account via inner asset freeze', () => {
      const contract = createContract()
      const app = ctx.ledger.getApplicationForContract(contract)
      bootstrapToken(contract)
      const asset = contract.managedAsset.value
      const target = ctx.any.account()

      ctx.txn.createScope([ctx.any.txn.applicationCall({ sender: app.creator })]).execute(() => {
        contract.freezeAccount(asset, target, true)
      })

      const itxn = ctx.txn.lastGroup.lastItxnGroup().getAssetFreezeInnerTxn()
      expect(itxn.freezeAsset).toEqual(asset)
      expect(itxn.freezeAccount).toEqual(target)
      expect(itxn.frozen).toBe(true)
    })

    it('unfreezes an account', () => {
      const contract = createContract()
      const app = ctx.ledger.getApplicationForContract(contract)
      bootstrapToken(contract)
      const asset = contract.managedAsset.value
      const target = ctx.any.account()

      ctx.txn.createScope([ctx.any.txn.applicationCall({ sender: app.creator })]).execute(() => {
        contract.freezeAccount(asset, target, false)
      })

      const itxn = ctx.txn.lastGroup.lastItxnGroup().getAssetFreezeInnerTxn()
      expect(itxn.frozen).toBe(false)
    })

    it('rejects non-creator sender', () => {
      const contract = createContract()
      bootstrapToken(contract)
      const asset = contract.managedAsset.value
      const nonCreator = ctx.any.account()
      const target = ctx.any.account()

      ctx.txn.createScope([ctx.any.txn.applicationCall({ sender: nonCreator })]).execute(() => {
        expect(() => contract.freezeAccount(asset, target, true)).toThrow('Only creator can freeze')
      })
    })
  })

  describe('clawback', () => {
    it('claws back tokens via inner asset transfer with assetSender', () => {
      const contract = createContract()
      const app = ctx.ledger.getApplicationForContract(contract)
      bootstrapToken(contract)
      const asset = contract.managedAsset.value
      const target = ctx.any.account()

      ctx.txn.createScope([ctx.any.txn.applicationCall({ sender: app.creator })]).execute(() => {
        contract.clawback(asset, target, 200)
      })

      const itxn = ctx.txn.lastGroup.lastItxnGroup().getAssetTransferInnerTxn()
      expect(itxn.assetSender).toEqual(target)
      expect(itxn.assetReceiver).toEqual(app.address)
      expect(itxn.xferAsset).toEqual(asset)
      expect(itxn.assetAmount).toEqual(200n)
    })

    it('rejects non-creator sender', () => {
      const contract = createContract()
      bootstrapToken(contract)
      const asset = contract.managedAsset.value
      const nonCreator = ctx.any.account()

      ctx.txn.createScope([ctx.any.txn.applicationCall({ sender: nonCreator })]).execute(() => {
        expect(() => contract.clawback(asset, ctx.any.account(), 100)).toThrow('Only creator can clawback')
      })
    })
  })

  describe('destroyToken', () => {
    it('destroys the managed asset', () => {
      const contract = createContract()
      const app = ctx.ledger.getApplicationForContract(contract)
      bootstrapToken(contract)
      const asset = contract.managedAsset.value

      ctx.txn.createScope([ctx.any.txn.applicationCall({ sender: app.creator })]).execute(() => {
        contract.destroyToken(asset)
      })

      const itxn = ctx.txn.lastGroup.lastItxnGroup().getAssetConfigInnerTxn()
      expect(itxn.configAsset).toEqual(asset)
    })
  })

  describe('verifyAssetConfig', () => {
    it('returns total supply and validates management addresses', () => {
      const contract = createContract()
      bootstrapToken(contract)
      const asset = contract.managedAsset.value

      const total = contract.verifyAssetConfig(asset)

      expect(total).toEqual(1_000_000n)
    })

    it('rejects wrong asset', () => {
      const contract = createContract()
      bootstrapToken(contract)
      const wrongAsset = ctx.any.asset()

      expect(() => contract.verifyAssetConfig(wrongAsset)).toThrow('Wrong asset')
    })
  })

  describe('optInToAsset', () => {
    it('opts contract into managed asset via zero-amount self-transfer', () => {
      const contract = createContract()
      const app = ctx.ledger.getApplicationForContract(contract)
      bootstrapToken(contract)
      const asset = contract.managedAsset.value

      contract.optInToAsset(asset)

      const itxn = ctx.txn.lastGroup.lastItxnGroup().getAssetTransferInnerTxn()
      expect(itxn.assetReceiver).toEqual(app.address)
      expect(itxn.xferAsset).toEqual(asset)
      expect(itxn.assetAmount).toEqual(0n)
    })

    it('rejects wrong asset', () => {
      const contract = createContract()
      bootstrapToken(contract)
      const wrongAsset = ctx.any.asset()

      expect(() => contract.optInToAsset(wrongAsset)).toThrow('Wrong asset')
    })
  })
})
