import { wtypes } from '../../awst'
import { WType } from '../../awst/wtypes'
import { BuilderBinaryOp, BuilderComparisonOp, ExpressionBuilder, TypeClassExpressionBuilder, ValueExpressionBuilder } from './index'
import { Literal, NumericComparison, UInt64BinaryOperator } from '../../awst/nodes'
import { SourceLocation } from '../../awst/source-location'
import { nodeFactory } from '../../awst/node-factory'
import { CodeError, NotSupported } from '../../errors'
import { requireExpressionOfType } from './util'
import { tryConvertEnum } from '../../util'
import { typeRegistry } from '../ptypes'
import { BoolExpressionBuilder } from './bool-expression-builder'

export class UInt64FunctionExpressionBuilder extends TypeClassExpressionBuilder {
  produces(): WType {
    return wtypes.uint64WType
  }

  call(args: Array<ExpressionBuilder | Literal>, sourceLocation: SourceLocation): ExpressionBuilder {
    if (args.length == 0) {
      return new UInt64ExpressionBuilder(
        nodeFactory.uInt64Constant({
          sourceLocation,
          value: 0n,
        }),
      )
    }
    const [arg0] = args
    if (arg0 instanceof Literal && typeof arg0.value == 'bigint') {
      return new UInt64ExpressionBuilder(
        nodeFactory.uInt64Constant({
          sourceLocation,
          value: arg0.value,
        }),
      )
    }
    throw CodeError.unexpectedUnhandledArgs({ sourceLocation })
  }
}

export class UInt64ExpressionBuilder extends ValueExpressionBuilder {
  get wtype(): wtypes.WType {
    return wtypes.uint64WType
  }
  compare(other: ExpressionBuilder | Literal, op: BuilderComparisonOp, sourceLocation: SourceLocation): ExpressionBuilder {
    const otherExpr = requireExpressionOfType(other, wtypes.uint64WType)
    const numComOp = tryConvertEnum(op, BuilderComparisonOp, NumericComparison)
    if (numComOp == undefined) {
      throw new NotSupported(`Numeric comparison operator ${op}`, {
        sourceLocation,
      })
    }
    return new BoolExpressionBuilder(
      nodeFactory.numericComparisonExpression({
        lhs: this._expr,
        rhs: otherExpr,
        operator: numComOp,
        sourceLocation,
        wtype: wtypes.boolWType,
      }),
    )
  }

  binaryOp(other: ExpressionBuilder | Literal, op: BuilderBinaryOp, sourceLocation: SourceLocation): ExpressionBuilder {
    const otherExpr = requireExpressionOfType(other, wtypes.uint64WType)

    const uintOp = op == BuilderBinaryOp.div ? UInt64BinaryOperator.floorDiv : tryConvertEnum(op, BuilderBinaryOp, UInt64BinaryOperator)
    if (uintOp == undefined) {
      throw new NotSupported(`UInt64 binary operator ${op}`, {
        sourceLocation,
      })
    }
    return new UInt64ExpressionBuilder(
      nodeFactory.uInt64BinaryOperation({
        left: this._expr,
        right: otherExpr,
        op: uintOp,
        sourceLocation,
        wtype: wtypes.uint64WType,
      }),
    )
  }
}
