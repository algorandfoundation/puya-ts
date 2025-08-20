import type ts from 'typescript'
import type { SourceLocation } from '../awst/source-location'
import { transientTypeErrors } from '../awst_build/ptypes/transient-type-errors'
import { Constants } from '../constants'
import { LogLevel } from '../logger'
import type { TextEdit } from '../text-edit'
import { getNodeRange } from '../text-edit'
import { CodeFix } from './code-fix'

export class GlobalStateNumber extends CodeFix {
  constructor({ sourceLocation }: { sourceLocation: SourceLocation<ts.CallExpression> }) {
    super({
      sourceLocation,
      errorMessage: transientTypeErrors.nativeNumeric('number').usedAsType,
      fixMessage: 'Use GlobalState<uint64>',
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

  static buildEdits(node: ts.CallExpression): TextEdit[] {
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
