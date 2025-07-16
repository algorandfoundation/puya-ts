import ts from 'typescript'
import type { SourceLocation } from '../awst/source-location'
import { uint64PType } from '../awst_build/ptypes'
import { LogLevel } from '../logger'
import type { TextEdit } from '../text-edit'
import { QuickFix } from './quick-fix'

export class GlobalStateNumber extends QuickFix {
  constructor({ sourceLocation }: { sourceLocation: SourceLocation }) {
    super({
      sourceLocation,
      message: 'Global state number bad!',
      logLevel: LogLevel.Error,
      edits: GlobalStateNumber.buildEdits(sourceLocation.node),
      requiredSymbols: [uint64PType],
    })
  }

  static buildEdits(node: ts.Node | undefined): TextEdit[] {
    if (!node || !ts.isCallExpression(node)) return []

    if (node.typeArguments?.length) {
      return []
    } else {
      const sourceFile = node.getSourceFile()

      const afterExpression = sourceFile.getLineAndCharacterOfPosition(node.expression.getEnd())

      return [
        {
          range: {
            start: {
              line: afterExpression.line,
              col: afterExpression.character,
            },
            end: {
              line: afterExpression.line,
              col: afterExpression.character,
            },
          },
          newText: '<uint64>',
        },
      ]
    }
  }
}
