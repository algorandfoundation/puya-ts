/**
 * Example 07: Array Playground — Deployment & Test Script
 *
 * This script compiles, deploys, and tests the ArrayPlayground contract on LocalNet.
 *
 * Features:
 * - App factory deployment with bare create
 * - exploreNativeArray: uint64[] literal, push, pop, at, for...of
 * - exploreFixedArray: FixedArray construction, indexing, .entries()
 * - exploreReferenceArray: ReferenceArray dynamic sizing, push, pop
 * - exploreClone: deep copy independence
 * - exploreUrange: urange(stop), urange(start, stop), urange(start, stop, step)
 * - exploreEntries: FixedArray .entries() index+value iteration
 *
 * Prerequisites: LocalNet
 */
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { compileContract, loadAppSpec, printHeader, printStep, printSuccess, assertEqual } from '../shared/utils'

async function main() {
  printHeader('Example 07 — Array Playground')

  // Step 1: Compile the contract
  printStep(1, 'Compiling contract...')
  compileContract('07-array-playground')
  printSuccess('Contract compiled')

  // Step 2: Load app spec
  printStep(2, 'Loading app spec...')
  const appSpec = loadAppSpec('07-array-playground/out', 'ArrayPlayground')
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

  // Step 6: Call exploreNativeArray(10, 20, 30) → expect 50 (0 + 20 + 30)
  printStep(6, 'Calling exploreNativeArray(10, 20, 30)...')
  const r1 = await appClient.send.call({ method: 'exploreNativeArray', args: [10, 20, 30] })
  assertEqual(r1.return, 50n, 'exploreNativeArray(10, 20, 30)')
  printSuccess('exploreNativeArray(10, 20, 30) returned 50')

  // Step 7: Call exploreFixedArray(5, 15) → expect 5 + 15 + 100 + 20 = 140
  printStep(7, 'Calling exploreFixedArray(5, 15)...')
  const r2 = await appClient.send.call({ method: 'exploreFixedArray', args: [5, 15] })
  assertEqual(r2.return, 140n, 'exploreFixedArray(5, 15)')
  printSuccess('exploreFixedArray(5, 15) returned 140')

  // Step 8: Call exploreReferenceArray(5) → expect 0+1+2+3 = 6 (pops last element 4)
  printStep(8, 'Calling exploreReferenceArray(5)...')
  const r3 = await appClient.send.call({ method: 'exploreReferenceArray', args: [5] })
  assertEqual(r3.return, 6n, 'exploreReferenceArray(5)')
  printSuccess('exploreReferenceArray(5) returned 6')

  // Step 9: Call exploreClone(7, 8) → expect 7
  printStep(9, 'Calling exploreClone(7, 8)...')
  const r4 = await appClient.send.call({ method: 'exploreClone', args: [7, 8] })
  assertEqual(r4.return, 7n, 'exploreClone(7, 8)')
  printSuccess('exploreClone(7, 8) returned 7')

  // Step 10: Call exploreUrange() → expect 18
  printStep(10, 'Calling exploreUrange()...')
  const r5 = await appClient.send.call({ method: 'exploreUrange' })
  assertEqual(r5.return, 18n, 'exploreUrange()')
  printSuccess('exploreUrange() returned 18')

  // Step 11: Call exploreEntries(10, 20, 30) → expect 60 (10+20+30)
  printStep(11, 'Calling exploreEntries(10, 20, 30)...')
  const r6 = await appClient.send.call({ method: 'exploreEntries', args: [10, 20, 30] })
  assertEqual(r6.return, 60n, 'exploreEntries(10, 20, 30)')
  printSuccess('exploreEntries(10, 20, 30) returned 60')

  printHeader('All assertions passed!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
