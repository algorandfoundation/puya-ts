/**
 * Example 09: Token Manager — Deployment & Test Script
 *
 * This script compiles, deploys, and tests the TokenManager contract on LocalNet.
 *
 * Features:
 * - Deploys TokenManager contract via typed app factory
 * - Tests ASA creation via createToken inner transaction
 * - Tests contract opt-in to managed asset
 * - Tests verifyAssetConfig to read on-chain asset properties
 *
 * Prerequisites: LocalNet
 */
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { compileContract, loadAppSpec, printHeader, printStep, printSuccess, assertEqual, assertGreaterThan } from '../shared/utils'

async function main() {
  printHeader('Example 09 — Token Manager')

  // Step 1: Compile the contract
  printStep(1, 'Compiling contract...')
  compileContract('09-token-manager')
  printSuccess('Contract compiled')

  // Step 2: Load app spec
  printStep(2, 'Loading app spec...')
  const appSpec = loadAppSpec('09-token-manager/out', 'TokenManager')
  printSuccess('App spec loaded')

  // Step 3: Connect to LocalNet
  printStep(3, 'Connecting to LocalNet...')
  const algorand = AlgorandClient.defaultLocalNet()
  printSuccess('Connected to LocalNet')

  // Step 4: Create and fund deployer account
  printStep(4, 'Creating deployer account...')
  const dispenser = await algorand.account.localNetDispenser()
  const deployer = algorand.account.random()
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: deployer.addr,
    amount: (10).algo(),
  })
  printSuccess(`Deployer funded: ${deployer.addr}`)

  // Step 5: Deploy the contract
  printStep(5, 'Deploying contract...')
  const factory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: deployer.addr,
  })
  const { appClient } = await factory.send.create({ method: 'createApplication' })
  printSuccess(`Contract deployed — App ID: ${appClient.appId}`)

  // Step 6: Fund app with 1 ALGO
  printStep(6, 'Funding app with 1 ALGO...')
  await appClient.fundAppAccount({ amount: (1).algo() })
  printSuccess('App funded')

  // Step 7: Call createToken with extraFee for inner txn
  printStep(7, "Calling createToken('Test', 'TST', 1000000, 6, 'https://t.co', false)...")
  const r1 = await appClient.send.call({
    method: 'createToken',
    args: ['Test', 'TST', 1_000_000, 6, 'https://t.co', false],
    extraFee: (1).algo(),
  })
  const assetId = r1.return as bigint
  assertGreaterThan(assetId, 0n, 'createToken assetId')
  printSuccess(`createToken returned assetId: ${assetId}`)

  // Step 8: Call optInToAsset with extraFee for inner txn
  printStep(8, 'Calling optInToAsset...')
  await appClient.send.call({
    method: 'optInToAsset',
    args: [assetId],
    extraFee: (1).algo(),
  })
  printSuccess('optInToAsset succeeded')

  // Step 9: Call verifyAssetConfig → expect 1000000n
  printStep(9, 'Calling verifyAssetConfig...')
  const r2 = await appClient.send.call({
    method: 'verifyAssetConfig',
    args: [assetId],
  })
  assertEqual(r2.return, 1_000_000n, 'verifyAssetConfig total')
  printSuccess('verifyAssetConfig returned 1000000n')

  printHeader('All assertions passed!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
