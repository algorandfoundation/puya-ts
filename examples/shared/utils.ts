import type { Arc56Contract } from '@algorandfoundation/algokit-utils/abi'
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, '..', '..')
const examplesDir = resolve(__dirname, '..')

// ─── Console Helpers ────────────────────────────────────────

export function printHeader(title: string): void {
  const line = '═'.repeat(50)
  console.log(`\n${line}`)
  console.log(`  ${title}`)
  console.log(`${line}\n`)
}

export function printStep(step: number, description: string): void {
  console.log(`  [Step ${step}] ${description}`)
}

export function printInfo(message: string): void {
  console.log(`  ℹ ${message}`)
}

export function printSuccess(message: string): void {
  console.log(`  ✓ ${message}`)
}

export function printError(message: string): void {
  console.error(`  ✗ ${message}`)
}

export function shortenAddress(address: string): string {
  if (address.length <= 12) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// ─── Assertions ─────────────────────────────────────────────

export function assertEqual<T>(actual: T, expected: T, label?: string): void {
  if (actual !== expected) {
    throw new Error(`Assertion failed${label ? ` (${label})` : ''}: expected ${String(expected)}, got ${String(actual)}`)
  }
}

export function assertDefined<T>(value: T | undefined | null, label?: string): asserts value is T {
  if (value === undefined || value === null) {
    throw new Error(`Assertion failed${label ? ` (${label})` : ''}: expected defined value, got ${String(value)}`)
  }
}

export function assertGreaterThan(actual: bigint | number, threshold: bigint | number, label?: string): void {
  if (!(actual > threshold)) {
    throw new Error(`Assertion failed${label ? ` (${label})` : ''}: expected ${String(actual)} > ${String(threshold)}`)
  }
}

// ─── Compilation & App Spec ─────────────────────────────────

export interface CompileContractOptions {
  outputBytecode?: boolean
  outputTeal?: boolean
}

export function compileContract(exampleDir: string, options?: CompileContractOptions): void {
  const contractPath = `examples/${exampleDir}/contract.algo.ts`
  const outDir = 'out'

  const flags = [
    '--output-arc56',
    options?.outputTeal ? '--output-teal' : '--no-output-teal',
    '--no-output-arc32',
    '--no-output-source-map',
  ]

  if (options?.outputBytecode) {
    flags.push('--output-bytecode')
  }

  const cmd = `node dist/bin/run-cli.mjs ${contractPath} --out-dir ${outDir} ${flags.join(' ')}`

  execSync(cmd, {
    cwd: repoRoot,
    stdio: 'pipe',
  })
}

export function loadAppSpec(outDir: string, contractName: string): Arc56Contract {
  const specPath = resolve(examplesDir, outDir, `${contractName}.arc56.json`)
  const content = readFileSync(specPath, 'utf-8')
  return JSON.parse(content) as Arc56Contract
}
