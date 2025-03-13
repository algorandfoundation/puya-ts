import { describe, expect, it } from 'vitest'
import { compile, processInputPaths } from '../src'
import { LogEvent, LoggingContext, LogLevel } from '../src/logger'
import { CompileOptions } from '../src/options'
import { normalisePath } from '../src/util'

describe('Compile edge cases', () => {
  describe('string concatenation across files', () => {
    it('should compile contract with constant strings concatenation from different files', async () => {
      const path = normalisePath('tests/compile-edge-cases/concat-const-from-multiple-files', process.cwd())

      const logging = LoggingContext.create().enterContext()

      const result = await compile(
        new CompileOptions({
          filePaths: processInputPaths({ paths: [path], outDir: 'out' }),
          dryRun: true,
        }),
      )

      const errorLogs = logging.logEvents.filter((event: LogEvent) => event.level === LogLevel.Error)
      expect(errorLogs.length).toBe(0)

      const locationError = logging.logEvents.some((event: LogEvent) => event.message.includes('All locations must of the same file'))
      expect(locationError).toBe(false)

      expect(result.awst).toBeDefined()
    })
  })
})
