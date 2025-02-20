import { globSync } from 'glob'
import { rimraf } from 'rimraf'
import { describe, expect, it } from 'vitest'
import { compile } from '../src'
import { isErrorOrCritical, LoggingContext, LogLevel } from '../src/logger'
import { defaultPuyaOptions } from '../src/puya/options'
import { normalisePath } from '../src/util'
import { invokeCli } from '../src/util/invoke-cli'

describe('Approvals', async () => {
  await rimraf('tests/approvals/out')

  const contractFiles = globSync('tests/approvals/*.algo.ts')
    .map((p) => normalisePath(p, process.cwd()))
    .toSorted()
  describe.each([
    ['Unoptimized', 'out/unoptimized/[name]', { optimizationLevel: 0, outputAwstJson: true, outputAwst: true }],
    ['O1', 'out/o1/[name]', { optimizationLevel: 1 }],
    ['O2', 'out/o2/[name]', { optimizationLevel: 2 }],
  ])('Compile %s', async (desc, outDir, puyaOptions) => {
    const logCtx = LoggingContext.create()
    const result = await logCtx.run(() =>
      compile({
        paths: ['tests/approvals'],
        outDir,
        dryRun: false,
        logLevel: LogLevel.Warning,
        skipVersionCheck: true,
        ...defaultPuyaOptions,
        outputSourceMap: false,
        outputAwstJson: false,
        outputAwst: false,
        outputTeal: true,
        outputArc32: true,
        outputArc56: true,
        outputSsaIr: true,
        ...puyaOptions,
      }),
    )
    it.each(contractFiles)('%s', (contractFilePath) => {
      const awst = result.awst?.filter((s) => s.sourceLocation.file === contractFilePath)

      const errors = logCtx.logEvents.filter(
        (l) => (!l.sourceLocation || l.sourceLocation.file === contractFilePath) && isErrorOrCritical(l.level),
      )
      if (errors.length === 0) {
        expect(errors.length).toBe(0)
      } else {
        expect.fail(`Errors: \n${errors.map((e) => e.message).join('\n')}`)
      }

      expect(awst, 'Contract file must produce awst').toBeDefined()
    })
  })

  it('There should be no differences to committed changes', async () => {
    const result = await invokeCli({
      command: 'git',
      args: ['status', '--porcelain'],
    })
    const diffs = result.lines

    if (diffs.length) {
      expect.fail(
        `There are uncommitted changes: \n\n${diffs.slice(0, 5).join('\n')}${diffs.length > 5 ? `\n +${diffs.length - 5} more` : ''}`,
      )
    }
  })
})
