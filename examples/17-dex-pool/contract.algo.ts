/**
 * Example 17: DEX Pool
 *
 * This example demonstrates a constant-product AMM (x·y=k) with inner transactions and wide math.
 *
 * Features:
 * - Full constant-product AMM (x·y=k) with reserves in GlobalState
 * - Asset management (create pool token, opt-in to trading pair)
 * - biguint math for overflow-safe invariant verification
 * - op.sqrt (uint64 square root for initial liquidity)
 * - op.bsqrt (biguint square root for invariant checks)
 * - assertMatch comparisons (greaterThan, between)
 * - itxn payments + asset transfers (pool token mint, swap output, withdrawals)
 * - itxn.submitGroup for grouped inner transactions
 * - op.mulw / op.divmodw wide math for swap output calculation
 * - Min-balance calculations via free subroutine and Account.minBalance
 *
 * Prerequisites: LocalNet
 */

import type { Asset, biguint, gtxn, uint64 } from '@algorandfoundation/algorand-typescript'
import {
  abimethod,
  assert,
  assertMatch,
  BigUint,
  Contract,
  Global,
  GlobalState,
  itxn,
  log,
  op,
  Txn,
  Uint64,
} from '@algorandfoundation/algorand-typescript'

// --- Constants ---

// Swap fee: 0.3% (input × 997 / 1000)
const SWAP_FEE_NUM = Uint64(997)
const SWAP_FEE_SCALE = Uint64(1000)

// Minimum locked liquidity on first deposit to prevent price manipulation
const MIN_LOCKED_LIQUIDITY = Uint64(1000)

// Min-balance per asset opt-in (0.1 Algo in microAlgos)
const MIN_BAL_PER_ASSET = Uint64(100_000)

// Base min-balance for an Algorand account (0.1 Algo in microAlgos)
const BASE_MIN_BAL = Uint64(100_000)

// Max seed payment to prevent accidental overfunding (10 Algo)
const MAX_SEED_AMOUNT = Uint64(10_000_000)

// Pool token total supply — large enough for any pool
const POOL_TOKEN_TOTAL = Uint64(10_000_000_000)

// --- Free subroutines ---

// Free subroutine: calculate minimum balance the pool contract needs
// min-balance = base (0.1 Algo) + numAssets × per-asset cost (0.1 Algo each)
function calculateMinBalance(numAssets: uint64): uint64 {
  // uint64 arithmetic — annotate result type
  const assetCost: uint64 = numAssets * MIN_BAL_PER_ASSET
  const total: uint64 = BASE_MIN_BAL + assetCost
  return total
}

// Free subroutine: return the smaller of two uint64 values
function minOf(a: uint64, b: uint64): uint64 {
  if (a < b) {
    return a
  }
  return b
}

// Free subroutine: compute swap output using constant-product formula with 0.3% fee
// Formula: output = reserveOut × adjustedIn / (reserveIn × scale + adjustedIn)
// where adjustedIn = amountIn × 997 (fee deducted from input)
// Uses op.mulw + op.divmodw for overflow-safe 128-bit intermediate math
function computeSwapOutput(amountIn: uint64, reserveIn: uint64, reserveOut: uint64): uint64 {
  // Apply 0.3% fee: adjustedIn = amountIn × 997
  const adjustedIn: uint64 = amountIn * SWAP_FEE_NUM

  // Denominator: reserveIn × 1000 + adjustedIn
  const denominator: uint64 = reserveIn * SWAP_FEE_SCALE + adjustedIn

  // op.mulw — 128-bit multiply: numerator = reserveOut × adjustedIn
  // Returns [high, low] uint64 pair representing a 128-bit result
  const [numHi, numLo] = op.mulw(reserveOut, adjustedIn)

  // op.divmodw — 128-bit division: numerator ÷ denominator
  // Divides 128-bit (numHi:numLo) by 128-bit (0:denominator)
  // Returns [quotientHi, quotientLo, remainderHi, remainderLo]
  const [quotientHi, quotientLo] = op.divmodw(numHi, numLo, Uint64(0), denominator)

  // Assert the swap output fits in a single uint64
  assert(quotientHi === 0, 'Swap output overflow')

  return quotientLo
}

// --- DEX Pool Contract ---

// Constant-product AMM pool for two Algorand Standard Assets
export class DexPool extends Contract {
  // Pool asset references stored in GlobalState
  assetA = GlobalState<Asset>()
  assetB = GlobalState<Asset>()
  poolToken = GlobalState<Asset>()

  // Reserve balances tracked in GlobalState
  reserveA = GlobalState<uint64>({ initialValue: Uint64(0) })
  reserveB = GlobalState<uint64>({ initialValue: Uint64(0) })

  // Total pool token liquidity outstanding
  totalLiquidity = GlobalState<uint64>({ initialValue: Uint64(0) })

  // Initialize the DEX pool application
  @abimethod({ allowActions: 'NoOp', onCreate: 'require' })
  public createApplication(): void {}

  /**
   * Bootstrap the pool: create pool token and opt in to both trading assets.
   * Requires a seed payment to fund the contract's min-balance.
   */
  public bootstrap(assetA: Asset, assetB: Asset, seed: gtxn.PaymentTxn): uint64 {
    // Only the creator can bootstrap the pool
    assert(Txn.sender === Global.creatorAddress, 'Only creator')

    // Ensure pool hasn't already been bootstrapped
    assert(this.totalLiquidity.value === 0, 'Already bootstrapped')

    // Canonical asset ordering: assetA ID must be less than assetB ID
    assert(assetA.id < assetB.id, 'Assets must be ordered by ID')

    // Min-balance calculation — pool needs balance for 3 assets (A, B, pool token)
    const requiredMinBal: uint64 = calculateMinBalance(Uint64(3))

    // assertMatch with between — seed must cover min-balance but not exceed max
    assertMatch(seed, {
      receiver: Global.currentApplicationAddress,
      amount: { between: [requiredMinBal, MAX_SEED_AMOUNT] },
    })

    // Store asset references in GlobalState
    this.assetA.value = assetA
    this.assetB.value = assetB

    // itxn.assetConfig — create the pool liquidity token via inner transaction
    const createResult = itxn
      .assetConfig({
        total: POOL_TOKEN_TOTAL, // Large supply for fractional ownership
        decimals: 6, // 6 decimal places
        assetName: 'DPT', // "DEX Pool Token"
        unitName: 'DPT', // Short unit name
        manager: Global.currentApplicationAddress, // Contract manages the token
        reserve: Global.currentApplicationAddress, // Reserve address
      })
      .submit()

    // Store created pool token Asset reference in GlobalState
    this.poolToken.value = createResult.createdAsset

    // itxn.assetTransfer — opt contract into asset A (zero-amount self-transfer)
    itxn
      .assetTransfer({
        assetReceiver: Global.currentApplicationAddress,
        xferAsset: assetA,
        assetAmount: 0,
      })
      .submit()

    // itxn.assetTransfer — opt contract into asset B (zero-amount self-transfer)
    itxn
      .assetTransfer({
        assetReceiver: Global.currentApplicationAddress,
        xferAsset: assetB,
        assetAmount: 0,
      })
      .submit()

    // Return the newly created pool token asset ID
    return createResult.createdAsset.id
  }

  /**
   * Add liquidity by depositing both assets.
   * First deposit: liquidity = sqrt(amountA) × sqrt(amountB) − MIN_LOCKED.
   * Subsequent deposits: liquidity proportional to existing reserves.
   */
  public addLiquidity(depositA: gtxn.AssetTransferTxn, depositB: gtxn.AssetTransferTxn): uint64 {
    // assertMatch — verify deposit A: correct asset, correct receiver, positive amount
    assertMatch(depositA, {
      assetReceiver: Global.currentApplicationAddress,
      xferAsset: this.assetA.value,
      assetAmount: { greaterThan: Uint64(0) }, // assertMatch greaterThan comparison
    })

    // assertMatch — verify deposit B: correct asset, correct receiver, positive amount
    assertMatch(depositB, {
      assetReceiver: Global.currentApplicationAddress,
      xferAsset: this.assetB.value,
      assetAmount: { greaterThan: Uint64(0) }, // assertMatch greaterThan comparison
    })

    const amountA = depositA.assetAmount
    const amountB = depositB.assetAmount
    let liquidity: uint64 = Uint64(0)

    if (this.totalLiquidity.value === 0) {
      // First deposit: geometric mean of amounts for initial liquidity
      // op.sqrt — uint64 square root of each deposit amount
      const sqrtA: uint64 = op.sqrt(amountA)
      const sqrtB: uint64 = op.sqrt(amountB)

      // uint64 arithmetic — approximate geometric mean
      const rawLiquidity: uint64 = sqrtA * sqrtB

      // Subtract minimum locked liquidity to prevent price manipulation
      assert(rawLiquidity > MIN_LOCKED_LIQUIDITY, 'Initial deposit too small')
      liquidity = rawLiquidity - MIN_LOCKED_LIQUIDITY

      // biguint math — verify approximation against exact geometric mean
      const bigProduct: biguint = BigUint(amountA) * BigUint(amountB)
      // op.bsqrt — biguint square root for exact geometric mean
      const exactSqrt: biguint = op.bsqrt(bigProduct)
      // The approximate sqrt(a)×sqrt(b) must not exceed the exact sqrt(a×b)
      assert(BigUint(rawLiquidity) <= exactSqrt, 'Sqrt approximation overflow')
    } else {
      // Subsequent deposits: mint proportional to the smaller ratio
      // liquidityA = amountA × totalLiquidity / reserveA
      const liquidityA: uint64 = (amountA * this.totalLiquidity.value) / this.reserveA.value
      // liquidityB = amountB × totalLiquidity / reserveB
      const liquidityB: uint64 = (amountB * this.totalLiquidity.value) / this.reserveB.value

      // Free subroutine: take the minimum to prevent one-sided inflation
      liquidity = minOf(liquidityA, liquidityB)
    }

    assert(liquidity > 0, 'Zero liquidity')

    // Update reserves in GlobalState
    const newReserveA: uint64 = this.reserveA.value + amountA
    this.reserveA.value = newReserveA
    const newReserveB: uint64 = this.reserveB.value + amountB
    this.reserveB.value = newReserveB

    // Update total liquidity outstanding
    const newLiquidity: uint64 = this.totalLiquidity.value + liquidity
    this.totalLiquidity.value = newLiquidity

    // itxn.assetTransfer — mint pool tokens to the liquidity provider
    itxn
      .assetTransfer({
        assetReceiver: Txn.sender, // Send pool tokens to the depositor
        xferAsset: this.poolToken.value, // The pool's liquidity token
        assetAmount: liquidity, // Minted amount
      })
      .submit()

    return liquidity
  }

  /**
   * Remove liquidity by returning pool tokens.
   * Proportional amounts of both assets are withdrawn.
   */
  public removeLiquidity(poolDeposit: gtxn.AssetTransferTxn): void {
    // assertMatch with greaterThan — verify pool token deposit
    assertMatch(poolDeposit, {
      assetReceiver: Global.currentApplicationAddress,
      xferAsset: this.poolToken.value,
      assetAmount: { greaterThan: Uint64(0) },
    })

    const burnAmount = poolDeposit.assetAmount
    const totalLiq = this.totalLiquidity.value

    // Calculate proportional withdrawal amounts
    // amountA = burnAmount × reserveA / totalLiquidity
    const amountA: uint64 = (burnAmount * this.reserveA.value) / totalLiq
    // amountB = burnAmount × reserveB / totalLiquidity
    const amountB: uint64 = (burnAmount * this.reserveB.value) / totalLiq

    assert(amountA > 0, 'Zero withdrawal A')
    assert(amountB > 0, 'Zero withdrawal B')

    // Update reserves in GlobalState
    const newResA: uint64 = this.reserveA.value - amountA
    this.reserveA.value = newResA
    const newResB: uint64 = this.reserveB.value - amountB
    this.reserveB.value = newResB

    // Update total liquidity
    const newLiq: uint64 = totalLiq - burnAmount
    this.totalLiquidity.value = newLiq

    // Build inner transactions for both asset withdrawals
    const sendA = itxn.assetTransfer({
      assetReceiver: Txn.sender, // Send asset A to the provider
      xferAsset: this.assetA.value,
      assetAmount: amountA,
    })
    const sendB = itxn.assetTransfer({
      assetReceiver: Txn.sender, // Send asset B to the provider
      xferAsset: this.assetB.value,
      assetAmount: amountB,
    })

    // itxn.submitGroup — send both assets back atomically in one inner group
    itxn.submitGroup(sendA, sendB)
  }

  /**
   * Swap one asset for the other using the constant-product formula.
   * Deposit asset A to receive asset B, or vice versa.
   * A 0.3% fee is deducted from the input.
   */
  public swap(deposit: gtxn.AssetTransferTxn): uint64 {
    // assertMatch with greaterThan — verify the deposit is positive and targets this contract
    assertMatch(deposit, {
      assetReceiver: Global.currentApplicationAddress,
      assetAmount: { greaterThan: Uint64(0) },
    })

    const depositAsset = deposit.xferAsset
    const amountIn = deposit.assetAmount

    // Snapshot old reserves for invariant check
    const oldResA = this.reserveA.value
    const oldResB = this.reserveB.value

    let amountOut: uint64 = Uint64(0)
    let newReserveA: uint64 = Uint64(0)
    let newReserveB: uint64 = Uint64(0)

    if (depositAsset === this.assetA.value) {
      // Swapping A → B: compute output of asset B
      // Free subroutine uses op.mulw + op.divmodw wide math
      amountOut = computeSwapOutput(amountIn, oldResA, oldResB)
      assert(amountOut > 0, 'Zero output')
      assert(amountOut < oldResB, 'Insufficient reserve B')

      // Update local reserve variables
      newReserveA = oldResA + amountIn
      newReserveB = oldResB - amountOut

      // itxn.assetTransfer — send asset B output to the swapper
      itxn
        .assetTransfer({
          assetReceiver: Txn.sender,
          xferAsset: this.assetB.value,
          assetAmount: amountOut,
        })
        .submit()
    } else {
      // Swapping B → A: compute output of asset A
      assert(depositAsset === this.assetB.value, 'Unknown asset')
      amountOut = computeSwapOutput(amountIn, oldResB, oldResA)
      assert(amountOut > 0, 'Zero output')
      assert(amountOut < oldResA, 'Insufficient reserve A')

      // Update local reserve variables
      newReserveA = oldResA - amountOut
      newReserveB = oldResB + amountIn

      // itxn.assetTransfer — send asset A output to the swapper
      itxn
        .assetTransfer({
          assetReceiver: Txn.sender,
          xferAsset: this.assetA.value,
          assetAmount: amountOut,
        })
        .submit()
    }

    // biguint math — verify constant-product invariant (new k ≥ old k)
    // The 0.3% fee ensures new k is always ≥ old k
    const oldK: biguint = BigUint(oldResA) * BigUint(oldResB)
    const newK: biguint = BigUint(newReserveA) * BigUint(newReserveB)
    assert(newK >= oldK, 'Invariant violated: k decreased')

    // Commit updated reserves to GlobalState
    this.reserveA.value = newReserveA
    this.reserveB.value = newReserveB

    return amountOut
  }

  /**
   * Withdraw excess Algo balance above the minimum required.
   * Demonstrates itxn.payment and Account.minBalance.
   */
  public withdrawAlgoExcess(): void {
    // Only the creator can withdraw excess
    assert(Txn.sender === Global.creatorAddress, 'Only creator')

    // Account.minBalance — AVM's authoritative min-balance for this contract
    const minBal: uint64 = Global.currentApplicationAddress.minBalance
    // Account.balance — current total Algo balance of the contract
    const contractBal: uint64 = Global.currentApplicationAddress.balance

    // Ensure there is excess above the minimum
    assert(contractBal > minBal, 'No excess balance')
    const excess: uint64 = contractBal - minBal

    // itxn.payment — send excess Algo back to the creator
    itxn
      .payment({
        receiver: Global.creatorAddress,
        amount: excess,
      })
      .submit()
  }

  /**
   * Read-only view: pool reserves, liquidity, and invariant sqrt.
   * Demonstrates biguint math and op.bsqrt for computing sqrt(k).
   */
  @abimethod({ readonly: true })
  public getPoolState(): PoolState {
    const resA = this.reserveA.value
    const resB = this.reserveB.value

    // biguint math — compute constant product k = reserveA × reserveB
    const k: biguint = BigUint(resA) * BigUint(resB)

    // op.bsqrt — compute sqrt(k), the geometric mean of reserves
    const sqrtK: biguint = op.bsqrt(k)

    // log() — emit sqrt(k) for off-chain monitoring
    log(sqrtK)

    return {
      reserveA: resA,
      reserveB: resB,
      totalLiquidity: this.totalLiquidity.value,
    }
  }
}

// Return type for getPoolState — object tuple with uint64 fields
type PoolState = {
  reserveA: uint64
  reserveB: uint64
  totalLiquidity: uint64
}
