import ts from 'typescript'

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

  static fromNode(sourceFile: ts.SourceFile, node: ts.Node): SourceLocation {
    const startPos = node.getStart(sourceFile)
    const width = node.getWidth(sourceFile)

    const startLoc = sourceFile.getLineAndCharacterOfPosition(startPos)
    const endLoc = sourceFile.getLineAndCharacterOfPosition(startPos + width)

    return new SourceLocation({
      file: sourceFile.fileName,
      line: startLoc.line,
      endLine: endLoc.line,
      column: startLoc.character,
      endColumn: endLoc.character,
    })
  }

  static fromDiagnostic(diagnostic: ts.DiagnosticWithLocation): SourceLocation {
    const startLoc = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)

    return new SourceLocation({
      file: diagnostic.file.fileName,
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