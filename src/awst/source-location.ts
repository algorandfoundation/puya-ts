import type ts from 'typescript'
import { invariant, normalisePath } from '../util'

export class SourceLocation {
  file: string
  line: number
  endLine: number
  column: number
  endColumn: number

  constructor(props: { file: string; line: number; endLine: number; column: number; endColumn: number }) {
    this.file = props.file
    this.line = props.line
    this.endLine = props.endLine
    this.column = props.column
    this.endColumn = props.endColumn
  }

  static fromNode(sourceFile: ts.SourceFile, node: ts.Node, programDirectory: string): SourceLocation {
    const startPos = node.getStart(sourceFile)
    const width = node.getWidth(sourceFile)

    const startLoc = sourceFile.getLineAndCharacterOfPosition(startPos)
    const endLoc = sourceFile.getLineAndCharacterOfPosition(startPos + width)

    return new SourceLocation({
      file: normalisePath(sourceFile.fileName, programDirectory),
      line: startLoc.line + 1,
      endLine: endLoc.line + 1,
      column: startLoc.character,
      endColumn: endLoc.character,
    })
  }

  static fromFile(sourceFile: ts.SourceFile, programDirectory: string): SourceLocation {
    return new SourceLocation({
      file: normalisePath(sourceFile.fileName, programDirectory),
      line: 1,
      endLine: 1,
      column: 1,
      endColumn: 1,
    })
  }

  static fromTextRange(sourceFile: ts.SourceFile, textRange: ts.TextRange, programDirectory: string): SourceLocation {
    const startLoc = sourceFile.getLineAndCharacterOfPosition(textRange.pos)
    const endLoc = sourceFile.getLineAndCharacterOfPosition(textRange.end)

    return new SourceLocation({
      file: normalisePath(sourceFile.fileName, programDirectory),
      line: startLoc.line + 1,
      endLine: endLoc.line + 1,
      column: startLoc.character,
      endColumn: endLoc.character,
    })
  }

  static fromDiagnostic(diagnostic: ts.DiagnosticWithLocation, programDirectory: string): SourceLocation {
    const startLoc = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)

    return new SourceLocation({
      file: normalisePath(diagnostic.file.fileName, programDirectory),
      line: startLoc.line + 1,
      endLine: startLoc.line + 1,
      column: startLoc.character,
      endColumn: startLoc.character,
    })
  }

  toString() {
    return `${this.file}:${this.line}:${this.column}`
  }

  static fromLocations(...sourceLocation: SourceLocation[]): SourceLocation {
    const [first, ...rest] = sourceLocation
    invariant(first && rest.every((r) => r.file === first.file), 'All locations must of the same file')
    if (rest.length === 0) return first
    return sourceLocation.reduce((acc, cur) => {
      return new SourceLocation({
        file: acc.file,
        line: Math.min(acc.line, cur.line),
        endLine: Math.max(acc.endLine, cur.endLine),
        column: acc.line === cur.line ? Math.min(acc.column, cur.column) : acc.line < cur.line ? acc.column : cur.column,
        endColumn:
          acc.endLine === cur.endLine ? Math.max(acc.endColumn, cur.endColumn) : acc.endLine > cur.endLine ? acc.endColumn : cur.endColumn,
      })
    })
  }
}
