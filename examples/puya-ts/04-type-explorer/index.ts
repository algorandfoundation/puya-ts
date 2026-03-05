/**
 * Example 04: Type Explorer — Deployment & Test Script
 *
 * Deploys the TypeExplorer contract to LocalNet and verifies uint64 round-trips,
 * biguint square-root, and wide math operations.
 *
 * Prerequisites: LocalNet
 */
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { compileContract, loadAppSpec, printHeader, printStep, printSuccess, assertEqual } from '../shared/utils'

async function main() {
  printHeader('Example 04 — Type Explorer')

  // Step 1: Compile the contract
  printStep(1, 'Compiling contract...')
  compileContract('04-type-explorer')
  printSuccess('Contract compiled')

  // Step 2: Load app spec
  printStep(2, 'Loading app spec...')
  const appSpec = loadAppSpec('04-type-explorer/out', 'TypeExplorer')
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

  // Step 5: Deploy the contract (bare create — no createApplication method)
  printStep(5, 'Deploying contract...')
  const factory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: deployer.addr,
  })
  const { appClient } = await factory.send.bare.create()
  printSuccess(`Contract deployed — App ID: ${appClient.appId}`)

  // Step 6: Call exploreUint64(10, 20) → expect 30
  printStep(6, 'Calling exploreUint64(10, 20)...')
  const r1 = await appClient.send.call({ method: 'exploreUint64', args: [10, 20] })
  assertEqual(r1.return, 30n, 'exploreUint64(10, 20)')
  printSuccess('exploreUint64(10, 20) returned 30')

  // Step 7: Call exploreBigUint(25) → expect 25
  printStep(7, 'Calling exploreBigUint(25)...')
  const r2 = await appClient.send.call({ method: 'exploreBigUint', args: [25] })
  assertEqual(r2.return, 25n, 'exploreBigUint(25)')
  printSuccess('exploreBigUint(25) returned 25')

  // Step 8: Call exploreWideMath(3, 7) → expect 10
  printStep(8, 'Calling exploreWideMath(3, 7)...')
  const r3 = await appClient.send.call({ method: 'exploreWideMath', args: [3, 7] })
  assertEqual(r3.return, 10n, 'exploreWideMath(3, 7)')
  printSuccess('exploreWideMath(3, 7) returned 10')

  printHeader('All assertions passed!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
