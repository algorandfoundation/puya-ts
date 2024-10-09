import { awst } from '../../awst'
import { intrinsicFactory } from '../../awst/intrinsic-factory'
import { nodeFactory } from '../../awst/node-factory'
import type { Expression } from '../../awst/nodes'
import { BigUIntBinaryOperator, BigUIntPostfixUnaryOperator, IntegerConstant, NumericComparison } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { NotSupported } from '../../errors'
import { logger } from '../../logger'
import { tryConvertEnum } from '../../util'
import type { InstanceType, PType } from '../ptypes'
import { BigUintFunction, biguintPType, boolPType, bytesPType, stringPType, uint64PType } from '../ptypes'
import { BooleanExpressionBuilder } from './boolean-expression-builder'
import type { InstanceBuilder } from './index'
import { BuilderBinaryOp, BuilderComparisonOp, BuilderUnaryOp, FunctionBuilder, InstanceExpressionBuilder } from './index'
import { UInt64ExpressionBuilder } from './uint64-expression-builder'
import { requireExpressionOfType } from './util'
import { parseFunctionArgs } from './util/arg-parsing'

export class BigUintFunctionBuilder extends FunctionBuilder {
  readonly ptype = BigUintFunction

  call(args: Array<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const {
      args: [initialValue],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: 'BigUInt',
      argSpec: (a) => [a.optional(boolPType, stringPType, bytesPType, biguintPType, uint64PType)],
    })
    let biguint: Expression

    if (!initialValue) {
      biguint = nodeFactory.bigUIntConstant({
        sourceLocation,
        value: 0n,
      })
    } else if (initialValue.ptype.equals(boolPType)) {
      biguint = nodeFactory.reinterpretCast({
        expr: initialValue.toBytes(sourceLocation),
        sourceLocation,
        wtype: biguintPType.wtype,
      })
    } else if (initialValue.ptype.equals(stringPType)) {
      const expr = initialValue.resolve()
      if (expr instanceof awst.StringConstant) {
        biguint = nodeFactory.bigUIntConstant({
          value: BigInt(expr.value),
          sourceLocation,
        })
      } else {
        logger.error(initialValue.sourceLocation, 'Only compile time constant string values are supported')
        biguint = nodeFactory.bigUIntConstant({ value: 0n, sourceLocation })
      }
    } else if (initialValue.ptype.equals(bytesPType)) {
      biguint = nodeFactory.reinterpretCast({
        expr: initialValue.resolve(),
        sourceLocation,
        wtype: biguintPType.wtype,
      })
    } else if (initialValue.ptype.equals(uint64PType)) {
      const expr = initialValue.resolve()
      if (expr instanceof IntegerConstant) {
        biguint = nodeFactory.bigUIntConstant({
          ...expr,
        })
      }
      biguint = nodeFactory.reinterpretCast({
        expr: initialValue.toBytes(sourceLocation),
        sourceLocation,
        wtype: biguintPType.wtype,
      })
    } else {
      return initialValue
    }
    return new BigUintExpressionBuilder(biguint)
  }
}

export class BigUintExpressionBuilder extends InstanceExpressionBuilder<InstanceType> {
  constructor(expr: Expression) {
    super(expr, biguintPType)
  }
  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    const otherExpr = requireExpressionOfType(other, biguintPType)
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
    const otherExpr = requireExpressionOfType(other, biguintPType)

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
        value: requireExpressionOfType(other, biguintPType),
      }),
    )
  }

  toBytes(sourceLocation: SourceLocation): awst.Expression {
    return intrinsicFactory.itob({ value: this.resolve(), sourceLocation })
  }
}
