import { intrinsicFactory } from '../../awst/intrinsic-factory'
import { nodeFactory } from '../../awst/node-factory'
import type { Expression } from '../../awst/nodes'
import { BoolConstant, UInt64BinaryOperator, UInt64PostfixUnaryOperator, UInt64UnaryOperator } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'

import { NotSupported } from '../../errors'
import { codeInvariant, tryConvertEnum } from '../../util'
import type { InstanceType, PType } from '../ptypes'
import {
  BigIntLiteralPType,
  boolPType,
  BytesPType,
  itoaMethod,
  NumericLiteralPType,
  stringPType,
  Uint64Function,
  uint64PType,
} from '../ptypes'
import { instanceEb } from '../type-registry'
import type { BuilderComparisonOp, InstanceBuilder, NodeBuilder } from './index'
import { BuilderBinaryOp, BuilderUnaryOp, FunctionBuilder, InstanceExpressionBuilder } from './index'
import { BigIntLiteralExpressionBuilder } from './literal/big-int-literal-expression-builder'
import { requireExpressionOfType, requireStringConstant } from './util'
import { parseFunctionArgs } from './util/arg-parsing'
import { compareUint64 } from './util/compare-uint64'
import { stringToBigint } from './util/string-to-bigint'

export class UInt64FunctionBuilder extends FunctionBuilder {
  readonly ptype = Uint64Function

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [value],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: 'Uint64',
      argSpec: (a) => [a.optional(uint64PType, NumericLiteralPType, BigIntLiteralPType, boolPType, stringPType)],
    })

    if (!value) {
      return new UInt64ExpressionBuilder(
        nodeFactory.uInt64Constant({
          sourceLocation,
          value: 0n,
        }),
      )
    }
    if (value instanceof BigIntLiteralExpressionBuilder) {
      return new UInt64ExpressionBuilder(
        nodeFactory.uInt64Constant({
          sourceLocation,
          value: value.value,
        }),
      )
    } else if (value.ptype.equals(boolPType)) {
      const expr = value.resolve()
      if (expr instanceof BoolConstant) {
        return new UInt64ExpressionBuilder(
          nodeFactory.uInt64Constant({
            sourceLocation,
            value: expr.value ? 1n : 0n,
          }),
        )
      } else {
        return new UInt64ExpressionBuilder(
          nodeFactory.reinterpretCast({
            expr,
            wtype: wtypes.uint64WType,
            sourceLocation,
          }),
        )
      }
    } else if (value.ptype.equals(stringPType)) {
      const valueStr = requireStringConstant(value)
      return new UInt64ExpressionBuilder(
        nodeFactory.uInt64Constant({
          value: stringToBigint(valueStr),
          sourceLocation,
        }),
      )
    }
    return value.resolveToPType(uint64PType)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'MAX_VALUE':
        return new UInt64ExpressionBuilder(
          nodeFactory.uInt64Constant({
            value: 2n ** 64n - 1n,
            sourceLocation,
          }),
        )
      case 'MIN_VALUE':
        return new UInt64ExpressionBuilder(
          nodeFactory.uInt64Constant({
            value: 0n,
            sourceLocation,
          }),
        )
    }
    return super.memberAccess(name, sourceLocation)
  }
}

export class UInt64ExpressionBuilder extends InstanceExpressionBuilder<InstanceType> {
  constructor(expr: Expression) {
    super(expr, uint64PType)
  }
  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'toString':
        return new ToStringFunctionBuilder(this, sourceLocation)
    }
    return super.memberAccess(name, sourceLocation)
  }

  boolEval(sourceLocation: SourceLocation, negate: boolean): Expression {
    const asBool = nodeFactory.reinterpretCast({
      sourceLocation,
      expr: this.resolve(),
      wtype: wtypes.boolWType,
    })
    if (negate) {
      return nodeFactory.not({
        expr: asBool,
        sourceLocation,
      })
    }
    return asBool
  }

  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    const otherExpr = requireExpressionOfType(other, uint64PType)
    return compareUint64(this._expr, otherExpr, op, sourceLocation, this.typeDescription)
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
    const otherExpr = requireExpressionOfType(other, uint64PType)

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

  toBytes(sourceLocation: SourceLocation): InstanceBuilder {
    return instanceEb(intrinsicFactory.itob({ value: this.resolve(), sourceLocation }), new BytesPType({ length: 8n }))
  }

  toString(sourceLocation: SourceLocation): Expression {
    return nodeFactory.subroutineCallExpression({
      wtype: wtypes.stringWType,
      target: nodeFactory.subroutineID({ target: itoaMethod.fullName }),
      args: [
        nodeFactory.callArg({
          name: 'i',
          value: this.resolve(),
        }),
      ],
      sourceLocation,
    })
  }
}

class ToStringFunctionBuilder extends FunctionBuilder {
  constructor(
    private builder: UInt64ExpressionBuilder,
    sourceLocation: SourceLocation,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [radix],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      argSpec: (a) => [a.optional(uint64PType)],
      funcName: 'toString',
      callLocation: sourceLocation,
    })
    codeInvariant(!radix, 'the radix parameter is not supported', radix?.sourceLocation)

    return instanceEb(this.builder.toString(sourceLocation), stringPType)
  }
}
