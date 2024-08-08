import type { awst } from '../../awst'
import type { InstanceBuilder } from './index'
import { BuilderBinaryOp, BuilderComparisonOp, BuilderUnaryOp, FunctionBuilder, InstanceExpressionBuilder } from './index'
import type { Expression } from '../../awst/nodes'
import { BigUIntBinaryOperator, BigUIntPostfixUnaryOperator, NumericComparison } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { nodeFactory } from '../../awst/node-factory'
import { CodeError, NotSupported } from '../../errors'
import { requireExpressionOfType } from './util'
import { tryConvertEnum } from '../../util'
import type { PType } from '../ptypes'
import { biguintPType, Uint64Function } from '../ptypes'
import { BooleanExpressionBuilder } from './boolean-expression-builder'
import { intrinsicFactory } from '../../awst/intrinsic-factory'
import type { InstanceType } from '../ptypes'
import { logger } from '../../logger'
import { UInt64ExpressionBuilder } from './uint64-expression-builder'
import { LiteralExpressionBuilder } from './literal-expression-builder'

export class BigUintFunctionBuilder extends FunctionBuilder {
  get ptype(): PType | undefined {
    return Uint64Function
  }

  call(args: Array<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    if (args.length === 0) {
      return new BigUintExpressionBuilder(
        nodeFactory.bigUIntConstant({
          sourceLocation,
          value: 0n,
        }),
      )
    }
    if (args.length === 1) {
      const [arg0] = args
      if (arg0 instanceof LiteralExpressionBuilder) {
        return arg0.resolveToPType(biguintPType, sourceLocation)
      }
    }
    throw CodeError.unexpectedUnhandledArgs({ sourceLocation })
  }
}

export class BigUintExpressionBuilder extends InstanceExpressionBuilder<InstanceType> {
  constructor(expr: Expression) {
    super(expr, biguintPType)
  }
  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    const otherExpr = requireExpressionOfType(other, biguintPType, sourceLocation)
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
  boolEval(sourceLocation: SourceLocation, negate: boolean = false): Expression {
    return new UInt64ExpressionBuilder(
      intrinsicFactory.bitLen({
        value: this._expr,
        sourceLocation,
      }),
    ).boolEval(sourceLocation, negate)
  }

  prefixUnaryOp(op: BuilderUnaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    let binaryOp: BigUIntBinaryOperator

    switch (op) {
      case BuilderUnaryOp.inc:
        binaryOp = BigUIntBinaryOperator.add
        break
      case BuilderUnaryOp.dec:
        binaryOp = BigUIntBinaryOperator.sub
        break
      case BuilderUnaryOp.bit_inv:
        logger.error(sourceLocation, `Bitwise inversion of ${this.typeDescription} is not supported as the bit size is indeterminate`)
        return this

      case BuilderUnaryOp.pos:
        return this
      default:
        return super.prefixUnaryOp(op, sourceLocation)
    }
    return new BigUintExpressionBuilder(
      nodeFactory.assignmentExpression({
        target: this.resolveLValue(),
        sourceLocation,
        value: nodeFactory.bigUIntBinaryOperation({
          left: this.resolve(),
          right: nodeFactory.bigUIntConstant({ value: 1n, sourceLocation }),
          op: binaryOp,
          sourceLocation,
        }),
      }),
    )
  }

  postfixUnaryOp(op: BuilderUnaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    let unaryOp: BigUIntPostfixUnaryOperator
    switch (op) {
      case BuilderUnaryOp.inc:
        unaryOp = BigUIntPostfixUnaryOperator.increment
        break
      case BuilderUnaryOp.dec:
        unaryOp = BigUIntPostfixUnaryOperator.decrement
        break
      default:
        return super.postfixUnaryOp(op, sourceLocation)
    }
    return new BigUintExpressionBuilder(
      nodeFactory.bigUIntPostfixUnaryOperation({
        sourceLocation,
        target: this.resolveLValue(),
        wtype: this.ptype.wtype,
        op: unaryOp,
      }),
    )
  }

  binaryOp(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    const otherExpr = requireExpressionOfType(other, biguintPType, sourceLocation)

    const uintOp = op === BuilderBinaryOp.div ? BigUIntBinaryOperator.floorDiv : tryConvertEnum(op, BuilderBinaryOp, BigUIntBinaryOperator)
    if (uintOp === undefined) {
      throw new NotSupported(`BigUint binary operator '${op}'`, {
        sourceLocation,
      })
    }
    return new BigUintExpressionBuilder(
      nodeFactory.bigUIntBinaryOperation({
        left: this._expr,
        right: otherExpr,
        op: uintOp,
        sourceLocation,
      }),
    )
  }

  augmentedAssignment(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    return new BigUintExpressionBuilder(
      nodeFactory.assignmentExpression({
        target: this.resolveLValue(),
        value: this.binaryOp(other, op, sourceLocation).resolve(),
        sourceLocation,
      }),
    )
  }

  assign(other: InstanceBuilder, sourceLocation: SourceLocation): InstanceBuilder {
    return new BigUintExpressionBuilder(
      nodeFactory.assignmentExpression({
        target: this.resolveLValue(),
        sourceLocation,
        value: requireExpressionOfType(other, biguintPType, sourceLocation),
      }),
    )
  }

  toBytes(sourceLocation: SourceLocation): awst.Expression {
    return intrinsicFactory.itob({ value: this.resolve(), sourceLocation })
  }
}
