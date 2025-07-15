import type ts from 'typescript'

export type Position = {
  line: number
  col: number
}

export type Range = {
  start: Position
  end: Position
}

export type TextEdit = {
  range: Range
  newText: string
}

export function getNodeRange(node: ts.Node): Range {
  const start = node.getSourceFile().getLineAndCharacterOfPosition(node.getStart())
  const end = node.getSourceFile().getLineAndCharacterOfPosition(node.getEnd())
  return {
    start: {
      line: start.line,
      col: start.character,
    },
    end: {
      line: end.line,
      col: end.character,
    },
  }
}
