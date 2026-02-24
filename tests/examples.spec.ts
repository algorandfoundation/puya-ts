import { globSync } from 'glob'
import { describe, expect, it } from 'vitest'
import { compile, CompileOptions, processInputPaths } from '../src'
import { isErrorOrCritical, LoggingContext, LogLevel } from '../src/logger'
import { AbsolutePath } from '../src/util/absolute-path'

describe('Examples', async () => {
  const exampleDirs = globSync('examples/[0-9][0-9]-*/').toSorted()

  const contractFiles = globSync('examples/[0-9][0-9]-*/**/*.algo.ts')
    .map((p) => AbsolutePath.resolve({ path: p }))
    .toSorted()

  const logCtx = LoggingContext.create()
  await logCtx.run(() => {
    const filePaths = processInputPaths({ paths: exampleDirs, outDir: 'out/[name]' })
    return compile(
      new CompileOptions({
        filePaths,
        logLevel: LogLevel.Warning,
        skipVersionCheck: true,
        outputSourceMap: false,
      }),
    )
  })

  it.each(contractFiles)('%s', (contractFilePath) => {
    const errors = logCtx.logEvents.filter(
      (l) => (!l.sourceLocation || l.sourceLocation.file?.equals(contractFilePath)) && isErrorOrCritical(l.level),
    )
    if (errors.length === 0) {
      expect(errors.length).toBe(0)
    } else {
      expect.fail(`Errors: \n${errors.map((e) => e.message).join('\n')}`)
    }
  })
})
