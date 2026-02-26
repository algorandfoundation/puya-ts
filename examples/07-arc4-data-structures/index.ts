/**
 * Example 07: ARC-4 Data Structures — Deployment & Test Script
 *
 * This script compiles, deploys, and tests the Arc4DataStructures contract on LocalNet.
 *
 * Features:
 * - App factory deployment with bare create
 * - exploreArrays: StaticArray/DynamicArray push/pop/concat
 * - exploreTuple: heterogeneous Tuple access
 * - exploreStruct: Struct creation and field access
 * - exploreEncodeDecode: encodeArc4/decodeArc4/sizeOf round-trips
 * - exploreUintVariants: Uint8/Uint16/Uint32/Uint64/Uint128/Uint<256>
 *
 * Prerequisites: LocalNet
 */
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { compileContract, loadAppSpec, printHeader, printStep, printSuccess, assertEqual } from '../shared/utils'

async function main() {
  printHeader('Example 07 — ARC4 Data Structures')

  // Step 1: Compile the contract
  printStep(1, 'Compiling contract...')
  compileContract('07-arc4-data-structures')
  printSuccess('Contract compiled')

  // Step 2: Load app spec
  printStep(2, 'Loading app spec...')
  const appSpec = loadAppSpec('07-arc4-data-structures/out', 'Arc4DataStructures')
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

  // Step 6: Call exploreArrays(1, 2, 3) → expect 3
  printStep(6, 'Calling exploreArrays(1, 2, 3)...')
  const r1 = await appClient.send.call({ method: 'exploreArrays', args: [1, 2, 3] })
  assertEqual(r1.return, 3n, 'exploreArrays(1, 2, 3)')
  printSuccess('exploreArrays(1, 2, 3) returned 3')

  // Step 7: Call exploreTuple(99) → expect 99
  printStep(7, 'Calling exploreTuple(99)...')
  const r2 = await appClient.send.call({ method: 'exploreTuple', args: [99] })
  assertEqual(r2.return, 99n, 'exploreTuple(99)')
  printSuccess('exploreTuple(99) returned 99')

  // Step 8: Call exploreStruct(10, 20) → expect defined return
  printStep(8, 'Calling exploreStruct(10, 20)...')
  const r3 = await appClient.send.call({ method: 'exploreStruct', args: [10, 20] })
  assertEqual(r3.return !== undefined, true, 'exploreStruct(10, 20) is defined')
  printSuccess('exploreStruct(10, 20) returned a value')

  // Step 9: Call exploreUintVariants(42) → returns bytes (verify no error)
  printStep(9, 'Calling exploreUintVariants(42)...')
  const r4 = await appClient.send.call({ method: 'exploreUintVariants', args: [42] })
  assertEqual(r4.return !== undefined, true, 'exploreUintVariants(42) is defined')
  printSuccess('exploreUintVariants(42) returned encoded bytes')

  // Step 10: Call exploreBasicTypes("hello", senderAddress) → expect "hello"
  printStep(10, 'Calling exploreBasicTypes("hello", senderAddress)...')
  const r5 = await appClient.send.call({ method: 'exploreBasicTypes', args: ['hello', deployer.addr] })
  assertEqual(r5.return, 'hello', 'exploreBasicTypes("hello", ...)')
  printSuccess('exploreBasicTypes("hello", ...) returned "hello"')

  // Step 11: Call exploreEncodeDecode(77, true) → returns bytes (verify no error)
  printStep(11, 'Calling exploreEncodeDecode(77, true)...')
  const r6 = await appClient.send.call({ method: 'exploreEncodeDecode', args: [77, true] })
  assertEqual(r6.return !== undefined, true, 'exploreEncodeDecode(77, true) is defined')
  printSuccess('exploreEncodeDecode(77, true) returned encoded bytes')

  printHeader('All assertions passed!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
