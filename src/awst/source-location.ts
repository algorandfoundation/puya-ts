import ts from 'typescript'
import { invariant, normalisePath } from '../util'

export class SourceLocation {
  file: string | null
  line: number
  endLine: number
  column: number
  endColumn: number
  scope: 'file' | 'range'

  constructor(props: {
    file?: string | null
    line: number
    endLine: number
    column: number
    endColumn: number
    scope: SourceLocation['scope']
  }) {
    invariant(props.line <= props.endLine, 'Start line must be before end line')
    if (props.line === props.endLine) invariant(props.column <= props.endColumn, 'Start column must be before end column')
    this.file = props.file ?? null
    this.line = props.line
    this.endLine = props.endLine
    this.column = props.column
    this.endColumn = props.endColumn
    this.scope = props.scope

    // Exclude scope from enumerable properties so it doesn't end up being serialized
    Object.defineProperty(this, 'scope', {
      enumerable: false,
    })
  }

  private static getStartAndEnd(node: ts.Node): { start: number; end: number } {
    if (ts.isClassDeclaration(node)) {
      return fromNodeTillStartOfNode(node, node.members.at(0))
    }
    if (ts.isMethodDeclaration(node) || ts.isFunctionDeclaration(node)) {
      return fromNodeTillStartOfNode(node, node.body)
    }
    if (ts.isForStatement(node) || ts.isForInStatement(node) || ts.isForOfStatement(node)) {
      return fromNodeTillStartOfNode(node, node.statement)
    }
    if (ts.isIfStatement(node)) {
      return fromNodeTillStartOfNode(node, node.thenStatement)
    }

    return {
      start: node.getStart(),
      end: node.getEnd(),
    }
  }

  static fromNode(node: ts.Node, programDirectory: string): SourceLocation {
    const sourceFile = node.getSourceFile()

    const { start, end } = SourceLocation.getStartAndEnd(node)

    const startLoc = sourceFile.getLineAndCharacterOfPosition(start)
    const endLoc = sourceFile.getLineAndCharacterOfPosition(end)

    return new SourceLocation({
      file: normalisePath(sourceFile.fileName, programDirectory),
      line: startLoc.line + 1,
      endLine: endLoc.line + 1,
      column: startLoc.character,
      endColumn: endLoc.character,
      scope: 'range',
    })
  }

  static fromFile(sourceFile: ts.SourceFile, programDirectory: string): SourceLocation {
    const endPos = sourceFile.getEnd()
    const endLoc = sourceFile.getLineAndCharacterOfPosition(endPos)
    return new SourceLocation({
      file: normalisePath(sourceFile.fileName, programDirectory),
      line: 1,
      endLine: endLoc.line + 1,
      column: 0,
      endColumn: endLoc.character,
      scope: 'file',
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
      scope: 'range',
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
      scope: 'range',
    })
  }

  toString() {
    return `${this.file}:${this.line}:${this.column + 1}`
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
        scope: 'range',
      })
    })
  }

  static None = new SourceLocation({
    line: 1,
    endLine: 1,
    column: 0,
    endColumn: 1,
    scope: 'file',
  })
}

function fromNodeTillStartOfNode(n1: ts.Node, n2?: ts.Node): { start: number; end: number } {
  return {
    start: n1.getStart(),
    end: n2 ? n2.getStart() - n2.getLeadingTriviaWidth() : n1.getEnd(),
  }
}
