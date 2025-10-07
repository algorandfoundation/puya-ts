import ts from 'typescript'
import { invariant } from '../util'
import { AbsolutePath } from '../util/absolute-path'

export class SourceLocation<TNode extends ts.Node | undefined = ts.Node | undefined> {
  file: AbsolutePath | null
  line: number
  endLine: number
  column: number
  endColumn: number
  scope: 'file' | 'range'
  node: TNode

  /**
   * Asserts this source location has a node and returns source location with updated typing
   */
  withNode(): SourceLocation<ts.Node> {
    invariant(this.node, 'Source location must have node', this)
    return this as SourceLocation<ts.Node>
  }

  constructor(props: {
    file?: AbsolutePath | null
    line: number
    endLine: number
    column: number
    endColumn: number
    scope: SourceLocation['scope']
    node: TNode
  }) {
    invariant(props.line <= props.endLine, 'Start line must be before end line')
    if (props.line === props.endLine) invariant(props.column <= props.endColumn, 'Start column must be before end column')
    this.file = props.file ?? null
    this.line = props.line
    this.endLine = props.endLine
    this.column = props.column
    this.endColumn = props.endColumn
    this.scope = props.scope
    this.node = props.node

    // Exclude scope from enumerable properties so it doesn't end up being serialized
    Object.defineProperty(this, 'scope', {
      enumerable: false,
    })
    Object.defineProperty(this, 'node', {
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

  static fromNode<TNode extends ts.Node>(node: TNode, programDirectory: AbsolutePath): SourceLocation<TNode> {
    const sourceFile = node.getSourceFile()

    const { start, end } = SourceLocation.getStartAndEnd(node)

    const startLoc = sourceFile.getLineAndCharacterOfPosition(start)
    const endLoc = sourceFile.getLineAndCharacterOfPosition(end)

    return new SourceLocation({
      file: AbsolutePath.resolve({ path: sourceFile.fileName, workingDirectory: programDirectory }),
      line: startLoc.line + 1,
      endLine: endLoc.line + 1,
      column: startLoc.character,
      endColumn: endLoc.character,
      scope: 'range',
      node,
    })
  }

  static fromFile(sourceFile: ts.SourceFile, programDirectory: AbsolutePath): SourceLocation {
    const endPos = sourceFile.getEnd()
    const endLoc = sourceFile.getLineAndCharacterOfPosition(endPos)
    return new SourceLocation({
      file: AbsolutePath.resolve({ path: sourceFile.fileName, workingDirectory: programDirectory }),
      line: 1,
      endLine: endLoc.line + 1,
      column: 0,
      endColumn: endLoc.character,
      scope: 'file',
      node: undefined,
    })
  }

  static fromTextRange(sourceFile: ts.SourceFile, textRange: ts.TextRange, programDirectory: AbsolutePath): SourceLocation {
    const startLoc = sourceFile.getLineAndCharacterOfPosition(textRange.pos)
    const endLoc = sourceFile.getLineAndCharacterOfPosition(textRange.end)

    return new SourceLocation({
      file: AbsolutePath.resolve({ path: sourceFile.fileName, workingDirectory: programDirectory }),
      line: startLoc.line + 1,
      endLine: endLoc.line + 1,
      column: startLoc.character,
      endColumn: endLoc.character,
      scope: 'range',
      node: undefined,
    })
  }

  static fromDiagnostic(diagnostic: ts.DiagnosticWithLocation, programDirectory: AbsolutePath): SourceLocation {
    const startLoc = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)

    return new SourceLocation({
      file: AbsolutePath.resolve({ path: diagnostic.file.fileName, workingDirectory: programDirectory }),
      line: startLoc.line + 1,
      endLine: startLoc.line + 1,
      column: startLoc.character,
      endColumn: startLoc.character,
      scope: 'range',
      node: undefined,
    })
  }

  toString() {
    return `${this.file}:${this.line}:${this.column + 1}`
  }

  static None = new SourceLocation({
    line: 1,
    endLine: 1,
    column: 0,
    endColumn: 1,
    scope: 'file',
    node: undefined,
  })
}

function fromNodeTillStartOfNode(n1: ts.Node, n2?: ts.Node): { start: number; end: number } {
  return {
    start: n1.getStart(),
    end: n2 ? n2.getStart() - n2.getLeadingTriviaWidth() : n1.getEnd(),
  }
}
