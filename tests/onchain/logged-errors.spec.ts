import { describe, expect, it } from 'vitest'
import { compile, CompileOptions, processInputPaths } from '../../src'
import { LoggingContext, LogLevel } from '../../src/logger'
import { generateTempDir } from '../../src/util/generate-temp-file'
import { createArc4TestFixture } from './util/test-fixture'

describe('logged errors and asserts', () => {
  const test = createArc4TestFixture({
    paths: 'tests/approvals/logged-errors.algo.ts',
    contracts: ['LoggedErrorsValidContract'],
  })

  const testCases = [
    { arg: 1, expectedError: 'ERR:01' },
    { arg: 2, expectedError: 'ERR:02:arg is two' },
    { arg: 3, expectedError: 'AER:03' },
    { arg: 4, expectedError: 'AER:04:arg is 4' },
    { arg: 5, expectedError: 'ERR:05' },
    { arg: 6, expectedError: 'ERR:06:arg was 6' },
    { arg: 7, expectedError: 'AER:07' },
    { arg: 8, expectedError: 'AER:08:arg is eight (08)' },
  ]

  for (const { arg, expectedError } of testCases) {
    test(`arg ${arg} fails with ${expectedError}`, async ({ appClientLoggedErrorsValidContract }) => {
      await expect(appClientLoggedErrorsValidContract.send.call({ method: 'testValid', args: [arg] })).rejects.toThrow(expectedError)
    })
  }
})

describe('logged error and asserts', () => {
  it('emits expected warnings during compilation', async () => {
    using tempDir = generateTempDir()
    const logCtx = LoggingContext.create()

    await logCtx.run(async () => {
      const filePaths = processInputPaths({ paths: ['tests/approvals/logged-errors-warnings.algo.ts'], outDir: tempDir.dirPath })
      await compile(
        new CompileOptions({
          filePaths,
          logLevel: LogLevel.Warning,
        }),
      )
    })

    const warnings = logCtx.logEvents.filter((e) => e.level === LogLevel.Warning)

    const expectedWarnings = [
      'error code should be alphanumeric',
      'error code should be alphanumeric',
      'error code should be in camelCase',
      'error code should be in camelCase',
      'AER prefixed error messages are reserved for specific ARC errors',
      'AER prefixed error messages are reserved for specific ARC errors',
      'error message is 100 bytes long, consider making it shorter',
      'error message is 100 bytes long, consider making it shorter',
      'your final error message is 8 bytes long. Error messages exactly 8 or 32 bytes long are discouraged',
      'your final error message is 8 bytes long. Error messages exactly 8 or 32 bytes long are discouraged',
      'your final error message is 32 bytes long. Error messages exactly 8 or 32 bytes long are discouraged',
      'your final error message is 32 bytes long. Error messages exactly 8 or 32 bytes long are discouraged',
    ]

    const warningMessages = warnings.map((w) => w.message)

    // should be exactly the warnings described above
    expect(warningMessages).toHaveLength(expectedWarnings.length)
    for (const expected of expectedWarnings) {
      expect(warningMessages, `Expected warning: "${expected}"`).toContainEqual(expected)
    }
  })
})
