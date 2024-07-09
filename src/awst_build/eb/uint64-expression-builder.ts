import { awst, wtypes } from '../../awst'
import { BuilderBinaryOp, BuilderComparisonOp, FunctionBuilder, InstanceBuilder, InstanceExpressionBuilder, requireLValue } from './index'
import { NumericComparison, UInt64BinaryOperator } from '../../awst/nodes'
import { SourceLocation } from '../../awst/source-location'
import { nodeFactory } from '../../awst/node-factory'
import { CodeError, NotSupported } from '../../errors'
import { requireExpressionOfType } from './util'
import { tryConvertEnum } from '../../util'
import { PType, Uint64Function, uint64PType } from '../ptypes'
import { BoolExpressionBuilder } from './bool-expression-builder'
import { LiteralExpressionBuilder } from './literal-expression-builder'
import { intrinsicFactory } from '../../awst/intrinsic-factory'

export class UInt64FunctionBuilder extends FunctionBuilder {
  get ptype(): PType | undefined {
    return Uint64Function
  }

  call(args: Array<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    if (args.length === 0) {
      return new UInt64ExpressionBuilder(
        nodeFactory.uInt64Constant({
          sourceLocation,
          value: 0n,
        }),
      )
    }
    if (args.length === 1) {
      const [arg0] = args
      if (arg0 instanceof LiteralExpressionBuilder) {
        return arg0.resolveToPType(uint64PType)
      }
    }
    throw CodeError.unexpectedUnhandledArgs({ sourceLocation })
  }
}

export class UInt64ExpressionBuilder extends InstanceExpressionBuilder {
  get ptype() {
    return uint64PType
  }
  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    const otherExpr = requireExpressionOfType(other, uint64PType, sourceLocation)
    const numComOp = tryConvertEnum(op, BuilderComparisonOp, NumericComparison)
    if (numComOp === undefined) {
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

  binaryOp(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    const otherExpr = requireExpressionOfType(other, uint64PType, sourceLocation)

    const uintOp = op === BuilderBinaryOp.div ? UInt64BinaryOperator.floorDiv : tryConvertEnum(op, BuilderBinaryOp, UInt64BinaryOperator)
    if (uintOp === undefined) {
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

  augmentedAssignment(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    return new UInt64ExpressionBuilder(
      nodeFactory.assignmentExpression({
        target: this.resolveLValue(),
        value: this.binaryOp(other, op, sourceLocation).resolve(),
        sourceLocation,
        wtype: wtypes.uint64WType,
      }),
    )
  }

  assign(other: InstanceBuilder, sourceLocation: SourceLocation): InstanceBuilder {
    return new UInt64ExpressionBuilder(
      nodeFactory.assignmentExpression({
        target: this.resolveLValue(),
        sourceLocation,
        value: requireExpressionOfType(other, uint64PType, sourceLocation),
        wtype: uint64PType.wtypeOrThrow,
      }),
    )
  }

  toBytes(sourceLocation: SourceLocation): awst.Expression {
    return intrinsicFactory.itob({ value: this.resolve(), sourceLocation })
  }
}
