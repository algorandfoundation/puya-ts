import type ts from 'typescript'
import type { SourceLocation } from '../awst/source-location'
import { LogLevel } from '../logger'
import type { TextEdit } from '../text-edit'
import { getNodeRange } from '../text-edit'
import { CodeFix } from './code-fix'

export class InvalidNonNullAssertion extends CodeFix {
  constructor({ sourceLocation }: { sourceLocation: SourceLocation<ts.NonNullExpression> }) {
    super({
      sourceLocation,
      errorMessage:
        'The non-null assertion operator "!" is not valid here. It is only valid in limited scenarios where built in types require it. Eg. Array.prototype.pop',
      fixMessage: "Remove '!'",
      logLevel: LogLevel.Error,
      edits: InvalidNonNullAssertion.buildEdits(sourceLocation.node),
      requiredSymbols: [],
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
