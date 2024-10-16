import { describe, expect, it } from 'vitest'
import { compile } from '../../src'
import { buildCompileOptions } from '../../src/compile-options'
import { isErrorOrCritical, LoggingContext, LogLevel } from '../../src/logger'
import { defaultPuyaOptions } from '../../src/puya/options'
import { invariant } from '../../src/util'

describe('Approvals', () => {
  using logCtx = LoggingContext.create()
  const result = compile(
    buildCompileOptions({
      outputAwstJson: false,
      outputAwst: false,
      paths: ['tests/approvals'],
      outDir: 'out',
      dryRun: false,
      logLevel: LogLevel.Debug,
    }),
    {
      ...defaultPuyaOptions,
      outputTeal: false,
      outputArc32: false,
    },
  )
  invariant(result.ast, 'Compilation must result in ast')
  const paths = Object.entries(result.ast ?? {}).map(([path, ast]) => ({
    path,
    ast,
    logs: logCtx.logEvents.filter((l) => l.sourceLocation?.file === path && isErrorOrCritical(l.level)),
  }))

  const generalErrorLogs = logCtx.logEvents.filter((l) => !l.sourceLocation && isErrorOrCritical(l.level))

  it('There should be no general error logs', () => {
    if (generalErrorLogs.length) {
      expect.fail(`${generalErrorLogs.length} general errors during compilation`)
    }
  })

  describe.each(paths)('$path', ({ logs }) => {
    it('compiles without errors', () => {
      if (logs.length) {
        expect.fail(`${logs.length} errors during compilation`)
      }
    })
  })
})
