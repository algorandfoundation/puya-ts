import { ExpressionBuilder, IntermediateExpressionBuilder } from './index'
import { Literal } from '../../awst/nodes'
import { SourceLocation } from '../../awst/source-location'
import { requireExpression } from './util'
import { VoidExpressionBuilder } from './void-expression-builder'
import { nodeFactory } from '../../awst/node-factory'
import { awst, wtypes } from '../../awst'
import { intrinsicFactory } from '../../awst/intrinsic-factory'
import { CodeError } from '../../errors'

export class LogExpressionBuilder extends IntermediateExpressionBuilder {
  call(args: Array<ExpressionBuilder | Literal>, sourceLocation: SourceLocation): ExpressionBuilder {
    const argsExps = args.map((a) => requireExpression(a))

    let logBytes: awst.Expression
    if (argsExps.length === 1) {
      logBytes = convertToBytes(argsExps[0], sourceLocation)
    } else {
      logBytes = argsExps.reduce((a, b) =>
        intrinsicFactory.bytesConcat({ left: convertToBytes(a, sourceLocation), right: convertToBytes(b, sourceLocation), sourceLocation }),
      )
    }

    return new VoidExpressionBuilder(
      nodeFactory.intrinsicCall({
        sourceLocation: sourceLocation,
        immediates: [],
        stackArgs: [logBytes],
        opCode: 'log',
        wtype: wtypes.voidWType,
      }),
    )
  }
}

function convertToBytes(expr: awst.Expression, sourceLocation: SourceLocation): awst.Expression {
  if (expr.wtype.equals(wtypes.bytesWType)) return expr
  if (expr.wtype.equals(wtypes.boolWType)) return intrinsicFactory.itob({ value: expr, sourceLocation })
  if (expr.wtype.equals(wtypes.uint64WType)) return intrinsicFactory.itob({ value: expr, sourceLocation })

  throw new CodeError(`Expression ${expr.wtype} has no implicit conversion to bytes`)
}
