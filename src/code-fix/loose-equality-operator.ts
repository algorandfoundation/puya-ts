import type ts from 'typescript'
import type { SourceLocation } from '../awst/source-location'
import { LogLevel } from '../logger'
import type { TextEdit } from '../text-edit'
import { getNodeRange } from '../text-edit'
import { CodeFix } from './code-fix'

export class LooseEqualityOperator extends CodeFix {
  constructor({
    sourceLocation,
    errorMessage,
    operatorRequired,
  }: {
    sourceLocation: SourceLocation<ts.BinaryOperatorToken>
    errorMessage: string
    operatorRequired: string
  }) {
    super({
      sourceLocation,
      errorMessage,
      fixMessage: `Replace with ${operatorRequired}`,
      logLevel: LogLevel.Error,
      edits: LooseEqualityOperator.buildEdits(sourceLocation.node, operatorRequired),
    })
  }

  static buildEdits(node: ts.BinaryOperatorToken, operatorRequired: string): TextEdit[] {
    return [
      {
        range: getNodeRange(node),
        newText: operatorRequired,
      },
    ]
  }
}
