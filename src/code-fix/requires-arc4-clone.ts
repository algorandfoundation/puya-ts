import ts from 'typescript'
import type { SourceLocation } from '../awst/source-location'
import { LogLevel } from '../logger'
import type { TextEdit } from '../text-edit'
import { getNodeRange } from '../text-edit'
import { CodeFix } from './code-fix'

export class RequiresArc4Clone extends CodeFix {
  constructor({ sourceLocation, errorMessage }: { sourceLocation: SourceLocation; errorMessage: string }) {
    super({
      sourceLocation,
      errorMessage,
      fixMessage: 'Wrap expression in clone(...)',
      logLevel: LogLevel.Error,
      edits: RequiresArc4Clone.buildEdits(sourceLocation.withNode().node),
    })
  }

  static buildEdits(node: ts.Node): TextEdit[] {
    const { start, end } = ts.isSpreadAssignment(node) ? getNodeRange(node.expression) : getNodeRange(node)
    return [
      {
        range: {
          start: start,
          end: start,
        },
        newText: 'clone(',
      },
      {
        range: {
          start: end,
          end: end,
        },
        newText: ')',
      },
    ]
  }
}
