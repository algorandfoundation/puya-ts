import { mkdtempSync, readdirSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { describe, expect, it } from 'vitest'
import { compile, CompileOptions, processInputPaths } from '../src'
import { isErrorOrCritical, LoggingContext, LogLevel } from '../src/logger'

describe('when compiling with the treatWarningsAsErrors flag set', async () => {
  it('fails compilation and logs an error when a warning would be emitted (in the backend)', async () => {
    const tempOut = mkdtempSync(join(tmpdir(), 'wae-test'))
    const logCtx = LoggingContext.create()
    await logCtx.run(() => {
      const filePaths = processInputPaths({ paths: ['tests/other/warn-as-errors/emit-warning-ir.algo.ts'], outDir: tempOut })
      return compile(
        new CompileOptions({
          filePaths,
          dryRun: false,
          logLevel: LogLevel.Warning,
          skipVersionCheck: true,
          // flag being tested
          treatWarningsAsErrors: true,
          outputSourceMap: false,
          outputAwstJson: false,
          outputAwst: false,
          outputTeal: true,
          outputArc32: false,
          outputArc56: false,
          outputSsaIr: false,
        }),
      )
    })

    // Expect at least one error log event due to -Werror upgrade
    const errors = logCtx.logEvents.filter((l) => isErrorOrCritical(l.level))
    if (errors.length === 0) {
      expect.fail('Expected compilation to error under -Werror, but no error log events were emitted.')
    }

    // ensure the cause of failure is because of -Werror
    expect(errors.map((e) => e.message)).toContain('assertion is always true, ignoring')

    // ensure nothing was written to the temp dir (compilation failed)
    expect(readdirSync(tempOut)).toHaveLength(0)
  })

  it('fails compilation and logs an error when a warning would be emitted (in the frontend)', async () => {
    const logCtx = LoggingContext.create()
    await logCtx.run(() => {
      const filePaths = processInputPaths({ paths: ['tests/other/warn-as-errors/emit-warning-awst.algo.ts'] })
      return compile(
        new CompileOptions({
          filePaths,
          dryRun: true,
          logLevel: LogLevel.Warning,
          skipVersionCheck: true,
          // flag being tested
          treatWarningsAsErrors: true,
          outputSourceMap: false,
          outputAwstJson: false,
          outputAwst: false,
          outputTeal: true,
          outputArc32: false,
          outputArc56: false,
          outputSsaIr: false,
        }),
      )
    })

    // Expect at least one error log event due to -Werror upgrade
    const errors = logCtx.logEvents.filter((l) => isErrorOrCritical(l.level))
    if (errors.length === 0) {
      expect.fail('Expected compilation to error under -Werror, but no error log events were emitted.')
    }

    // ensure the cause of failure is because of -Werror
    expect(errors.map((e) => e.message)).toContain('Duplicate on completion actions')

    // ensure compilation halted
    expect(logCtx.logEvents.some((l) => l.message?.includes('Compilation halted due to errors'))).toBe(true)
  })
})
