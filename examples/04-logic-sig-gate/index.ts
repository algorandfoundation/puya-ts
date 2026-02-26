/**
 * Example 04: Logic Signature Gate — Deployment & Test Script
 *
 * Compiles the LogicSigGate smart signature with template variables,
 * funds its address, and sends a payment transaction signed by the
 * logic signature with a valid Ed25519 authority signature.
 *
 * Prerequisites: LocalNet
 */
import { AlgorandClient, AppManager } from '@algorandfoundation/algokit-utils'
import { ed25519Generator } from '@algorandfoundation/algokit-utils/crypto'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { compileContract, printHeader, printStep, printSuccess, assertDefined } from '../shared/utils'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function main() {
  printHeader('Example 04 — Logic Signature Gate')

  // Step 1: Compile the contract with TEAL output
  printStep(1, 'Compiling LogicSig with --output-teal...')
  compileContract('04-logic-sig-gate', { outputTeal: true })
  printSuccess('LogicSig compiled')

  // Step 2: Generate an Ed25519 authority keypair for signing notes
  printStep(2, 'Generating Ed25519 authority keypair...')
  const authority = ed25519Generator()
  printSuccess(`Authority public key: ${Buffer.from(authority.ed25519Pubkey).toString('hex').slice(0, 16)}...`)

  // Step 3: Read TEAL and substitute template variables
  printStep(3, 'Substituting template variables in TEAL...')
  const outDir = resolve(__dirname, 'out')
  const tealCode = readFileSync(resolve(outDir, 'LogicSigGate.teal'), 'utf-8')
  const maxFee = 10_000n
  const substituted = AppManager.replaceTealTemplateParams(tealCode, {
    TMPL_AUTHORITY_KEY: authority.ed25519Pubkey,
    TMPL_MAX_FEE: maxFee,
  })
  printSuccess('Template variables substituted')

  // Step 4: Connect to LocalNet and compile TEAL to bytecode
  printStep(4, 'Connecting to LocalNet & compiling TEAL to bytecode...')
  const algorand = AlgorandClient.defaultLocalNet()
  const compiled = await algorand.app.compileTeal(substituted)
  assertDefined(compiled.compiledBase64ToBytes, 'compiled bytecode')
  printSuccess('TEAL compiled to bytecode')

  // Step 5: Create and fund deployer account
  printStep(5, 'Creating deployer account...')
  const dispenser = await algorand.account.localNetDispenser()
  const deployer = algorand.account.random()
  await algorand.send.payment({
    sender: dispenser.addr,
    receiver: deployer.addr,
    amount: (10).algo(),
  })
  printSuccess(`Deployer funded: ${deployer.addr}`)

  // Step 6: Sign a note message with the authority key
  printStep(6, 'Signing note with authority key...')
  const noteMessage = new TextEncoder().encode('authorized-payment')
  const signature = await authority.rawEd25519Signer(noteMessage)
  printSuccess(`Signature: ${Buffer.from(signature).toString('hex').slice(0, 16)}...`)

  // Step 7: Create LogicSig account with the signature as program arg
  printStep(7, 'Creating LogicSig account...')
  const lsigAccount = algorand.account.logicsig(compiled.compiledBase64ToBytes, [signature])
  printSuccess(`LogicSig address: ${lsigAccount.addr}`)

  // Step 8: Fund the LogicSig address from the deployer
  printStep(8, 'Funding LogicSig address...')
  await algorand.send.payment({
    sender: deployer.addr,
    receiver: lsigAccount.addr,
    amount: (1).algo(),
  })
  printSuccess('LogicSig funded with 1 ALGO')

  // Step 9: Send a payment FROM the LogicSig address (the gate approves it)
  printStep(9, 'Sending payment from LogicSig address...')
  const result = await algorand.send.payment({
    sender: lsigAccount.addr,
    signer: lsigAccount.signer,
    receiver: deployer.addr,
    amount: (0.1).algo(),
    note: noteMessage,
  })
  assertDefined(result.txIds[0], 'transaction ID')
  printSuccess(`Payment sent — TxID: ${result.txIds[0]}`)

  printHeader('All assertions passed!')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
