import type ts from 'typescript'
import type { SourceLocation } from '../awst/source-location'
import { LogLevel } from '../logger'
import type { TextEdit } from '../text-edit'
import { getNodeRange } from '../text-edit'
import { CodeFix } from './code-fix'

export class NoOpNonNullAssertion extends CodeFix {
  constructor({ sourceLocation }: { sourceLocation: SourceLocation<ts.NonNullExpression> }) {
    super({
      sourceLocation,
      errorMessage: 'The non-null assertion operator "!" has no effect (no-op) on non-optional types',
      fixMessage: "Remove '!'",
      logLevel: LogLevel.Warning,
      edits: NoOpNonNullAssertion.buildEdits(sourceLocation.node),
    })
  }

  static buildEdits(node: ts.NonNullExpression): TextEdit[] {
    return [
      {
        range: {
          start: getNodeRange(node.expression).end,
          end: getNodeRange(node).end,
        },
        newText: '',
      },
    ]
  }
}
