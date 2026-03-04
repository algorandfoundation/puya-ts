/**
 * Example 06: Key-Value Store — Deployment & Test Script
 *
 * This script compiles, deploys, and tests the KeyValueStore contract on LocalNet.
 *
 * Features:
 * - App factory deployment with createApplication
 * - Box funding for MBR
 * - testBoxRoundTrip: create/write/read/delete single box
 * - setEntry/getEntry: BoxMap write and read with key prefix
 * - Byte-level equality assertion for Uint8Array returns
 *
 * Prerequisites: LocalNet
 */
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { compileContract, loadAppSpec, printHeader, printStep, printSuccess, assertEqual } from '../shared/utils'

function assertEqualBytes(actual: unknown, expected: Uint8Array, label?: string): void {
  if (!(actual instanceof Uint8Array) || actual.length !== expected.length || actual.some((v, i) => v !== expected[i])) {
    throw new Error(`Assertion failed${label ? ` (${label})` : ''}: expected ${String(expected)}, got ${String(actual)}`)
  }
}

async function main() {
  printHeader('Example 06 — Key-Value Store')

  // Step 1: Compile the contract
  printStep(1, 'Compiling contract...')
  compileContract('06-key-value-store')
  printSuccess('Contract compiled')

  // Step 2: Load app spec
  printStep(2, 'Loading app spec...')
  const appSpec = loadAppSpec('06-key-value-store/out', 'KeyValueStore')
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

  // Step 6: Fund app for box MBR
  printStep(6, 'Funding app with 1 ALGO for box MBR...')
  await appClient.fundAppAccount({ amount: (1).algo() })
  printSuccess('App funded')

  // Step 7: Call testBoxRoundTrip([1,2,3]) → expect true
  printStep(7, 'Calling testBoxRoundTrip([1,2,3])...')
  const r1 = await appClient.send.call({
    method: 'testBoxRoundTrip',
    args: [new Uint8Array([1, 2, 3])],
    boxReferences: ['single'],
  })
  assertEqual(r1.return, true, 'testBoxRoundTrip([1,2,3])')
  printSuccess('testBoxRoundTrip([1,2,3]) returned true')

  // Step 8: Call setEntry('k1', [4,5,6])
  printStep(8, "Calling setEntry('k1', [4,5,6])...")
  const data = new Uint8Array([4, 5, 6])
  await appClient.send.call({
    method: 'setEntry',
    args: ['k1', data],
    boxReferences: ['kv/k1'],
  })
  printSuccess("setEntry('k1', [4,5,6]) succeeded")

  // Step 9: Call getEntry('k1') → expect [4,5,6]
  printStep(9, "Calling getEntry('k1')...")
  const r2 = await appClient.send.call({
    method: 'getEntry',
    args: ['k1'],
    boxReferences: ['kv/k1'],
  })
  assertEqualBytes(r2.return, data, "getEntry('k1')")
  printSuccess("getEntry('k1') returned [4,5,6]")

  printHeader('All assertions passed!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
