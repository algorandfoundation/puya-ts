/**
 * Example 08: Object Tuples — Deployment & Test Script
 *
 * This script compiles, deploys, and tests the ObjectTuples contract on LocalNet.
 *
 * Features:
 * - Deploys ObjectTuples contract via typed app factory
 * - Tests object params and return values (add, destructureExample)
 * - Tests free subroutine with destructured object param (magnitudeSquared)
 *
 * Prerequisites: LocalNet
 */
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { compileContract, loadAppSpec, printHeader, printStep, printSuccess, assertEqual } from '../shared/utils'

async function main() {
  printHeader('Example 08 — Object Tuples')

  // Step 1: Compile the contract
  printStep(1, 'Compiling contract...')
  compileContract('08-object-tuples')
  printSuccess('Contract compiled')

  // Step 2: Load app spec
  printStep(2, 'Loading app spec...')
  const appSpec = loadAppSpec('08-object-tuples/out', 'ObjectTuples')
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

  // Step 6: Call add([3, 4], [1, 2]) → expect { x: 4, y: 6 }
  printStep(6, 'Calling add([3, 4], [1, 2])...')
  const r1 = await appClient.send.call({
    method: 'add',
    args: [
      [3, 4],
      [1, 2],
    ],
  })
  const addResult = r1.return as { x: bigint; y: bigint }
  assertEqual(addResult.x, 4n, 'add result x')
  assertEqual(addResult.y, 6n, 'add result y')
  printSuccess('add([3, 4], [1, 2]) returned { x: 4, y: 6 }')

  // Step 7: Call destructureExample([10, 20]) → expect 30
  printStep(7, 'Calling destructureExample([10, 20])...')
  const r2 = await appClient.send.call({ method: 'destructureExample', args: [[10, 20]] })
  assertEqual(r2.return, 30n, 'destructureExample([10, 20])')
  printSuccess('destructureExample([10, 20]) returned 30')

  // Step 8: Call magnitudeSquared([3, 4]) → expect 25
  printStep(8, 'Calling magnitudeSquared([3, 4])...')
  const r3 = await appClient.send.call({ method: 'magnitudeSquared', args: [[3, 4]] })
  assertEqual(r3.return, 25n, 'magnitudeSquared([3, 4])')
  printSuccess('magnitudeSquared([3, 4]) returned 25')

  printHeader('All assertions passed!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
