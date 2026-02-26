/**
 * Example 13: Contract Factory — Deployment & Test Script
 *
 * This script compiles, deploys, and tests the GreeterFactory contract on LocalNet.
 *
 * Features:
 * - Deploys GreeterFactory contract via typed app factory
 * - Tests deployManual — child deployment via compile() + manual inner txn
 * - Tests deployTyped — child deployment via compileArc4() + typed proxy
 * - Tests callChildGreet — contract-to-contract ABI call via abiCall()
 * - Tests callChildManual — manual c2c call via methodSelector + encodeArc4
 * - Tests inspectCompiled — readonly inspection of CompiledContract properties
 * - Tests deleteChild — child deletion via abiCall() with DeleteApplication
 *
 * Prerequisites: LocalNet
 */
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { compileContract, loadAppSpec, assertEqual, assertGreaterThan, printHeader, printStep, printSuccess } from '../shared/utils'

async function main() {
  printHeader('Example 13 — Contract Factory')

  // Step 1: Compile the contract
  printStep(1, 'Compiling contract...')
  compileContract('13-contract-factory')
  printSuccess('Contract compiled')

  // Step 2: Load app spec
  printStep(2, 'Loading app spec...')
  const appSpec = loadAppSpec('13-contract-factory/out', 'GreeterFactory')
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

  // Step 6: Fund app with 2 ALGO
  printStep(6, 'Funding app with 2 ALGO...')
  await appClient.fundAppAccount({ amount: (2).algo() })
  printSuccess('App funded')

  // Step 7: Call deployManual — deploys child contract via inner txn
  printStep(7, 'Calling deployManual...')
  const r1 = await appClient.send.call({
    method: 'deployManual',
    extraFee: (1).algo(),
  })
  const childAppId = r1.return as bigint
  assertGreaterThan(childAppId, 0n, 'childAppId > 0')
  printSuccess(`deployManual succeeded — childAppId: ${childAppId}`)

  // Step 8: Call callChildGreet — c2c call to child contract
  printStep(8, 'Calling callChildGreet...')
  const r2 = await appClient.send.call({
    method: 'callChildGreet',
    args: [childAppId, 'World'],
    extraFee: (1).algo(),
  })
  assertEqual(r2.return, 'hello World', 'callChildGreet return')
  printSuccess(`callChildGreet returned: ${r2.return}`)

  // Step 9: Call callChildManual — manual c2c call via methodSelector + encodeArc4
  printStep(9, 'Calling callChildManual...')
  const r3 = await appClient.send.call({
    method: 'callChildManual',
    args: [childAppId, 'Manual'],
    extraFee: (1).algo(),
  })
  assertEqual(r3.return, 'hello Manual', 'callChildManual return')
  printSuccess(`callChildManual returned: ${r3.return}`)

  // Step 10: Call deleteChild — deletes first child contract via inner txn
  printStep(10, 'Calling deleteChild on manual child...')
  await appClient.send.call({
    method: 'deleteChild',
    args: [childAppId],
    extraFee: (1).algo(),
  })
  printSuccess('deleteChild succeeded')

  // Step 11: Call deployTyped — deploys child via compileArc4() typed proxy
  printStep(11, 'Calling deployTyped...')
  const r4 = await appClient.send.call({
    method: 'deployTyped',
    extraFee: (1).algo(),
  })
  const typedChildAppId = r4.return as bigint
  assertGreaterThan(typedChildAppId, 0n, 'typedChildAppId > 0')
  printSuccess(`deployTyped succeeded — typedChildAppId: ${typedChildAppId}`)

  // Step 12: Call callChildGreet on typed child — greeting should be 'hi' (from deployTyped)
  printStep(12, 'Calling callChildGreet on typed child...')
  const r5 = await appClient.send.call({
    method: 'callChildGreet',
    args: [typedChildAppId, 'Typed'],
    extraFee: (1).algo(),
  })
  assertEqual(r5.return, 'hi Typed', 'callChildGreet typed return')
  printSuccess(`callChildGreet returned: ${r5.return}`)

  // Step 13: Call deleteChild — deletes typed child contract
  printStep(13, 'Calling deleteChild on typed child...')
  await appClient.send.call({
    method: 'deleteChild',
    args: [typedChildAppId],
    extraFee: (1).algo(),
  })
  printSuccess('deleteChild succeeded')

  // Step 14: Call inspectCompiled — readonly call to inspect CompiledContract properties
  printStep(14, 'Calling inspectCompiled...')
  const r6 = await appClient.send.call({
    method: 'inspectCompiled',
  })
  const extraPages = r6.return as bigint
  printSuccess(`inspectCompiled returned extraProgramPages: ${extraPages}`)

  printHeader('All assertions passed!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
