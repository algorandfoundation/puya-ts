#!/usr/bin/env node
import { existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const examplesDir = resolve(__dirname, '..')
const distDir = resolve(examplesDir, '..', '..', 'dist')

if (!existsSync(distDir)) {
  console.error(`Error: ${distDir} does not exist. Run 'npm run build' from the repo root first.`)
  process.exit(1)
}

const exampleDir = process.argv[2]
if (!exampleDir) {
  console.error('Usage: node scripts/run-example.mjs <dir>')
  process.exit(1)
}

const entryPoint = resolve(examplesDir, exampleDir, 'index.ts')
if (!existsSync(entryPoint)) {
  console.error(`Error: ${entryPoint} does not exist.`)
  process.exit(1)
}

const tsconfigRun = resolve(examplesDir, 'tsconfig.run.json')

const result = spawnSync(
  'npx',
  ['tsx', '--tsconfig', tsconfigRun, entryPoint],
  {
    cwd: examplesDir,
    stdio: 'inherit',
    env: { ...process.env },
  },
)

process.exit(result.status ?? 1)
