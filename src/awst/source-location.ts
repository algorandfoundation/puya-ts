import ts from 'typescript'
import { normalisePath } from '../util'

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
      line: startLoc.line,
      endLine: endLoc.line,
      column: startLoc.character,
      endColumn: endLoc.character,
    })
  }

  static fromFile(sourceFile: ts.SourceFile, programDirectory: string): SourceLocation {
    return new SourceLocation({
      file: normalisePath(sourceFile.fileName, programDirectory),
      line: 0,
      endLine: 0,
      column: 0,
      endColumn: 0,
    })
  }

  static fromTextRange(sourceFile: ts.SourceFile, textRange: ts.TextRange, programDirectory: string): SourceLocation {
    const startLoc = sourceFile.getLineAndCharacterOfPosition(textRange.pos)
    const endLoc = sourceFile.getLineAndCharacterOfPosition(textRange.end)

    return new SourceLocation({
      file: normalisePath(sourceFile.fileName, programDirectory),
      line: startLoc.line,
      endLine: endLoc.line,
      column: startLoc.character,
      endColumn: endLoc.character,
    })
  }

  static fromDiagnostic(diagnostic: ts.DiagnosticWithLocation, programDirectory: string): SourceLocation {
    const startLoc = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)

    return new SourceLocation({
      file: normalisePath(diagnostic.file.fileName, programDirectory),
      line: startLoc.line,
      endLine: startLoc.line,
      column: startLoc.character,
      endColumn: startLoc.character,
    })
  }

  toString() {
    return `${this.file}:${this.line + 1}:${this.column + 1}`
  }
}
