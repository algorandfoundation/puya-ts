/**
 * Example 15: Inheritance Showcase — Deployment & Test Script
 *
 * This script deploys the InheritanceShowcase contract and tests abstract classes,
 * method overrides, super calls, and multi-level inheritance patterns.
 *
 * Prerequisites: LocalNet
 */
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { compileContract, loadAppSpec, printHeader, printStep, printSuccess, assertEqual } from '../shared/utils'

async function main() {
  printHeader('Example 15 — Inheritance Showcase')

  // Step 1: Compile the contract
  printStep(1, 'Compiling contract...')
  compileContract('15-inheritance-showcase')
  printSuccess('Contract compiled')

  // Step 2: Load app spec
  printStep(2, 'Loading app spec...')
  const appSpec = loadAppSpec('15-inheritance-showcase/out', 'InheritanceShowcase')
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

  // Step 6: Call getOwner()
  printStep(6, 'Calling getOwner()...')
  const r1 = await appClient.send.call({ method: 'getOwner' })
  assertEqual(r1.return, 'creator', 'getOwner() === "creator"')
  printSuccess('getOwner() returned "creator"')

  // Step 7: Call getLabel()
  printStep(7, 'Calling getLabel()...')
  const r2 = await appClient.send.call({ method: 'getLabel' })
  assertEqual(r2.return, 'initialized', 'getLabel() === "initialized"')
  printSuccess('getLabel() returned "initialized"')

  // Step 8: Call getVersion()
  printStep(8, 'Calling getVersion()...')
  const r3 = await appClient.send.call({ method: 'getVersion' })
  assertEqual(r3.return, 101n, 'getVersion() === 101n')
  printSuccess('getVersion() returned 101n')

  // Step 9: Call bumpAndGetVersion()
  printStep(9, 'Calling bumpAndGetVersion()...')
  const r4 = await appClient.send.call({ method: 'bumpAndGetVersion' })
  assertEqual(r4.return, 102n, 'bumpAndGetVersion() === 102n')
  printSuccess('bumpAndGetVersion() returned 102n')

  printHeader('All assertions passed!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
