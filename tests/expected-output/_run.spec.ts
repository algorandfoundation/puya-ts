import { describe, expect, it } from 'vitest'
import { globSync } from 'glob'
import { compile, CompileResult } from '../../src'
import ts from 'typescript'
import { SourceLocation } from '../../src/awst/source-location'
import exp from 'node:constants'
import { LogEvent } from '../../src/logger'

function getTestFiles() {
  const filePaths: string[] = []
  const matches = globSync('tests/expected-output/*.algo.ts')
  if (matches.length) {
    filePaths.push(...matches)
  } else {
    throw new Error('glob pattern matches no files')
  }
  return filePaths
}
describe.each(getTestFiles())('File with expected errors', (path: string) => {
  const result = compile({
    outputAwstJson: false,
    outputAwst: false,
    filePaths: [path],
    outDir: '',
  })
  it('has errors', () => {
    const expectedLogs = extractExpectLogs(result)
    const matchedLogs = new Set<LogEvent>()
    for (const expectedLog of expectedLogs) {
      const matchedLog = result.logs.find(
        (l) =>
          l.level === expectedLog.level &&
          l.sourceLocation?.line === expectedLog.sourceLocation.line &&
          l.message.startsWith(expectedLog.message),
      )
      if (!matchedLog) {
        throw new Error(`${expectedLog.sourceLocation} Missing log: [${expectedLog.level}] ${expectedLog.message}`)
      } else {
        matchedLogs.add(matchedLog)
      }
    }
    const unmatchedLogs = result.logs.filter((l) => !matchedLogs.has(l))

    expect(unmatchedLogs).toStrictEqual([])
  })
})

type ExpectedLog = {
  level: LogEvent['level']
  message: string
  sourceLocation: SourceLocation
}

function extractExpectLogs(result: CompileResult) {
  if (!result.ast) {
    throw new Error('No AST available')
  }
  const expectedLogs: ExpectedLog[] = []

  for (const sourceFile of Object.values(result.ast)) {
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
            const commentLocation = SourceLocation.fromTextRange(sourceFile, commentRange, result.programDirectory)

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
  }
  return expectedLogs
}
