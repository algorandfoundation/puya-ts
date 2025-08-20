import type ts from 'typescript'
import type { SourceLocation } from '../awst/source-location'
import { LogLevel } from '../logger'
import type { TextEdit } from '../text-edit'
import { getNodeRange } from '../text-edit'
import { CodeFix } from './code-fix'

export class RequiresNonNullAssertion extends CodeFix {
  constructor({ sourceLocation }: { sourceLocation: SourceLocation }) {
    super({
      sourceLocation,
      errorMessage: 'This expression requires a non-null assertion operator "!" immediately proceeding it',
      fixMessage: "Insert required '!'",
      logLevel: LogLevel.Error,
      edits: RequiresNonNullAssertion.buildEdits(sourceLocation.node),
      requiredSymbols: [],
    })
  }

  static buildEdits(node: ts.Node | undefined): TextEdit[] {
    if (!node) return []

    const afterExpression = getNodeRange(node).end

    return [
      {
        range: {
          start: afterExpression,
          end: afterExpression,
        },
        newText: '!',
      },
    ]
  }
}
