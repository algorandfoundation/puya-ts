/**
 * Example 03: Raw Calculator — Deployment & Test Script
 *
 * Deploys the RawCalculator contract to LocalNet via raw TEAL programs
 * (no ABI factory) and verifies successful deployment.
 *
 * Prerequisites: LocalNet
 */
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compileContract, printHeader, printStep, printSuccess, assertGreaterThan } from '../shared/utils'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function main() {
  printHeader('Example 03 — Raw Calculator')

  // Step 1: Compile the contract with TEAL output
  printStep(1, 'Compiling contract with --output-teal...')
  compileContract('03-raw-calculator', { outputTeal: true })
  printSuccess('Contract compiled')

  // Step 2: Read approval and clear state TEAL programs
  printStep(2, 'Reading TEAL files...')
  const outDir = resolve(__dirname, 'out')
  const approvalProgram = readFileSync(resolve(outDir, 'RawCalculator.approval.teal'), 'utf-8')
  const clearStateProgram = readFileSync(resolve(outDir, 'RawCalculator.clear.teal'), 'utf-8')
  printSuccess('TEAL loaded')

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

  // Step 5: Deploy the contract via raw appCreate (no factory)
  printStep(5, 'Deploying contract via raw appCreate...')
  const result = await algorand.send.appCreate({
    sender: deployer.addr,
    approvalProgram,
    clearStateProgram,
  })
  const appId = result.appId
  assertGreaterThan(appId, 0n, 'appId > 0')
  printSuccess(`Contract deployed — App ID: ${appId}`)

  printHeader('All assertions passed!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
