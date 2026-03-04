/**
 * Example 05: Membership Registry — Deployment & Test Script
 *
 * This script compiles, deploys, and tests the MembershipRegistry contract on LocalNet.
 *
 * Features:
 * - App factory deployment with createApplication
 * - Opt-in via register()
 * - getMemberInfo read call with Account argument
 * - isMemberInGoodStanding validation
 * - Close-out via deregister()
 *
 * Prerequisites: LocalNet
 */
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { compileContract, loadAppSpec, printHeader, printStep, printSuccess, assertEqual, assertGreaterThan } from '../shared/utils'

async function main() {
  printHeader('Example 05 — Membership Registry')

  // Step 1: Compile the contract
  printStep(1, 'Compiling contract...')
  compileContract('05-membership-registry')
  printSuccess('Contract compiled')

  // Step 2: Load app spec
  printStep(2, 'Loading app spec...')
  const appSpec = loadAppSpec('05-membership-registry/out', 'MembershipRegistry')
  printSuccess('App spec loaded')

  // Step 3: Connect to LocalNet
  printStep(3, 'Connecting to LocalNet...')
  const algorand = AlgorandClient.defaultLocalNet()
  printSuccess('Connected to LocalNet')

  // Step 4: Create and fund deployer and member accounts
  printStep(4, 'Creating deployer and member accounts...')
  const dispenser = await algorand.account.localNetDispenser()
  const deployer = algorand.account.random()
  const member = algorand.account.random()
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: deployer.addr,
    amount: (10).algo(),
  })
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: member.addr,
    amount: (10).algo(),
  })
  printSuccess(`Deployer funded: ${deployer.addr}`)
  printSuccess(`Member funded: ${member.addr}`)

  // Step 5: Deploy the contract
  printStep(5, 'Deploying contract...')
  const factory = algorand.client.getAppFactory({
    appSpec,
    defaultSender: deployer.addr,
  })
  const { appClient } = await factory.send.create({ method: 'createApplication' })
  printSuccess(`Contract deployed — App ID: ${appClient.appId}`)

  // Step 6: Opt in via register() as member
  printStep(6, 'Calling optIn.register() as member...')
  await appClient.send.optIn({ method: 'register', sender: member.addr })
  printSuccess('Member opted in successfully')

  // Step 7: Call getMemberInfo and assert joinedAtRound > 0
  printStep(7, 'Calling getMemberInfo...')
  const info = await appClient.send.call({ method: 'getMemberInfo', args: [member.addr] })
  const memberInfo = info.return as { joinedAtRound: bigint; balanceAtJoin: bigint; currentBalance: bigint; currentMinBalance: bigint }
  assertGreaterThan(memberInfo.joinedAtRound, 0n, 'joinedAtRound > 0')
  printSuccess(`getMemberInfo — joinedAtRound: ${memberInfo.joinedAtRound}`)

  // Step 8: Call isMemberInGoodStanding and assert true
  printStep(8, 'Calling isMemberInGoodStanding...')
  const standing = await appClient.send.call({ method: 'isMemberInGoodStanding', args: [member.addr] })
  assertEqual(standing.return, true, 'isMemberInGoodStanding')
  printSuccess('Member is in good standing')

  // Step 9: Close out via deregister() as member
  printStep(9, 'Calling closeOut.deregister() as member...')
  await appClient.send.closeOut({ method: 'deregister', sender: member.addr })
  printSuccess('Member closed out successfully')

  printHeader('All assertions passed!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
