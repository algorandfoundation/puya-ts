import ts from 'typescript'
import { describe, it } from 'vitest'
import { compile } from '../src'
import { SourceLocation } from '../src/awst/source-location'
import { buildCompileOptions } from '../src/compile-options'
import type { LogEvent } from '../src/logger'
import { LoggingContext, LogLevel } from '../src/logger'
import { defaultPuyaOptions } from '../src/puya/options'
import { enumFromValue, invariant } from '../src/util'

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
  using logCtx = LoggingContext.create()
  const result = compile(
    buildCompileOptions({
      outputAwstJson: false,
      outputAwst: false,
      paths: ['tests/expected-output'],
      outDir: '',
      dryRun: true,
      logLevel: LogLevel.Debug,
    }),
    defaultPuyaOptions,
  )
  invariant(result.ast, 'Compilation must result in ast')
  const paths = Object.entries(result.ast ?? {}).map(([path, ast]) => ({
    path,
    ast,
    logs: logCtx.logEvents.filter((l) => l.sourceLocation?.file === path && l.message !== 'AWST build failure. See previous errors'),
  }))

  describe.each(paths)('$path', ({ logs, ast }) => {
    it('has expected output', () => {
      const expectedLogs = extractExpectLogs(ast, result.programDirectory)
      const matchedLogs = new Set<LogEvent>()
      for (const expectedLog of expectedLogs) {
        const matchedLog = logs.find((l) => expectedLog.test(l))
        if (!matchedLog) {
          const potentialCandidate = logs.find(
            (l) => l.sourceLocation?.file === expectedLog.sourceLocation.file && l.sourceLocation.line === expectedLog.sourceLocation.line,
          )
          throw new MissingLogError(expectedLog, potentialCandidate)
        } else {
          matchedLogs.add(matchedLog)
        }
      }
      const unmatchedLogs = logs.filter((l) => !matchedLogs.has(l))
      if (unmatchedLogs.length) {
        const [firstUnmatched] = unmatchedLogs
        invariant(firstUnmatched.sourceLocation, 'Log must have source location')
        throw new AdditionalLogError({
          sourceLocation: firstUnmatched.sourceLocation,
          message: firstUnmatched.message,
          level: firstUnmatched.level,
        })
      }
    })
  })
})

class MissingLogError implements Error {
  constructor(
    private expectedLog: {
      level: LogLevel
      message: string
      sourceLocation: SourceLocation
    },
    private potentialMatch?: LogEvent,
  ) {}
  get message() {
    const foundLog = this.potentialMatch ? `Found log: [${this.potentialMatch.level}] ${this.potentialMatch.message}` : 'Found log: <none>'
    return `Expected log: [${this.expectedLog.level}] ${this.expectedLog.message}\n${foundLog}`
  }
  get stack() {
    return this.potentialMatch?.sourceLocation?.toString() ?? this.expectedLog.sourceLocation.toString()
  }
  get name() {
    return 'MissingLogError'
  }
}

class AdditionalLogError implements Error {
  constructor(
    private expectedLog: {
      level: LogLevel
      message: string
      sourceLocation: SourceLocation
    },
  ) {}
  get message() {
    return `Additional log: [${this.expectedLog.level}] ${this.expectedLog.message}`
  }
  get stack() {
    return this.expectedLog.sourceLocation.toString()
  }
  get name() {
    return 'AdditionalLogError'
  }
}

type ExpectedLog = {
  level: LogLevel
  message: string
  sourceLocation: SourceLocation
  test(log: LogEvent): boolean
}

function extractExpectLogs(sourceFile: ts.SourceFile, programDirectory: string) {
  const expectedLogs: ExpectedLog[] = []

  ts.visitNode(sourceFile, visit)

  function visit(node: ts.Node): ts.Node {
    const commentRanges = ts.getLeadingCommentRanges(sourceFile.getFullText(), node.getFullStart())
    if (commentRanges?.length) {
      for (const commentRange of commentRanges) {
        const comment = sourceFile.getFullText().slice(commentRange.pos, commentRange.end)
        const match = /^\/\/ @expect-(\w+)\s+(.*)$/.exec(comment)
        if (match) {
          const level = enumFromValue(match[1], LogLevel, 'Unexpected log level in @expect-* comment: ')
          const message = match[2]
          const commentLocation = SourceLocation.fromTextRange(sourceFile, commentRange, programDirectory)
          expectedLogs.push({
            level,
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
    }

    return ts.visitEachChild(node, visit, undefined)
  }
  return expectedLogs
}
