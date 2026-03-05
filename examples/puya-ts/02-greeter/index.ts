/**
 * Example 02: Greeter — Deployment & Test Script
 *
 * Deploys the Greeter contract to LocalNet and verifies string handling
 * with greet and greetTwo methods using template literals.
 *
 * Prerequisites: LocalNet
 */
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { compileContract, loadAppSpec, printHeader, printStep, printSuccess, assertEqual } from '../shared/utils'

async function main() {
  printHeader('Example 02 — Greeter')

  // Step 1: Compile the contract
  printStep(1, 'Compiling contract...')
  compileContract('02-greeter')
  printSuccess('Contract compiled')

  // Step 2: Load app spec
  printStep(2, 'Loading app spec...')
  const appSpec = loadAppSpec('02-greeter/out', 'Greeter')
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

  // Step 6: Call greet('World') → expect 'Hello, World!'
  printStep(6, "Calling greet('World')...")
  const r1 = await appClient.send.call({ method: 'greet', args: ['World'] })
  assertEqual(r1.return, 'Hello, World!', "greet('World')")
  printSuccess("greet('World') returned 'Hello, World!'")

  // Step 7: Call greetTwo('Alice', 'Bob') → expect 'Hello, Alice and Bob!'
  printStep(7, "Calling greetTwo('Alice', 'Bob')...")
  const r2 = await appClient.send.call({ method: 'greetTwo', args: ['Alice', 'Bob'] })
  assertEqual(r2.return, 'Hello, Alice and Bob!', "greetTwo('Alice', 'Bob')")
  printSuccess("greetTwo('Alice', 'Bob') returned 'Hello, Alice and Bob!'")

  printHeader('All assertions passed!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
