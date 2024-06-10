import { ExpressionBuilder, IntermediateExpressionBuilder, TypeClassExpressionBuilder, ValueExpressionBuilder } from './index'
import { WType } from '../../awst/wtypes'
import { Literal } from '../../awst/nodes'
import { SourceLocation } from '../../awst/source-location'
import { nodeFactory } from '../../awst/node-factory'
import { CodeError } from '../../errors'
import { intrinsicFactory } from '../../awst/intrinsic-factory'
import { requireExpressionsOfType } from './util'
import { awst, wtypes } from '../../awst'

export class StrFunctionExpressionBuilder extends TypeClassExpressionBuilder {
  produces(): WType {
    return wtypes.stringWType
  }

  taggedTemplate(
    head: string,
    spans: ReadonlyArray<readonly [ExpressionBuilder | Literal, string]>,
    sourceLocation: SourceLocation,
  ): ExpressionBuilder {
    // TODO: convert head and concat spans
    return new StrExpressionBuilder(
      nodeFactory.stringConstant({
        sourceLocation,
        value: head,
      }),
    )
  }

  call(args: Array<ExpressionBuilder | Literal>, sourceLocation: SourceLocation): ExpressionBuilder {
    if (args.length === 0) {
      return new StrExpressionBuilder(
        nodeFactory.stringConstant({
          sourceLocation,
          value: '',
        }),
      )
    }
    const [arg0] = args
    if (arg0 instanceof Literal) {
      if (typeof arg0.value === 'string') {
        return new StrExpressionBuilder(
          nodeFactory.stringConstant({
            sourceLocation,
            value: arg0.value,
          }),
        )
      } else if (arg0.value instanceof Uint8Array) {
        return new StrExpressionBuilder(
          nodeFactory.reinterpretCast({
            expr: nodeFactory.bytesConstant({
              sourceLocation,
              value: arg0.value,
            }),
            sourceLocation,
            wtype: wtypes.stringWType,
          }),
        )
      }
    }
    throw CodeError.unexpectedUnhandledArgs({ sourceLocation })
  }
}

export class StrExpressionBuilder extends ValueExpressionBuilder {
  get wtype(): wtypes.WType {
    return wtypes.stringWType
  }

  memberAccess(name: string, sourceLocation: SourceLocation): ExpressionBuilder | Literal {
    switch (name) {
      case 'concat':
        return new ConcatExpressionBuilder(this._expr)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

export class ConcatExpressionBuilder extends IntermediateExpressionBuilder {
  constructor(private expr: awst.Expression) {
    super(expr.sourceLocation)
  }

  call(args: ReadonlyArray<ExpressionBuilder | Literal>, sourceLocation: SourceLocation) {
    const [other] = requireExpressionsOfType(args, [wtypes.stringWType])
    return new StrExpressionBuilder(
      intrinsicFactory.bytesConcat({
        left: this.expr,
        right: other,
        sourceLocation: sourceLocation,
      }),
    )
  }
}
