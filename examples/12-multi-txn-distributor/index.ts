/**
 * Example 12: Multi-Txn Distributor — Deployment & Test Script
 *
 * This script compiles, deploys, and tests the MultiTxnDistributor contract on LocalNet.
 *
 * Features:
 * - Deploys MultiTxnDistributor contract via typed app factory
 * - Tests distributePair with grouped payment inner transactions
 * - Tests verifyGroupPayments with manually constructed outer group
 *
 * Prerequisites: LocalNet
 */
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { compileContract, loadAppSpec, printHeader, printStep, printSuccess } from '../shared/utils'

async function main() {
  printHeader('Example 12 — Multi-Txn Distributor')

  // Step 1: Compile the contract
  printStep(1, 'Compiling contract...')
  compileContract('12-multi-txn-distributor')
  printSuccess('Contract compiled')

  // Step 2: Load app spec
  printStep(2, 'Loading app spec...')
  const appSpec = loadAppSpec('12-multi-txn-distributor/out', 'MultiTxnDistributor')
  printSuccess('App spec loaded')

  // Step 3: Connect to LocalNet
  printStep(3, 'Connecting to LocalNet...')
  const algorand = AlgorandClient.defaultLocalNet()
  printSuccess('Connected to LocalNet')

  // Step 4: Create and fund deployer + recipient accounts
  printStep(4, 'Creating deployer, recipientA, recipientB accounts...')
  const dispenser = await algorand.account.localNetDispenser()
  const deployer = algorand.account.random()
  const recipientA = algorand.account.random()
  const recipientB = algorand.account.random()
  await algorand.send.payment({ sender: dispenser.addr, receiver: deployer.addr, amount: (10).algo() })
  await algorand.send.payment({ sender: dispenser.addr, receiver: recipientA.addr, amount: (10).algo() })
  await algorand.send.payment({ sender: dispenser.addr, receiver: recipientB.addr, amount: (10).algo() })
  printSuccess(`Deployer funded: ${deployer.addr}`)
  printSuccess(`RecipientA funded: ${recipientA.addr}`)
  printSuccess(`RecipientB funded: ${recipientB.addr}`)

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

  // Step 7: Test distributePair — send payment to app + call with two recipients
  printStep(7, 'Calling distributePair...')
  const r1 = await appClient.send.call({
    method: 'distributePair',
    args: [
      algorand.createTransaction.payment({
        sender: deployer.addr,
        receiver: appClient.appAddress,
        amount: (1).algo(),
      }),
      recipientA.addr,
      recipientB.addr,
    ],
    extraFee: (1).algo(),
  })
  printSuccess(`distributePair succeeded — txId: ${r1.transaction.txId()}`)

  // Step 8: Test verifyGroupPayments — build group with preceding payment + app call
  printStep(8, 'Calling verifyGroupPayments via group...')
  const call = await appClient.createTransaction.call({
    method: 'verifyGroupPayments',
  })
  await algorand
    .newGroup()
    .addPayment({
      sender: deployer.addr,
      receiver: deployer.addr,
      amount: (0).algo(),
    })
    .addTransaction(call.transactions[0])
    .send()
  printSuccess('verifyGroupPayments succeeded')

  printHeader('All assertions passed!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
