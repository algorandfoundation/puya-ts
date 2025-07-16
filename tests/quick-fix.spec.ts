import fs from 'fs'
import { describe, expect, it } from 'vitest'
import { compile, CompileOptions, LoggingContext, processInputPaths } from '../src'
import { LogLevel } from '../src/logger'
import { getQuickFixes } from '../src/quick-fix'
import { applyEdits } from './quick-fix/util/apply-edits'

describe('quick-fixes', async () => {
  const filePaths = processInputPaths({ paths: ['tests/quick-fix/*.algo.ts'] })
  fs.mkdirSync('tests/quick-fix/fixed')

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

    const quickFixes = getQuickFixes()

    const fileText = fs.readFileSync(algoFile.sourceFile, 'utf8')

    const fixed = applyEdits(
      fileText,
      quickFixes.flatMap((f) => f.edits),
    )
    fs.writeFileSync(algoFile.sourceFile.replace('/quick-fix/', '/quick-fix/fixed/'), fixed)
    expect(fixed).toBeTruthy()
  })
})
