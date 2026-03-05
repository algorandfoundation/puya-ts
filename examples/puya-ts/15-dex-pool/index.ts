/**
 * Example 15: DEX Pool — Deployment & Test Script
 *
 * This script compiles, deploys, and exercises the DexPool contract on LocalNet.
 * It bootstraps the pool, adds liquidity, and demonstrates a realistic multi-party
 * swap flow with a dedicated deployer and separate swapper account.
 *
 * Prerequisites: LocalNet
 */

import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { compileContract, loadAppSpec, printHeader, printStep, printSuccess, assertGreaterThan } from '../shared/utils'

async function main() {
  printHeader('Example 15 — DEX Pool')

  // Step 1: Compile the contract
  printStep(1, 'Compiling contract...')
  compileContract('15-dex-pool')
  printSuccess('Contract compiled')

  // Step 2: Load app spec
  printStep(2, 'Loading app spec...')
  const appSpec = loadAppSpec('15-dex-pool/out', 'DexPool')
  printSuccess('App spec loaded')

  // Step 3: Connect to LocalNet
  printStep(3, 'Connecting to LocalNet...')
  const algorand = AlgorandClient.defaultLocalNet()
  printSuccess('Connected to LocalNet')

  // Step 4: Create and fund deployer + swapper accounts
  printStep(4, 'Creating deployer and swapper accounts...')
  const dispenser = await algorand.account.localNetDispenser()
  const deployer = algorand.account.random()
  const swapper = algorand.account.random()
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: deployer.addr,
    amount: (10).algo(),
  })
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: swapper.addr,
    amount: (10).algo(),
  })
  printSuccess(`Deployer funded: ${deployer.addr}`)
  printSuccess(`Swapper funded: ${swapper.addr}`)

  // Step 5: Deploy the contract and fund with 1 ALGO
  printStep(5, 'Deploying contract...')
  const factory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: deployer.addr,
  })
  const { appClient } = await factory.send.create({ method: 'createApplication' })
  await appClient.fundAppAccount({ amount: (1).algo() })
  printSuccess(`Contract deployed — App ID: ${appClient.appId}, funded with 1 ALGO`)

  // Step 6: Create 2 test ASAs with canonical ordering
  printStep(6, 'Creating test ASAs...')
  const res1 = await algorand.send.assetCreate({
    sender: deployer.addr,
    total: 10_000_000n,
    decimals: 6,
    assetName: 'TokenA',
    unitName: 'TKA',
  })
  const res2 = await algorand.send.assetCreate({
    sender: deployer.addr,
    total: 10_000_000n,
    decimals: 6,
    assetName: 'TokenB',
    unitName: 'TKB',
  })
  const id1 = BigInt(res1.assetId)
  const id2 = BigInt(res2.assetId)
  const [assetA, assetB] = id1 < id2 ? [id1, id2] : [id2, id1]
  assertGreaterThan(assetA, 0n, 'assetA > 0')
  assertGreaterThan(assetB, 0n, 'assetB > 0')
  printSuccess(`Created ASAs — assetA: ${assetA}, assetB: ${assetB}`)

  // Step 7: Bootstrap the pool
  printStep(7, 'Bootstrapping pool...')
  const bootstrapResult = await appClient.send.call({
    method: 'bootstrap',
    args: [
      assetA,
      assetB,
      algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: appClient.appAddress,
        amount: (0.5).algo(),
      }),
    ],
    extraFee: (1).algo(),
  })
  const poolTokenId = bootstrapResult.return as bigint
  assertGreaterThan(poolTokenId, 0n, 'poolTokenId > 0')
  printSuccess(`Pool bootstrapped — pool token ID: ${poolTokenId}`)

  // Step 8: Deployer opts into pool token
  printStep(8, 'Deployer opting into pool token...')
  await algorand.send.assetOptIn({ sender: deployer.addr, assetId: poolTokenId })
  printSuccess('Deployer opted into pool token')

  // Step 9: Add liquidity
  printStep(9, 'Adding liquidity...')
  const liquidityResult = await appClient.send.call({
    method: 'addLiquidity',
    args: [
      algorand.createTransaction.assetTransfer({
        sender: deployer.addr,
        receiver: appClient.appAddress,
        assetId: assetA,
        amount: 100_000n,
      }),
      algorand.createTransaction.assetTransfer({
        sender: deployer.addr,
        receiver: appClient.appAddress,
        assetId: assetB,
        amount: 100_000n,
      }),
    ],
    extraFee: (1).algo(),
  })
  const liquidity = liquidityResult.return as bigint
  assertGreaterThan(liquidity, 0n, 'liquidity > 0')
  printSuccess(`Liquidity added — amount: ${liquidity}`)

  // Step 10: Get pool state
  printStep(10, 'Getting pool state...')
  const stateResult = await appClient.send.call({ method: 'getPoolState' })
  const state = stateResult.return as { reserveA: bigint; reserveB: bigint; totalLiquidity: bigint }
  assertGreaterThan(state.reserveA, 0n, 'reserveA > 0')
  assertGreaterThan(state.reserveB, 0n, 'reserveB > 0')
  printSuccess(`Pool state — reserveA: ${state.reserveA}, reserveB: ${state.reserveB}`)

  // Step 11: Swapper opts into assets (assetA to send, assetB to receive)
  printStep(11, 'Swapper opting into assets...')
  await algorand.send.assetOptIn({ sender: swapper.addr, assetId: assetA })
  await algorand.send.assetOptIn({ sender: swapper.addr, assetId: assetB })
  printSuccess('Swapper opted into assetA and assetB')

  // Step 12: Deployer sends some TokenA to swapper for the swap
  printStep(12, 'Transferring TokenA to swapper...')
  await algorand.send.assetTransfer({
    sender: deployer.addr,
    receiver: swapper.addr,
    assetId: assetA,
    amount: 10_000n,
  })
  printSuccess('Swapper received 10,000 TokenA')

  // Step 13: Swapper swaps TokenA → TokenB
  printStep(13, 'Swapper swapping TokenA for TokenB...')
  const swapResult = await appClient.send.call({
    method: 'swap',
    args: [
      algorand.createTransaction.assetTransfer({
        sender: swapper.addr,
        receiver: appClient.appAddress,
        assetId: assetA,
        amount: 5_000n,
      }),
    ],
    sender: swapper.addr,
    extraFee: (1).algo(),
  })
  const swapOutput = swapResult.return as bigint
  assertGreaterThan(swapOutput, 0n, 'swap output > 0')
  printSuccess(`Swap complete — received ${swapOutput} TokenB`)

  // Step 14: Verify pool state after swap
  printStep(14, 'Verifying pool state after swap...')
  const postSwapState = await appClient.send.call({ method: 'getPoolState' })
  const newState = postSwapState.return as { reserveA: bigint; reserveB: bigint; totalLiquidity: bigint }
  assertGreaterThan(newState.reserveA, state.reserveA, 'reserveA increased after swap')
  assertGreaterThan(state.reserveB, newState.reserveB, 'reserveB decreased after swap')
  printSuccess(`Post-swap state — reserveA: ${newState.reserveA}, reserveB: ${newState.reserveB}`)

  printHeader('All assertions passed!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
