/**
 * Example 14: Event Logger — Deployment & Test Script
 *
 * This script compiles, deploys, and tests the EventLogger contract on LocalNet.
 *
 * Features:
 * - Deploys EventLogger contract via typed app factory
 * - Tests logTransfer — emit Transfer struct event (arc4.Struct)
 * - Tests logApproval — emit Approval typed named event (emit<T>)
 * - Tests logDeposit — emit Deposit event with positional args
 * - Tests logWithdrawal — emit Withdrawal event with explicit ARC-28 signature
 * - Tests logStatusChange — emit StatusChanged event with mixed types (Str, Uint8)
 * - Tests logBatch — emit multiple events in a single call
 *
 * Prerequisites: LocalNet
 */
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { compileContract, loadAppSpec, printHeader, printStep, printSuccess, assertEqual } from '../shared/utils'

async function main() {
  printHeader('Example 14 — Event Logger')

  // Step 1: Compile the contract
  printStep(1, 'Compiling contract...')
  compileContract('14-event-logger')
  printSuccess('Contract compiled')

  // Step 2: Load app spec
  printStep(2, 'Loading app spec...')
  const appSpec = loadAppSpec('14-event-logger/out', 'EventLogger')
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

  // Step 6: Call logTransfer(1, 2, 100)
  printStep(6, 'Calling logTransfer(1, 2, 100)...')
  const r1 = await appClient.send.call({ method: 'logTransfer', args: [1, 2, 100] })
  assertEqual(r1 !== undefined, true, 'logTransfer result defined')
  printSuccess('logTransfer succeeded')

  // Step 7: Call logApproval(1, 2, 50)
  printStep(7, 'Calling logApproval(1, 2, 50)...')
  const r2 = await appClient.send.call({ method: 'logApproval', args: [1, 2, 50] })
  assertEqual(r2 !== undefined, true, 'logApproval result defined')
  printSuccess('logApproval succeeded')

  // Step 8: Call logDeposit(1, 500)
  printStep(8, 'Calling logDeposit(1, 500)...')
  const r3 = await appClient.send.call({ method: 'logDeposit', args: [1, 500] })
  assertEqual(r3 !== undefined, true, 'logDeposit result defined')
  printSuccess('logDeposit succeeded')

  // Step 9: Call logWithdrawal(1, 200)
  printStep(9, 'Calling logWithdrawal(1, 200)...')
  const r4 = await appClient.send.call({ method: 'logWithdrawal', args: [1, 200] })
  assertEqual(r4 !== undefined, true, 'logWithdrawal result defined')
  printSuccess('logWithdrawal succeeded')

  // Step 10: Call logStatusChange('activated', 1)
  printStep(10, 'Calling logStatusChange("activated", 1)...')
  const r5 = await appClient.send.call({ method: 'logStatusChange', args: ['activated', 1] })
  assertEqual(r5 !== undefined, true, 'logStatusChange result defined')
  printSuccess('logStatusChange succeeded')

  // Step 11: Call logBatch(1, 2, 100)
  printStep(11, 'Calling logBatch(1, 2, 100)...')
  const r6 = await appClient.send.call({ method: 'logBatch', args: [1, 2, 100] })
  assertEqual(r6 !== undefined, true, 'logBatch result defined')
  printSuccess('logBatch succeeded')

  printHeader('All assertions passed!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
