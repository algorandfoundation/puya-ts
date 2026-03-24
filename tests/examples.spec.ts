import fs from 'fs'
import { globSync } from 'glob'
import { rimraf } from 'rimraf'
import { describe, expect, it } from 'vitest'
import { gatherOutputStats } from '../scripts/gather-output-stats'
import { compile, CompileOptions, processInputPaths } from '../src'
import { isErrorOrCritical, LoggingContext, LogLevel } from '../src/logger'
import { AbsolutePath } from '../src/util/absolute-path'

describe('Examples', async () => {
  await rimraf('examples/puya-ts/out')

  const contractFiles = globSync('examples/puya-ts/**/*.algo.ts')
    .map((p) => AbsolutePath.resolve({ path: p }))
    .toSorted()
  describe.each([
    ['Unoptimized', 'out/unoptimized', { optimizationLevel: 0, outputAwstJson: true, outputAwst: true }],
    ['O1', 'out/o1', { optimizationLevel: 1 }],
    ['O2', 'out/o2', { optimizationLevel: 2 }],
  ])('Compile %s', async (desc, outDir, puyaOptions) => {
    const logCtx = LoggingContext.create()
    const result = await logCtx.run(() => {
      const filePaths = processInputPaths({ paths: ['examples/puya-ts'], outDir })
      return compile(
        new CompileOptions({
          filePaths,
          dryRun: false,
          logLevel: LogLevel.Warning,
          skipVersionCheck: true,
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
    })
    it.each(contractFiles)('%s', (contractFilePath) => {
      const awst = result.awst?.filter((s) => s.sourceLocation.file?.equals(contractFilePath))

      const errors = logCtx.logEvents.filter(
        (l) => (!l.sourceLocation || l.sourceLocation.file?.equals(contractFilePath)) && isErrorOrCritical(l.level),
      )
      if (errors.length === 0) {
        expect(errors.length).toBe(0)
      } else {
        expect.fail(`Errors: \n${errors.map((e) => e.message).join('\n')}`)
      }

      expect(awst, 'Contract file must produce awst').toBeDefined()
    })

    const stats = gatherOutputStats('examples/puya-ts')
    fs.mkdirSync('examples/puya-ts/out', { recursive: true })
    fs.writeFileSync('examples/puya-ts/out/stats.txt', stats, 'utf8')
  })
})
