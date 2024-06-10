import { awst, wtypes } from '../../awst'
import { WType } from '../../awst/wtypes'
import { ExpressionBuilder, IntermediateExpressionBuilder, TypeClassExpressionBuilder, ValueExpressionBuilder } from './index'
import { Literal } from '../../awst/nodes'
import { SourceLocation } from '../../awst/source-location'
import { nodeFactory } from '../../awst/node-factory'
import { CodeError } from '../../errors'
import { UInt64ExpressionBuilder } from './uint64-expression-builder'
import { intrinsicFactory } from '../../awst/intrinsic-factory'
import { requireExpressionsOfType } from './util'

export class BytesFunctionExpressionBuilder extends TypeClassExpressionBuilder {
  produces(): WType {
    return wtypes.bytesWType
  }

  taggedTemplate(
    head: string,
    spans: ReadonlyArray<readonly [ExpressionBuilder | Literal, string]>,
    sourceLocation: SourceLocation,
  ): ExpressionBuilder {
    // TODO: convert head and concat spans
    return new BytesExpressionBuilder(
      nodeFactory.bytesConstant({
        sourceLocation,
        value: new Uint8Array(),
      }),
    )
  }

  call(args: Array<ExpressionBuilder | Literal>, sourceLocation: SourceLocation): ExpressionBuilder {
    if (args.length === 0) {
      return new BytesExpressionBuilder(
        nodeFactory.bytesConstant({
          sourceLocation,
          value: new Uint8Array(),
        }),
      )
    }
    const [arg0] = args
    if (arg0 instanceof Literal && arg0.value instanceof Uint8Array) {
      return new BytesExpressionBuilder(
        nodeFactory.bytesConstant({
          sourceLocation,
          value: arg0.value,
        }),
      )
    }
    throw CodeError.unexpectedUnhandledArgs({ sourceLocation })
  }
}

export class BytesExpressionBuilder extends ValueExpressionBuilder {
  get wtype(): wtypes.WType {
    return wtypes.bytesWType
  }

  memberAccess(name: string, sourceLocation: SourceLocation): ExpressionBuilder | Literal {
    switch (name) {
      case 'length':
        return new UInt64ExpressionBuilder(
          intrinsicFactory.bytesLen({
            value: this._expr,
            sourceLocation,
          }),
        )
      case 'concat':
        return new ConcatExpressionBuilder(this._expr)
      case 'at':
        return new BytesAtExpressionBuilder(this._expr)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

export class ConcatExpressionBuilder extends IntermediateExpressionBuilder {
  constructor(private expr: awst.Expression) {
    super(expr.sourceLocation)
  }

  call(args: ReadonlyArray<ExpressionBuilder | Literal>, sourceLocation: SourceLocation) {
    const [other] = requireExpressionsOfType(args, [wtypes.bytesWType])
    return new BytesExpressionBuilder(
      intrinsicFactory.bytesConcat({
        left: this.expr,
        right: other,
        sourceLocation: sourceLocation,
      }),
    )
  }
}

export class BytesSliceExpressionBuilder extends IntermediateExpressionBuilder {
  constructor(private expr: awst.Expression) {
    super(expr.sourceLocation)
  }
  call(args: ReadonlyArray<ExpressionBuilder | Literal>, sourceLocation: SourceLocation) {
    // TODO: Needs to do range check on target and handle negative values
    // TODO: Also handle single arg
    const [start, stop] = requireExpressionsOfType(args, [wtypes.uint64WType, wtypes.uint64WType])
    return new BytesExpressionBuilder(
      nodeFactory.sliceExpression({
        base: this.expr,
        sourceLocation: sourceLocation,
        beginIndex: start,
        endIndex: stop,
        wtype: wtypes.bytesWType,
      }),
    )
  }
}

export class BytesAtExpressionBuilder extends IntermediateExpressionBuilder {
  constructor(private expr: awst.Expression) {
    super(expr.sourceLocation)
  }

  call(args: ReadonlyArray<ExpressionBuilder | Literal>, sourceLocation: SourceLocation) {
    const [index] = requireExpressionsOfType(args, [wtypes.uint64WType])
    // TODO: Needs to do range check on target and handle negative values
    return new BytesExpressionBuilder(
      nodeFactory.sliceExpression({
        base: this.expr,
        sourceLocation: sourceLocation,
        beginIndex: index,
        endIndex: nodeFactory.uInt64Constant({ value: 1n, sourceLocation }),
        wtype: wtypes.bytesWType,
      }),
    )
  }
}
