import type { awst } from '../../awst'
import { wtypes } from '../../awst'
import { intrinsicFactory } from '../../awst/intrinsic-factory'
import { nodeFactory } from '../../awst/node-factory'
import type { Expression } from '../../awst/nodes'
import { BytesBinaryOperator, BytesConstant, BytesEncoding, BytesUnaryOperator, StringConstant } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { stringWType } from '../../awst/wtypes'
import { CodeError, wrapInCodeError } from '../../errors'
import { logger } from '../../logger'
import { base32ToUint8Array, base64ToUint8Array, hexToUint8Array, uint8ArrayToUtf8, utf8ToUint8Array } from '../../util'
import type { InstanceType, PType } from '../ptypes'
import { bigIntPType, biguintPType, BytesFunction, bytesPType, numberPType, NumericLiteralPType, stringPType, uint64PType } from '../ptypes'
import { instanceEb } from '../type-registry'
import type { BuilderComparisonOp, InstanceBuilder, NodeBuilder } from './index'
import { BuilderUnaryOp, FunctionBuilder, InstanceExpressionBuilder, ParameterlessFunctionBuilder } from './index'
import { BigIntLiteralExpressionBuilder } from './literal/big-int-literal-expression-builder'
import { StringExpressionBuilder } from './string-expression-builder'
import { UInt64ExpressionBuilder } from './uint64-expression-builder'
import { requireExpressionOfType, requireExpressionsOfType } from './util'
import { parseFunctionArgs } from './util/arg-parsing'
import { compareBytes } from './util/compare-bytes'

export class BytesFunctionBuilder extends FunctionBuilder {
  readonly ptype = BytesFunction

  taggedTemplate(head: string, spans: ReadonlyArray<readonly [InstanceBuilder, string]>, sourceLocation: SourceLocation): InstanceBuilder {
    let result: awst.Expression = nodeFactory.bytesConstant({
      sourceLocation,
      encoding: BytesEncoding.utf8,
      value: utf8ToUint8Array(head),
    })
    for (const [value, joiningText] of spans) {
      const valueBytes = value.ptype?.equals(stringPType) ? value.resolve() : value.toBytes(sourceLocation)
      result = nodeFactory.bytesBinaryOperation({
        left: result,
        right: valueBytes,
        op: BytesBinaryOperator.add,
        sourceLocation,
        wtype: wtypes.bytesWType,
      })
      if (joiningText) {
        result = nodeFactory.bytesBinaryOperation({
          left: result,
          right: nodeFactory.bytesConstant({
            sourceLocation,
            value: utf8ToUint8Array(joiningText),
            encoding: BytesEncoding.utf8,
          }),
          op: BytesBinaryOperator.add,
          sourceLocation,
          wtype: wtypes.bytesWType,
        })
      }
    }

    return new BytesExpressionBuilder(result)
  }

  call(args: Array<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const {
      args: [initialValue],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: 'Bytes',
      argSpec: (a) => [a.optional(numberPType, bigIntPType, uint64PType, biguintPType, stringPType, bytesPType)],
    })
    const empty = nodeFactory.bytesConstant({
      sourceLocation,
      value: new Uint8Array(),
    })

    let bytesExpr

    if (!initialValue) {
      bytesExpr = empty
    } else if (initialValue instanceof BigIntLiteralExpressionBuilder) {
      logger.error(initialValue.sourceLocation, initialValue.ptype.expressionMessage)
      bytesExpr = empty
    } else if (initialValue.ptype.equals(uint64PType)) {
      bytesExpr = initialValue.toBytes(sourceLocation)
    } else if (initialValue.ptype.equals(biguintPType)) {
      bytesExpr = initialValue.toBytes(sourceLocation)
    } else if (initialValue.ptype.equals(stringPType)) {
      bytesExpr = initialValue.toBytes(sourceLocation)
    } else {
      return initialValue
    }
    return new BytesExpressionBuilder(bytesExpr)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'fromHex':
        return new FromEncodingBuilder(sourceLocation, hexToUint8Array, BytesEncoding.base16)
      case 'fromBase32':
        return new FromEncodingBuilder(sourceLocation, base32ToUint8Array, BytesEncoding.base32)
      case 'fromBase64':
        return new FromEncodingBuilder(sourceLocation, base64ToUint8Array, BytesEncoding.base64)
    }
    return super.memberAccess(name, sourceLocation)
  }
}

class FromEncodingBuilder extends FunctionBuilder {
  constructor(
    sourceLocation: SourceLocation,
    private decodeLiteral: (value: string) => Uint8Array,
    private encoding: BytesEncoding,
  ) {
    super(sourceLocation)
  }
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    const [value] = requireExpressionsOfType(args, [stringPType], sourceLocation)

    if (value instanceof StringConstant) {
      return new BytesExpressionBuilder(
        nodeFactory.bytesConstant({
          value: wrapInCodeError(() => this.decodeLiteral(value.value), value.sourceLocation),
          encoding: this.encoding,
          sourceLocation,
        }),
      )
    }
    throw CodeError.expectedCompileTimeConstant({ sourceLocation })
  }
}

export class BytesExpressionBuilder extends InstanceExpressionBuilder<InstanceType> {
  constructor(expr: Expression) {
    super(expr, bytesPType)
  }
  prefixUnaryOp(op: BuilderUnaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    switch (op) {
      case BuilderUnaryOp.bit_inv:
        logger.error(
          sourceLocation,
          `The '~' ${this.typeDescription} operator coerces the target value to a number type. Use {bytes expression}.bitwiseInvert() instead`,
        )
        return new BigIntLiteralExpressionBuilder(0n, new NumericLiteralPType({ literalValue: 0n }), sourceLocation)
    }
    return super.prefixUnaryOp(op, sourceLocation)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'length':
        return new UInt64ExpressionBuilder(
          intrinsicFactory.bytesLen({
            value: this._expr,
            sourceLocation,
          }),
        )
      case 'bitwiseInvert':
        return new BytesInvertBuilder(this._expr)
      case 'toString':
        return new ToStringBuilder(this._expr)
      case 'concat':
        return new ConcatExpressionBuilder(this._expr)
      case 'at':
        return new BytesAtBuilder(this._expr)
    }
    return super.memberAccess(name, sourceLocation)
  }
  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    return compareBytes(this._expr, requireExpressionOfType(other, bytesPType), op, sourceLocation, this.typeDescription)
  }
  boolEval(sourceLocation: SourceLocation, negate: boolean): awst.Expression {
    return new UInt64ExpressionBuilder(
      intrinsicFactory.bytesLen({
        value: this._expr,
        sourceLocation,
      }),
    ).boolEval(sourceLocation, negate)
  }

  toBytes(): awst.Expression {
    return this.resolve()
  }

  toString(sourceLocation: SourceLocation): Expression {
    if (this._expr instanceof BytesConstant) {
      return nodeFactory.stringConstant({
        value: uint8ArrayToUtf8(this._expr.value),
        sourceLocation: this._expr.sourceLocation,
      })
    }
    return nodeFactory.reinterpretCast({
      expr: this._expr,
      sourceLocation,
      wtype: stringWType,
    })
  }
}

export class ConcatExpressionBuilder extends FunctionBuilder {
  constructor(private expr: awst.Expression) {
    super(expr.sourceLocation)
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation) {
    const [other] = requireExpressionsOfType(args, [bytesPType], sourceLocation)
    return new BytesExpressionBuilder(
      intrinsicFactory.bytesConcat({
        left: this.expr,
        right: other,
        sourceLocation: sourceLocation,
      }),
    )
  }
}

export class BytesInvertBuilder extends ParameterlessFunctionBuilder {
  constructor(private expr: awst.Expression) {
    super(
      expr,
      (expr, sourceLocation) =>
        new BytesExpressionBuilder(
          nodeFactory.bytesUnaryOperation({
            wtype: wtypes.bytesWType,
            expr: this.expr,
            op: BytesUnaryOperator.bitInvert,
            sourceLocation,
          }),
        ),
    )
  }
}

export class BytesSliceBuilder extends FunctionBuilder {
  constructor(private expr: awst.Expression) {
    super(expr.sourceLocation)
  }
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation) {
    // TODO: Needs to do range check on target and handle negative values
    // TODO: Also handle single arg
    const [start, stop] = requireExpressionsOfType(args, [uint64PType, uint64PType], sourceLocation)
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

export class ToStringBuilder extends ParameterlessFunctionBuilder {
  constructor(private expr: awst.Expression) {
    super(
      expr,
      (expr, sourceLocation) =>
        new StringExpressionBuilder(
          nodeFactory.reinterpretCast({
            wtype: wtypes.stringWType,
            expr: this.expr,
            sourceLocation,
          }),
        ),
    )
  }
}

export class BytesAtBuilder extends FunctionBuilder {
  constructor(private expr: awst.Expression) {
    super(expr.sourceLocation)
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation) {
    const [index] = requireExpressionsOfType(args, [uint64PType], sourceLocation)
    // TODO: Needs to do range check on target and handle negative values
    return instanceEb(
      nodeFactory.sliceExpression({
        base: this.expr,
        sourceLocation: sourceLocation,
        beginIndex: index,
        endIndex: nodeFactory.uInt64Constant({ value: 1n, sourceLocation }),
        wtype: wtypes.bytesWType,
      }),
      bytesPType,
    )
  }
}
