import { sync } from 'cross-spawn'
import { rimraf } from 'rimraf'
import { describe, expect, it } from 'vitest'
import { compile } from '../src'
import { buildCompileOptions } from '../src/compile-options'
import { isErrorOrCritical, LoggingContext, LogLevel } from '../src/logger'
import { defaultPuyaOptions } from '../src/puya/options'
import { invariant } from '../src/util'
import { Environment } from './constants'

describe('Approvals', async () => {
  await rimraf('tests/approvals/out')

  using logCtx = LoggingContext.create()
  const result = compile(
    buildCompileOptions({
      outputAwstJson: true,
      outputAwst: true,
      paths: ['tests/approvals'],
      outDir: 'out/[name]',
      dryRun: false,
      logLevel: LogLevel.Warning,
    }),
    {
      ...defaultPuyaOptions,
      optimizationLevel: 0,
      outputTeal: true,
      outputArc32: true,
      outputArc56: true,
      outputSsaIr: true,
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
      expect.fail(
        `${generalErrorLogs.length} general errors during compilation. \nLogs: \n${generalErrorLogs.map((l) => `${l.level}: ${l.message}`).join('\n')}`,
      )
    }
  })

  describe.each(paths)('$path', ({ logs }) => {
    it('compiles without errors', () => {
      if (logs.length) {
        expect.fail(`${logs.length} errors during compilation`)
      }
    })
  })

  it('There should be no differences to committed changes', () => {
    if (Environment.IsCi) {
      // Run git add to force line ending changes
      sync('git', ['add', '.'], {
        stdio: 'inherit',
      })
    }
    const result = sync('git', ['status', '--porcelain'], {
      stdio: 'pipe',
    })

    expect(result.status).toBe(0)
    const diffs = []
    let line = ''
    for (const chunk of result.output) {
      if (chunk === undefined || chunk === null) continue
      const text = chunk.toString('utf-8')
      for (const c of text) {
        if (c === '\n') {
          diffs.push(line)
          line = ''
        } else {
          line += c
        }
      }
      if (line) diffs.push(line)

      if (diffs.length) {
        expect.fail(`There are uncommitted changes: \n\n${diffs.join('\n')}`)
      }
    }
  })
})
