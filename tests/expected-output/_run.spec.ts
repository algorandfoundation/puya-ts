import { describe, expect, it } from 'vitest'
import { compile, CompileResult } from '../../src'
import ts from 'typescript'
import { SourceLocation } from '../../src/awst/source-location'
import { LogEvent } from '../../src/logger'
import { buildCompileOptions } from '../../src/compile-options'
import { invariant } from '../../src/util'

describe('Expected output', () => {
  const result = compile(
    buildCompileOptions({
      outputAwstJson: false,
      outputAwst: false,
      paths: ['tests/expected-output'],
      outDir: '',
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
        const matchedLog = logs.find(
          (l) =>
            l.level === expectedLog.level &&
            l.sourceLocation?.line === expectedLog.sourceLocation.line &&
            l.message.startsWith(expectedLog.message),
        )
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
  // it('has expected output', () => {
  //   const expectedLogs = extractExpectLogs(result)
  //   const matchedLogs = new Set<LogEvent>()
  //   for (const expectedLog of expectedLogs) {
  //     const matchedLog = result.logs.find(
  //       (l) =>
  //         l.level === expectedLog.level &&
  //         l.sourceLocation?.line === expectedLog.sourceLocation.line &&
  //         l.message.startsWith(expectedLog.message),
  //     )
  //     if (!matchedLog) {
  //       throw new Error(`${expectedLog.sourceLocation} Missing log: [${expectedLog.level}] ${expectedLog.message}`)
  //     } else {
  //       matchedLogs.add(matchedLog)
  //     }
  //   }
  //   const unmatchedLogs = result.logs.filter((l) => !matchedLogs.has(l))
  //   for (const unmatchedLog of unmatchedLogs) {
  //     // eslint-disable-next-line no-console
  //     console.warn(`${unmatchedLog.sourceLocation} [${unmatchedLog.level}] ${unmatchedLog.message}`)
  //   }
  //   expect(unmatchedLogs.length).toBe(1)
  // })
})

type ExpectedLog = {
  level: LogEvent['level']
  message: string
  sourceLocation: SourceLocation
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
        const match = /^\/\/ @expect-(\w+) (.*)$/.exec(comment)
        if (match) {
          const level = match[1]
          const message = match[2]
          if (!['error', 'info', 'warn', 'debug', 'fatal'].includes(level)) {
            throw new Error(`Unxpected log level ${level} in @expect-* comment`)
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
          })
        }
      }
      return node
    }

    return ts.visitEachChild(node, visit, undefined)
  }
  return expectedLogs
}
