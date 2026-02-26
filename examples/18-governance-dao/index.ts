/**
 * Example 18: Governance DAO — Deployment & Test Script
 *
 * This script compiles, deploys, and exercises the GovernanceDao contract on LocalNet.
 * It bootstraps the DAO, creates proposals, casts votes from two separate voters,
 * tallies results, and cleans up box storage.
 *
 * Accounts: deployer (creator), voter1, voter2
 *
 * Prerequisites: LocalNet
 */

import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { compileContract, loadAppSpec, printHeader, printStep, printSuccess, assertEqual } from '../shared/utils'

async function main() {
  printHeader('Example 18 — Governance DAO')

  // Step 1: Compile the contract
  printStep(1, 'Compiling contract...')
  compileContract('18-governance-dao')
  printSuccess('Contract compiled')

  // Step 2: Load app spec
  printStep(2, 'Loading app spec...')
  const appSpec = loadAppSpec('18-governance-dao/out', 'GovernanceDao')
  printSuccess('App spec loaded')

  // Step 3: Connect to LocalNet
  printStep(3, 'Connecting to LocalNet...')
  const algorand = AlgorandClient.defaultLocalNet()
  printSuccess('Connected to LocalNet')

  // Step 4: Create and fund deployer, voter1, and voter2 accounts
  printStep(4, 'Creating deployer, voter1, and voter2 accounts...')
  const dispenser = await algorand.account.localNetDispenser()
  const deployer = algorand.account.random()
  const voter1 = algorand.account.random()
  const voter2 = algorand.account.random()
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: deployer.addr,
    amount: (10).algo(),
  })
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: voter1.addr,
    amount: (10).algo(),
  })
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: voter2.addr,
    amount: (10).algo(),
  })
  printSuccess(`Deployer funded: ${deployer.addr}`)
  printSuccess(`Voter1 funded: ${voter1.addr}`)
  printSuccess(`Voter2 funded: ${voter2.addr}`)

  // Step 5: Deploy the contract and fund with 1 ALGO
  printStep(5, 'Deploying contract...')
  const factory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: deployer.addr,
  })
  const { appClient } = await factory.send.create({ method: 'createApplication' })
  await appClient.fundAppAccount({ amount: (1).algo() })
  printSuccess(`Contract deployed — App ID: ${appClient.appId}, funded with 1 ALGO`)

  // Step 6: Bootstrap the DAO (quorum=2, votingPeriod=1000)
  printStep(6, 'Bootstrapping DAO...')
  await appClient.send.call({
    method: 'bootstrap',
    args: [2, 1000],
    extraFee: (0.1).algo(),
  })
  printSuccess('DAO bootstrapped (quorum=2, votingPeriod=1000)')

  // Step 7: Propose — proposal box ref: 'p' (0x70) + uint64(0) as 8-byte big-endian
  printStep(7, 'Creating proposal...')
  const proposalBox = new Uint8Array([0x70, 0, 0, 0, 0, 0, 0, 0, 0])
  const proposeResult = await appClient.send.call({
    method: 'propose',
    args: ['Test'],
    boxReferences: [proposalBox],
  })
  assertEqual(proposeResult.return as bigint, 0n, 'propose returns 0')
  printSuccess('Proposal created — ID: 0')

  // Step 8: Voter1 votes yes — vote box ref: 'v' (0x76) + uint64(0) as 8 bytes + 32-byte voter public key
  printStep(8, 'Voter1 voting on proposal...')
  const voter1VoteBox = new Uint8Array(1 + 8 + 32)
  voter1VoteBox[0] = 0x76
  voter1VoteBox.set(voter1.addr.publicKey, 9)
  await appClient.send.call({
    method: 'vote',
    args: [0, true],
    sender: voter1.addr,
    boxReferences: [proposalBox, voter1VoteBox],
  })
  printSuccess('Voter1 cast vote (yes) on proposal 0')

  // Step 9: Voter2 votes yes — separate vote box for voter2
  printStep(9, 'Voter2 voting on proposal...')
  const voter2VoteBox = new Uint8Array(1 + 8 + 32)
  voter2VoteBox[0] = 0x76
  voter2VoteBox.set(voter2.addr.publicKey, 9)
  await appClient.send.call({
    method: 'vote',
    args: [0, true],
    sender: voter2.addr,
    boxReferences: [proposalBox, voter2VoteBox],
  })
  printSuccess('Voter2 cast vote (yes) on proposal 0')

  // Step 10: Tally — count proposals that met quorum (should be 1 now with 2 votes)
  printStep(10, 'Tallying proposals...')
  const tallyResult = await appClient.send.call({
    method: 'tally',
    boxReferences: [proposalBox],
    extraFee: (0.1).algo(),
  })
  assertEqual(tallyResult.return as bigint, 1n, 'tally returns 1 (quorum=2 met with 2 votes)')
  printSuccess('Tally complete — passing proposals: 1')

  // Step 11: Close — clean up box storage
  printStep(11, 'Closing DAO...')
  await appClient.send.call({
    method: 'close',
    boxReferences: [proposalBox, 'latest'],
    extraFee: (0.1).algo(),
  })
  printSuccess('DAO closed — boxes cleaned up')

  printHeader('All assertions passed!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
