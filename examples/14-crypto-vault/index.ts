/**
 * Example 14: Crypto Vault — Deployment & Test Script
 *
 * This script deploys the CryptoVault contract and tests hash functions,
 * Ed25519 signature verification, scratch space operations, and preimage checks.
 *
 * Features:
 * - Deploys CryptoVault with a SHA-256 commitment
 * - Tests scratchCounter uint64 scratch round-trip
 * - Tests checkPreimage with valid and invalid preimages
 * - Tests hashShowcase concatenated hash output
 * - Tests verifyAndUnlock with Ed25519 signature
 *
 * Prerequisites: LocalNet
 */
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import crypto from 'node:crypto'
import { compileContract, loadAppSpec, printHeader, printStep, printSuccess, assertEqual } from '../shared/utils'

async function main() {
  printHeader('Example 14 — Crypto Vault')

  // Step 1: Compile the contract
  printStep(1, 'Compiling contract...')
  compileContract('14-crypto-vault')
  printSuccess('Contract compiled')

  // Step 2: Load app spec
  printStep(2, 'Loading app spec...')
  const appSpec = loadAppSpec('14-crypto-vault/out', 'CryptoVault')
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

  // Step 5: Deploy the contract with commitment arg
  printStep(5, 'Deploying contract...')
  const factory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: deployer.addr,
  })
  const { appClient } = await factory.send.create({
    method: 'createApplication',
    args: [new Uint8Array([1, 2, 3, 4])],
  })
  printSuccess(`Contract deployed — App ID: ${appClient.appId}`)

  // Step 6: Call scratchCounter(42) with extraFee
  printStep(6, 'Calling scratchCounter(42)...')
  const r1 = await appClient.send.call({
    method: 'scratchCounter',
    args: [42],
    extraFee: (0.1).algo(),
  })
  assertEqual(r1.return, 84n, 'scratchCounter(42) === 84n')
  printSuccess('scratchCounter(42) returned 84n')

  // Step 7: Call checkPreimage([1,2,3,4]) — valid preimage
  printStep(7, 'Calling checkPreimage([1,2,3,4])...')
  const r2 = await appClient.send.call({
    method: 'checkPreimage',
    args: [new Uint8Array([1, 2, 3, 4])],
  })
  assertEqual(r2.return, true, 'checkPreimage([1,2,3,4]) === true')
  printSuccess('checkPreimage([1,2,3,4]) returned true')

  // Step 8: Call checkPreimage([5,6,7,8]) — invalid preimage
  printStep(8, 'Calling checkPreimage([5,6,7,8])...')
  const r3 = await appClient.send.call({
    method: 'checkPreimage',
    args: [new Uint8Array([5, 6, 7, 8])],
  })
  assertEqual(r3.return, false, 'checkPreimage([5,6,7,8]) === false')
  printSuccess('checkPreimage([5,6,7,8]) returned false')

  // Step 9: Call hashShowcase([10,20,30]) with extraFee
  printStep(9, 'Calling hashShowcase([10,20,30])...')
  const r4 = await appClient.send.call({
    method: 'hashShowcase',
    args: [new Uint8Array([10, 20, 30])],
    extraFee: (0.1).algo(),
  })
  assertEqual(r4.return !== undefined, true, 'hashShowcase([10,20,30]) is defined')
  printSuccess('hashShowcase([10,20,30]) returned a value')

  // Step 10: Fund app account for OpUpFeeSource.AppAccount, then call verifyAndUnlock
  printStep(10, 'Testing verifyAndUnlock with Ed25519 signature...')
  await algorand.send.payment({
    sender: deployer.addr,
    receiver: appClient.appAddress,
    amount: (1).algo(),
  })
  const { publicKey, privateKey } = crypto.generateKeyPairSync('ed25519')
  const data = new Uint8Array([72, 101, 108, 108, 111]) // "Hello"
  const signature = crypto.sign(null, data, privateKey)
  const rawPubKey = publicKey.export({ type: 'spki', format: 'der' }).subarray(-32)
  const r5 = await appClient.send.call({
    method: 'verifyAndUnlock',
    args: [data, new Uint8Array(signature), new Uint8Array(rawPubKey)],
    extraFee: (0.1).algo(),
  })
  assertEqual(r5.return, true, 'verifyAndUnlock === true')
  printSuccess('verifyAndUnlock returned true')

  printHeader('All assertions passed!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
