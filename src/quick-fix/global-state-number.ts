import ts from 'typescript'
import type { SourceLocation } from '../awst/source-location'
import { Constants } from '../constants'
import { LogLevel } from '../logger'
import type { TextEdit } from '../text-edit'
import { getNodeRange } from '../text-edit'
import { QuickFix } from './quick-fix'

export class GlobalStateNumber extends QuickFix {
  constructor({ sourceLocation }: { sourceLocation: SourceLocation }) {
    super({
      sourceLocation,
      message: 'Global state number bad!',
      logLevel: LogLevel.Error,
      edits: GlobalStateNumber.buildEdits(sourceLocation.node),
      requiredSymbols: [
        {
          name: 'uint64',
          module: Constants.algoTsPackage,
          typeOnly: true,
        },
      ],
    })
  }

  static buildEdits(node: ts.Node | undefined): TextEdit[] {
    if (!node || !ts.isCallExpression(node)) return []

    if (node.typeArguments?.length) {
      return [
        {
          range: getNodeRange(node.typeArguments[0]),
          newText: 'uint64',
        },
      ]
    } else {
      const afterExpression = getNodeRange(node.expression).end

      return [
        {
          range: {
            start: afterExpression,
            end: afterExpression,
          },
          newText: '<uint64>',
        },
      ]
    }
  }
}
