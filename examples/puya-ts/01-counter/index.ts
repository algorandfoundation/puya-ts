/**
 * Example 01: Counter — Deployment & Test Script
 *
 * Deploys the Counter contract to LocalNet and verifies increment, decrement,
 * multiply, and divide operations using uint64 arithmetic.
 *
 * Prerequisites: LocalNet
 */
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { compileContract, loadAppSpec, printHeader, printStep, printSuccess, assertEqual } from '../shared/utils'

async function main() {
  printHeader('Example 01 — Counter')

  // Step 1: Compile the contract
  printStep(1, 'Compiling contract...')
  compileContract('01-counter')
  printSuccess('Contract compiled')

  // Step 2: Load app spec
  printStep(2, 'Loading app spec...')
  const appSpec = loadAppSpec('01-counter/out', 'Counter')
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

  // Step 6: Call increment(5) → expect 5
  printStep(6, 'Calling increment(5)...')
  const r1 = await appClient.send.call({ method: 'increment', args: [5] })
  assertEqual(r1.return, 5n, 'increment(5)')
  printSuccess('increment(5) returned 5')

  // Step 7: Call increment(3) → expect 8
  printStep(7, 'Calling increment(3)...')
  const r2 = await appClient.send.call({ method: 'increment', args: [3] })
  assertEqual(r2.return, 8n, 'increment(3)')
  printSuccess('increment(3) returned 8')

  // Step 8: Call decrement(2) → expect 6
  printStep(8, 'Calling decrement(2)...')
  const r3 = await appClient.send.call({ method: 'decrement', args: [2] })
  assertEqual(r3.return, 6n, 'decrement(2)')
  printSuccess('decrement(2) returned 6')

  // Step 9: Call multiply(3) → expect 18
  printStep(9, 'Calling multiply(3)...')
  const r4 = await appClient.send.call({ method: 'multiply', args: [3] })
  assertEqual(r4.return, 18n, 'multiply(3)')
  printSuccess('multiply(3) returned 18')

  // Step 10: Call divide(2) → expect 9
  printStep(10, 'Calling divide(2)...')
  const r5 = await appClient.send.call({ method: 'divide', args: [2] })
  assertEqual(r5.return, 9n, 'divide(2)')
  printSuccess('divide(2) returned 9')

  printHeader('All assertions passed!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
