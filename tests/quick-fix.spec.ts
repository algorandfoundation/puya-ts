import { describe, it } from 'vitest'
import { compile, CompileOptions, LoggingContext, processInputPaths } from '../src'
import { LogLevel } from '../src/logger'
import { invariant } from '../src/util'

describe('quick-fixes', async () => {
  const filePaths = processInputPaths({ paths: ['tests/quick-fix'] })

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
    invariant(result.ast, 'Compilation must result in ast')
  })
})
