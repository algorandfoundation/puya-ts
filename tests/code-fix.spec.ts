import fs from 'fs'
import { describe, expect, it } from 'vitest'
import { compile, CompileOptions, LoggingContext, processInputPaths } from '../src'
import { LogLevel } from '../src/logger'
import { invariant, mkDirIfNotExists } from '../src/util'
import { applyEdits } from './code-fix/util/apply-edits'

describe('code-fixes', async () => {
  const filePaths = processInputPaths({ paths: ['tests/code-fix/*.algo.ts'] })

  mkDirIfNotExists('tests/code-fix/fixed')

  it.each(filePaths)('$sourceFile', async (algoFile) => {
    const logCtx = LoggingContext.create()
    const result = await logCtx.run(() => {
      return compile(
        new CompileOptions({
          filePaths: [algoFile],
          dryRun: true,
          logLevel: LogLevel.Info,
        }),
      )
    })

    const diagnostics = result.diagnostics?.[algoFile.sourceFile]
    invariant(diagnostics, 'There must be diagnostics')

    const newSymbols = diagnostics.codeFixes.flatMap((f) => f.requiredSymbols)
    const additionalEdits = diagnostics.imports.generateEdits(newSymbols)
    const fileText = fs.readFileSync(algoFile.sourceFile, 'utf8')

    const fixed = applyEdits(fileText, diagnostics.codeFixes.flatMap((f) => f.edits).concat(additionalEdits))
    fs.writeFileSync(algoFile.sourceFile.replace('/code-fix/', '/code-fix/fixed/'), fixed)
    expect(fixed).toBeTruthy()
  })
})
