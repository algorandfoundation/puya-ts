import { describe, expect, it } from 'vitest'
import { compile } from '../../src'
import ts from 'typescript'
import { SourceLocation } from '../../src/awst/source-location'
import type { LogEvent } from '../../src/logger'
import { logger, LogLevel } from '../../src/logger'
import { buildCompileOptions } from '../../src/compile-options'
import { invariant } from '../../src/util'

/**
 * Verify that specific code produces specific compiler output.
 *
 * Code files in `tests/expected-output/**` are parsed and comments which match the pattern of
 * // @expect-<level> message
 * are extracted. These patterns indicate that a particular log message is expected from the compiler at the next line.
 *
 * After compilation these expected logs are matched to actual output.
 *
 * All expected logs MUST be found in the output
 * All output logs MUST be expected
 *
 * The line numbers MUST match the line after the comment
 * The expected log level MUST match the observed log level
 * If the message ends in a `...` token, the observed log message MUST start with the expected log message (minus the `...`)
 * Otherwise the expected message MUST match the observed log message verbatim.
 *
 */
describe('Expected output', () => {
  logger.outputToConsole = false

  const result = compile(
    buildCompileOptions({
      outputAwstJson: false,
      outputAwst: false,
      paths: ['tests/expected-output'],
      outDir: '',
      dryRun: true,
      logLevel: LogLevel.Debug,
    }),
  )
  invariant(result.ast, 'Compilation must result in ast')
  const paths = Object.entries(result.ast ?? {}).map(([path, ast]) => ({
    path,
    ast,
    logs: result.logs.filter((l) => l.sourceLocation?.file === path && l.message !== 'AWST build failure. See previous errors'),
  }))

  describe.each(paths)('$path', ({ logs, ast }) => {
    it('has expected output', () => {
      const expectedLogs = extractExpectLogs(ast, result.programDirectory)
      const matchedLogs = new Set<LogEvent>()
      for (const expectedLog of expectedLogs) {
        const matchedLog = logs.find((l) => expectedLog.test(l))
        if (!matchedLog) {
          expect.fail(`${expectedLog.sourceLocation} Missing log: [${expectedLog.level}] ${expectedLog.message}`)
        } else {
          matchedLogs.add(matchedLog)
        }
      }
      const unmatchedLogs = logs.filter((l) => !matchedLogs.has(l))
      for (const unmatchedLog of unmatchedLogs) {
        console.error(`${unmatchedLog.sourceLocation} [${unmatchedLog.level}] ${unmatchedLog.message}`)
      }

      if (unmatchedLogs.length) {
        expect.fail('There are unmatched logs')
      }
    })
  })
})

type ExpectedLog = {
  level: LogEvent['level']
  message: string
  sourceLocation: SourceLocation
  test(log: LogEvent): boolean
}

function extractExpectLogs(sourceFile: ts.SourceFile, programDirectory: string) {
  const expectedLogs: ExpectedLog[] = []

  ts.visitNode(sourceFile, visit)
  // eslint-disable-next-line no-inner-declarations
  function visit(node: ts.Node): ts.Node {
    const commentRanges = ts.getLeadingCommentRanges(sourceFile.getFullText(), node.getFullStart())
    if (commentRanges?.length) {
      for (const commentRange of commentRanges) {
        const comment = sourceFile.getFullText().slice(commentRange.pos, commentRange.end)
        const match = /^\/\/ @expect-(\w+)\s+(.*)$/.exec(comment)
        if (match) {
          const level = match[1]
          const message = match[2]
          if (!['error', 'info', 'warn', 'debug', 'fatal'].includes(level)) {
            throw new Error(`Unexpected log level ${level} in @expect-* comment`)
          }
          const commentLocation = SourceLocation.fromTextRange(sourceFile, commentRange, programDirectory)
          expectedLogs.push({
            level: level as LogEvent['level'],
            message,
            sourceLocation: new SourceLocation({
              ...commentLocation,
              line: commentLocation.line + 1,
              endLine: commentLocation.endLine + 1,
            }),
            test(log) {
              if (log.level === this.level && log.sourceLocation?.line === this.sourceLocation.line) {
                if (this.message.endsWith('...')) {
                  return log.message.startsWith(this.message.slice(0, -3))
                } else {
                  return log.message === this.message
                }
              }
              return false
            },
          })
        }
      }
      return node
    }

    return ts.visitEachChild(node, visit, undefined)
  }
  return expectedLogs
}
