import type { awst } from '../../awst'
import type { InstanceBuilder } from './index'
import { BuilderBinaryOp, BuilderComparisonOp, BuilderUnaryOp, FunctionBuilder, InstanceExpressionBuilder } from './index'
import type { Expression } from '../../awst/nodes'
import { NumericComparison, UInt64BinaryOperator, UInt64PostfixUnaryOperator, UInt64UnaryOperator } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { nodeFactory } from '../../awst/node-factory'
import { CodeError, NotSupported } from '../../errors'
import { requireExpressionOfType } from './util'
import { tryConvertEnum } from '../../util'
import type { PType } from '../ptypes'
import { Uint64Function, uint64PType } from '../ptypes'
import { BooleanExpressionBuilder } from './boolean-expression-builder'
import { intrinsicFactory } from '../../awst/intrinsic-factory'
import type { InstanceType } from '../ptypes'
import { boolWType } from '../../awst/wtypes'
import { LiteralExpressionBuilder } from './literal-expression-builder'

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
        return arg0.resolveToPType(uint64PType, sourceLocation)
      }
    }
    throw CodeError.unexpectedUnhandledArgs({ sourceLocation })
  }
}

export class UInt64ExpressionBuilder extends InstanceExpressionBuilder<InstanceType> {
  constructor(expr: Expression) {
    super(expr, uint64PType)
  }
  boolEval(sourceLocation: SourceLocation, negate: boolean): Expression {
    if (negate) {
      return nodeFactory.not({
        expr: this.resolve(),
        sourceLocation,
      })
    }
    return nodeFactory.reinterpretCast({
      sourceLocation,
      expr: this.resolve(),
      wtype: boolWType,
    })
  }

  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    const otherExpr = requireExpressionOfType(other, uint64PType, sourceLocation)
    const numComOp = tryConvertEnum(op, BuilderComparisonOp, NumericComparison)
    if (numComOp === undefined) {
      throw new NotSupported(`Numeric comparison operator ${op}`, {
        sourceLocation,
      })
    }
    return new BooleanExpressionBuilder(
      nodeFactory.numericComparisonExpression({
        lhs: this._expr,
        rhs: otherExpr,
        operator: numComOp,
        sourceLocation,
      }),
    )
  }

  prefixUnaryOp(op: BuilderUnaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    let binaryOp: UInt64BinaryOperator

    switch (op) {
      case BuilderUnaryOp.inc:
        binaryOp = UInt64BinaryOperator.add
        break
      case BuilderUnaryOp.dec:
        binaryOp = UInt64BinaryOperator.sub
        break
      case BuilderUnaryOp.bit_inv:
        return new UInt64ExpressionBuilder(
          nodeFactory.uInt64UnaryOperation({
            op: UInt64UnaryOperator.bitInvert,
            sourceLocation,
            expr: this.resolve(),
            wtype: this.ptype.wtype,
          }),
        )
      case BuilderUnaryOp.pos:
        return this
      default:
        return super.prefixUnaryOp(op, sourceLocation)
    }
    return new UInt64ExpressionBuilder(
      nodeFactory.assignmentExpression({
        target: this.resolveLValue(),
        sourceLocation,
        value: nodeFactory.uInt64BinaryOperation({
          left: this.resolve(),
          right: nodeFactory.uInt64Constant({ value: 1n, sourceLocation }),
          op: binaryOp,
          sourceLocation,
        }),
      }),
    )
  }

  postfixUnaryOp(op: BuilderUnaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    let unaryOp: UInt64PostfixUnaryOperator
    switch (op) {
      case BuilderUnaryOp.inc:
        unaryOp = UInt64PostfixUnaryOperator.increment
        break
      case BuilderUnaryOp.dec:
        unaryOp = UInt64PostfixUnaryOperator.decrement
        break
      default:
        return super.postfixUnaryOp(op, sourceLocation)
    }
    return new UInt64ExpressionBuilder(
      nodeFactory.uInt64PostfixUnaryOperation({
        sourceLocation,
        target: this.resolveLValue(),
        wtype: this.ptype.wtype,
        op: unaryOp,
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
      }),
    )
  }

  augmentedAssignment(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    return new UInt64ExpressionBuilder(
      nodeFactory.assignmentExpression({
        target: this.resolveLValue(),
        value: this.binaryOp(other, op, sourceLocation).resolve(),
        sourceLocation,
      }),
    )
  }

  assign(other: InstanceBuilder, sourceLocation: SourceLocation): InstanceBuilder {
    return new UInt64ExpressionBuilder(
      nodeFactory.assignmentExpression({
        target: this.resolveLValue(),
        sourceLocation,
        value: requireExpressionOfType(other, uint64PType, sourceLocation),
      }),
    )
  }

  toBytes(sourceLocation: SourceLocation): awst.Expression {
    return intrinsicFactory.itob({ value: this.resolve(), sourceLocation })
  }
}
