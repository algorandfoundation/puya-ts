import type ts from 'typescript'
import type { SourceLocation } from '../awst/source-location'
import { LogLevel } from '../logger'
import type { TextEdit } from '../text-edit'
import { getNodeRange } from '../text-edit'
import { CodeFix } from './code-fix'

export class LooseEqualityOperator extends CodeFix {
  constructor({
    sourceLocation,
    operatorUsed,
    operatorRequired,
  }: {
    sourceLocation: SourceLocation<ts.BinaryOperatorToken>
    operatorUsed: string
    operatorRequired: string
  }) {
    super({
      sourceLocation,
      errorMessage: `Loose equality operator '${operatorUsed}' is not supported. Please use strict equality operator '${operatorRequired}'`,
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
