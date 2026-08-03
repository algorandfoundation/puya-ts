import fs from 'fs'
import os from 'os'
import path from 'path'
import { afterAll, describe, expect, it } from 'vitest'
import { compile, CompileOptions, LoggingContext } from '../src'
import { Contract, LogicSignature } from '../src/awst/nodes'
import { LogLevel } from '../src/logger'
import { AbsolutePath } from '../src/util/absolute-path'

/**
 * TODO: support autosalt in puya backend
 */

describe('autosalt compiled output', async () => {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'puya-ts-autosalt-'))
  afterAll(() => fs.rmSync(outDir, { recursive: true, force: true }))

  const logCtx = LoggingContext.create()
  const result = await logCtx.run(() =>
    compile(
      new CompileOptions({
        filePaths: [
          {
            sourceFile: AbsolutePath.resolve({ path: 'tests/approvals/autosalt.algo.ts' }),
            outDir: AbsolutePath.resolve({ path: outDir }),
          },
        ],
        dryRun: false,
        logLevel: LogLevel.Warning,
        skipVersionCheck: true,
        outputTeal: true,
        outputBytecode: true,
      }),
    ),
  )

  // program name → whether its emitted TEAL should carry `#pragma autosalt true`.
  // Salting is on by default for logic signatures only.
  const programs = {
    DefaultSig: true,
    NoSaltSig: false,
    ForceSaltSig: true,
    'DefaultContract.approval': false,
    'DefaultContract.clear': false,
    'UnsaltedContract.approval': false,
    'UnsaltedContract.clear': false,
    'SaltedContract.approval': true,
    'SaltedContract.clear': true,
  }
  const readOutput = (name: string, ext: string) => fs.readFileSync(path.join(outDir, `${name}.${ext}`))

  it('compiles without errors', () => {
    expect(logCtx.logEvents.filter((l) => l.level === LogLevel.Error || l.level === LogLevel.Critical)).toEqual([])
  })

  it('threads the option onto the awst, defaulting to null', () => {
    const logicSigs = result.awst!.filter((n) => n instanceof LogicSignature)
    expect(Object.fromEntries(logicSigs.map((s) => [s.shortName, s.autosalt]))).toEqual({
      DefaultSig: null,
      NoSaltSig: false,
      ForceSaltSig: true,
    })
    const contracts = result.awst!.filter((n) => n instanceof Contract)
    expect(Object.fromEntries(contracts.map((c) => [c.name, c.autosalt]))).toEqual({
      DefaultContract: null,
      UnsaltedContract: false,
      SaltedContract: true,
    })
  })

  it('emits `#pragma autosalt true` for exactly the salted programs', () => {
    for (const [name, salted] of Object.entries(programs)) {
      const teal = readOutput(name, 'teal').toString('utf8')
      expect(teal.includes('#pragma autosalt true'), name).toBe(salted)
    }
  })
})
