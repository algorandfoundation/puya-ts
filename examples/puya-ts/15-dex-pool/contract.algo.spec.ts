import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { afterEach, describe, expect, it } from 'vitest'
import { DexPool } from './contract.algo'

describe('DexPool', () => {
  const ctx = new TestExecutionContext()
  afterEach(() => ctx.reset())

  function createContract() {
    const contract = ctx.contract.create(DexPool)
    contract.createApplication()
    return contract
  }

  function bootstrapPool(contract: ReturnType<typeof createContract>) {
    const app = ctx.ledger.getApplicationForContract(contract)
    const assetA = ctx.any.asset()
    const assetB = ctx.any.asset()

    const seedTxn = ctx.any.txn.payment({
      receiver: app.address,
      amount: 500_000,
    })

    let poolTokenId!: unknown
    ctx.txn.createScope([seedTxn, ctx.any.txn.applicationCall({ appId: contract, sender: app.creator })]).execute(() => {
      poolTokenId = contract.bootstrap(assetA, assetB, seedTxn)
    })

    return { assetA, assetB, poolTokenId, app }
  }

  function addLiquidity(
    contract: ReturnType<typeof createContract>,
    assetA: ReturnType<typeof ctx.any.asset>,
    assetB: ReturnType<typeof ctx.any.asset>,
    app: ReturnType<typeof ctx.ledger.getApplicationForContract>,
    amountA: number,
    amountB: number,
  ) {
    const depositATxn = ctx.any.txn.assetTransfer({
      assetReceiver: app.address,
      xferAsset: assetA,
      assetAmount: amountA,
    })
    const depositBTxn = ctx.any.txn.assetTransfer({
      assetReceiver: app.address,
      xferAsset: assetB,
      assetAmount: amountB,
    })

    let liquidity!: bigint
    ctx.txn.createScope([depositATxn, depositBTxn, ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
      liquidity = contract.addLiquidity(depositATxn, depositBTxn) as unknown as bigint
    })

    return liquidity
  }

  describe('bootstrap', () => {
    it('creates pool token and stores asset references', () => {
      const contract = createContract()
      const { poolTokenId } = bootstrapPool(contract)

      expect(poolTokenId).toBeTruthy()
      expect(contract.poolToken.hasValue).toBe(true)
      expect(contract.assetA.hasValue).toBe(true)
      expect(contract.assetB.hasValue).toBe(true)
    })

    it('inner txn creates pool token with correct config', () => {
      const contract = createContract()
      bootstrapPool(contract)

      const createTxn = ctx.txn.lastGroup.getItxnGroup(0).getAssetConfigInnerTxn()
      expect(createTxn.total).toEqual(10_000_000_000n)
      expect(createTxn.decimals).toEqual(6n)
      expect(createTxn.assetName).toEqual('DPT')
      expect(createTxn.unitName).toEqual('DPT')
    })

    it('rejects bootstrap after liquidity has been added', () => {
      const contract = createContract()
      const { assetA, assetB, app } = bootstrapPool(contract)

      // Add liquidity so totalLiquidity > 0
      addLiquidity(contract, assetA, assetB, app, 10_000, 10_000)

      const seedTxn = ctx.any.txn.payment({
        receiver: app.address,
        amount: 500_000,
      })

      ctx.txn.createScope([seedTxn, ctx.any.txn.applicationCall({ appId: contract, sender: app.creator })]).execute(() => {
        expect(() => contract.bootstrap(assetA, assetB, seedTxn)).toThrow('Already bootstrapped')
      })
    })

    it('rejects non-creator sender', () => {
      const contract = createContract()
      const app = ctx.ledger.getApplicationForContract(contract)
      const assetA = ctx.any.asset()
      const assetB = ctx.any.asset()
      const nonCreator = ctx.any.account()

      const seedTxn = ctx.any.txn.payment({
        receiver: app.address,
        amount: 500_000,
      })

      ctx.txn.createScope([seedTxn, ctx.any.txn.applicationCall({ appId: contract, sender: nonCreator })]).execute(() => {
        expect(() => contract.bootstrap(assetA, assetB, seedTxn)).toThrow('Only creator')
      })
    })

    it('rejects unordered assets', () => {
      const contract = createContract()
      const app = ctx.ledger.getApplicationForContract(contract)
      const assetA = ctx.any.asset()
      const assetB = ctx.any.asset()

      const seedTxn = ctx.any.txn.payment({
        receiver: app.address,
        amount: 500_000,
      })

      ctx.txn.createScope([seedTxn, ctx.any.txn.applicationCall({ appId: contract, sender: app.creator })]).execute(() => {
        expect(() => contract.bootstrap(assetB, assetA, seedTxn)).toThrow('Assets must be ordered by ID')
      })
    })
  })

  describe('addLiquidity', () => {
    it('first deposit computes geometric mean liquidity and updates state', () => {
      const contract = createContract()
      const { assetA, assetB, app } = bootstrapPool(contract)

      // sqrt(10_000) = 100, rawLiquidity = 100 * 100 = 10_000
      // liquidity = 10_000 - 1_000 (MIN_LOCKED) = 9_000
      const liquidity = addLiquidity(contract, assetA, assetB, app, 10_000, 10_000)

      expect(liquidity).toEqual(9_000n)
      expect(contract.reserveA.value).toEqual(10_000n)
      expect(contract.reserveB.value).toEqual(10_000n)
      expect(contract.totalLiquidity.value).toEqual(9_000n)
    })

    it('mints pool tokens via inner txn', () => {
      const contract = createContract()
      const { assetA, assetB, app } = bootstrapPool(contract)

      addLiquidity(contract, assetA, assetB, app, 10_000, 10_000)

      const mintTxn = ctx.txn.lastGroup.lastItxnGroup().getAssetTransferInnerTxn()
      expect(mintTxn.assetAmount).toEqual(9_000n)
    })

    it('subsequent deposit mints proportional liquidity', () => {
      const contract = createContract()
      const { assetA, assetB, app } = bootstrapPool(contract)

      addLiquidity(contract, assetA, assetB, app, 10_000, 10_000)

      // liquidityA = 5_000 * 9_000 / 10_000 = 4_500
      // liquidityB = 5_000 * 9_000 / 10_000 = 4_500
      const liquidity2 = addLiquidity(contract, assetA, assetB, app, 5_000, 5_000)

      expect(liquidity2).toEqual(4_500n)
      expect(contract.reserveA.value).toEqual(15_000n)
      expect(contract.reserveB.value).toEqual(15_000n)
      expect(contract.totalLiquidity.value).toEqual(13_500n)
    })

    it('rejects initial deposit too small', () => {
      const contract = createContract()
      const { assetA, assetB, app } = bootstrapPool(contract)

      const depositATxn = ctx.any.txn.assetTransfer({
        assetReceiver: app.address,
        xferAsset: assetA,
        assetAmount: 1,
      })
      const depositBTxn = ctx.any.txn.assetTransfer({
        assetReceiver: app.address,
        xferAsset: assetB,
        assetAmount: 1,
      })

      ctx.txn.createScope([depositATxn, depositBTxn, ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        expect(() => contract.addLiquidity(depositATxn, depositBTxn)).toThrow('Initial deposit too small')
      })
    })

    it('rejects subsequent deposit yielding zero liquidity', () => {
      const contract = createContract()
      const { assetA, assetB, app } = bootstrapPool(contract)

      addLiquidity(contract, assetA, assetB, app, 10_000, 10_000)

      // 1 * 9_000 / 10_000 = 0 (integer division)
      const depositATxn = ctx.any.txn.assetTransfer({
        assetReceiver: app.address,
        xferAsset: assetA,
        assetAmount: 1,
      })
      const depositBTxn = ctx.any.txn.assetTransfer({
        assetReceiver: app.address,
        xferAsset: assetB,
        assetAmount: 1,
      })

      ctx.txn.createScope([depositATxn, depositBTxn, ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        expect(() => contract.addLiquidity(depositATxn, depositBTxn)).toThrow('Zero liquidity')
      })
    })
  })

  describe('removeLiquidity', () => {
    it('returns proportional assets via inner txns and updates state', () => {
      const contract = createContract()
      const { assetA, assetB, app } = bootstrapPool(contract)

      addLiquidity(contract, assetA, assetB, app, 10_000, 10_000)

      const poolToken = contract.poolToken.value
      // Burn 4500 of 9000 → 50% of reserves
      // amountA = 4500 * 10_000 / 9_000 = 5_000
      // amountB = 4500 * 10_000 / 9_000 = 5_000
      const poolDepositTxn = ctx.any.txn.assetTransfer({
        assetReceiver: app.address,
        xferAsset: poolToken,
        assetAmount: 4_500,
      })

      ctx.txn.createScope([poolDepositTxn, ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        contract.removeLiquidity(poolDepositTxn)
      })

      // itxn.submitGroup creates separate ItxnGroups
      const sendATxn = ctx.txn.lastGroup.getItxnGroup(0).getAssetTransferInnerTxn()
      const sendBTxn = ctx.txn.lastGroup.getItxnGroup(1).getAssetTransferInnerTxn()
      expect(sendATxn.xferAsset).toEqual(assetA)
      expect(sendATxn.assetAmount).toEqual(5_000n)
      expect(sendBTxn.xferAsset).toEqual(assetB)
      expect(sendBTxn.assetAmount).toEqual(5_000n)

      expect(contract.reserveA.value).toEqual(5_000n)
      expect(contract.reserveB.value).toEqual(5_000n)
      expect(contract.totalLiquidity.value).toEqual(4_500n)
    })

    it('rejects zero pool token deposit', () => {
      const contract = createContract()
      const { assetA, assetB, app } = bootstrapPool(contract)

      addLiquidity(contract, assetA, assetB, app, 10_000, 10_000)

      const poolToken = contract.poolToken.value
      const poolDepositTxn = ctx.any.txn.assetTransfer({
        assetReceiver: app.address,
        xferAsset: poolToken,
        assetAmount: 0,
      })

      ctx.txn.createScope([poolDepositTxn, ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        expect(() => contract.removeLiquidity(poolDepositTxn)).toThrow()
      })
    })
  })

  describe('swap', () => {
    it('computes correct output for A → B swap', () => {
      const contract = createContract()
      const { assetA, assetB, app } = bootstrapPool(contract)

      addLiquidity(contract, assetA, assetB, app, 10_000, 10_000)

      const swapDepositTxn = ctx.any.txn.assetTransfer({
        assetReceiver: app.address,
        xferAsset: assetA,
        assetAmount: 1_000,
      })

      let output!: bigint
      ctx.txn.createScope([swapDepositTxn, ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        output = contract.swap(swapDepositTxn) as unknown as bigint
      })

      // adjustedIn = 1000 * 997 = 997_000
      // denom = 10_000 * 1000 + 997_000 = 10_997_000
      // numer = 10_000 * 997_000 = 9_970_000_000
      // output = 9_970_000_000 / 10_997_000 = 906
      expect(output).toEqual(906n)
      expect(contract.reserveA.value).toEqual(11_000n)
      expect(contract.reserveB.value).toEqual(9_094n)
    })

    it('computes correct output for B → A swap', () => {
      const contract = createContract()
      const { assetA, assetB, app } = bootstrapPool(contract)

      addLiquidity(contract, assetA, assetB, app, 10_000, 10_000)

      const swapDepositTxn = ctx.any.txn.assetTransfer({
        assetReceiver: app.address,
        xferAsset: assetB,
        assetAmount: 1_000,
      })

      let output!: bigint
      ctx.txn.createScope([swapDepositTxn, ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        output = contract.swap(swapDepositTxn) as unknown as bigint
      })

      // Symmetric reserves → same output
      expect(output).toEqual(906n)
      expect(contract.reserveA.value).toEqual(9_094n)
      expect(contract.reserveB.value).toEqual(11_000n)
    })

    it('emits correct inner asset transfer for A → B swap', () => {
      const contract = createContract()
      const { assetA, assetB, app } = bootstrapPool(contract)

      addLiquidity(contract, assetA, assetB, app, 10_000, 10_000)

      const swapDepositTxn = ctx.any.txn.assetTransfer({
        assetReceiver: app.address,
        xferAsset: assetA,
        assetAmount: 1_000,
      })

      ctx.txn.createScope([swapDepositTxn, ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        contract.swap(swapDepositTxn)
      })

      const itxn = ctx.txn.lastGroup.lastItxnGroup().getAssetTransferInnerTxn()
      expect(itxn.xferAsset).toEqual(assetB)
      expect(itxn.assetAmount).toEqual(906n)
    })

    it('rejects swap with unknown asset', () => {
      const contract = createContract()
      const { assetA, assetB, app } = bootstrapPool(contract)

      addLiquidity(contract, assetA, assetB, app, 10_000, 10_000)

      const unknownAsset = ctx.any.asset()
      const swapDepositTxn = ctx.any.txn.assetTransfer({
        assetReceiver: app.address,
        xferAsset: unknownAsset,
        assetAmount: 1_000,
      })

      ctx.txn.createScope([swapDepositTxn, ctx.any.txn.applicationCall({ appId: contract })]).execute(() => {
        expect(() => contract.swap(swapDepositTxn)).toThrow('Unknown asset')
      })
    })
  })

  describe('getPoolState', () => {
    it('returns correct state after liquidity addition', () => {
      const contract = createContract()
      const { assetA, assetB, app } = bootstrapPool(contract)

      addLiquidity(contract, assetA, assetB, app, 10_000, 10_000)

      const state = contract.getPoolState()
      expect(state.reserveA).toEqual(10_000n)
      expect(state.reserveB).toEqual(10_000n)
      expect(state.totalLiquidity).toEqual(9_000n)
    })

    it('returns zeros before liquidity is added', () => {
      const contract = createContract()
      bootstrapPool(contract)

      const state = contract.getPoolState()
      expect(state.reserveA).toEqual(0n)
      expect(state.reserveB).toEqual(0n)
      expect(state.totalLiquidity).toEqual(0n)
    })
  })
})
