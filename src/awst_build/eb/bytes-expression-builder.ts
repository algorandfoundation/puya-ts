import type { awst } from '../../awst'

import { intrinsicFactory } from '../../awst/intrinsic-factory'
import { nodeFactory } from '../../awst/node-factory'
import type { Expression } from '../../awst/nodes'
import {
  BytesBinaryOperator,
  BytesConstant,
  BytesEncoding,
  BytesUnaryOperator,
  EqualityComparison,
  IntegerConstant,
} from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'
import { wrapInCodeError } from '../../errors'
import { logger } from '../../logger'
import { base32ToUint8Array, base64ToUint8Array, enumKeyFromValue, hexToUint8Array, uint8ArrayToUtf8, utf8ToUint8Array } from '../../util'
import type { InstanceType, PType } from '../ptypes'
import {
  ArrayPType,
  bigIntPType,
  biguintPType,
  BytesFunction,
  bytesPType,
  numberPType,
  NumericLiteralPType,
  stringPType,
  uint64PType,
} from '../ptypes'
import { BooleanExpressionBuilder } from './boolean-expression-builder'
import type { BuilderComparisonOp, InstanceBuilder, NodeBuilder } from './index'
import { BuilderUnaryOp, FunctionBuilder, InstanceExpressionBuilder, ParameterlessFunctionBuilder } from './index'
import { BigIntLiteralExpressionBuilder } from './literal/big-int-literal-expression-builder'
import { AtFunctionBuilder } from './shared/at-function-builder'
import { SliceFunctionBuilder } from './shared/slice-function-builder'
import { StringExpressionBuilder } from './string-expression-builder'
import { isStaticallyIterable, StaticIterator } from './traits/static-iterator'
import { UInt64ExpressionBuilder } from './uint64-expression-builder'
import { requireExpressionOfType, requireStringConstant } from './util'
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

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [initialValue],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: 'Bytes',
      argSpec: (a) => [
        a.optional(
          numberPType,
          bigIntPType,
          uint64PType,
          biguintPType,
          stringPType,
          bytesPType,
          new ArrayPType({ elementType: uint64PType }),
        ),
      ],
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
    } else if (initialValue.ptype.equals(bytesPType)) {
      return initialValue
    } else {
      if (isStaticallyIterable(initialValue)) {
        const bytes: number[] = []
        for (const item of initialValue[StaticIterator]()) {
          const byte = item.resolve()
          if (byte instanceof IntegerConstant && byte.value < 256n) {
            bytes.push(Number(byte.value))
          } else {
            logger.error(item.sourceLocation, 'A compile time constant value between 0 and 255 is expected here')
            break
          }
        }
        bytesExpr = nodeFactory.bytesConstant({
          value: Uint8Array.from(bytes),
          sourceLocation: initialValue.sourceLocation,
        })
      } else {
        logger.error(initialValue.sourceLocation, 'Only array literals or tuples are supported here')
        bytesExpr = empty
      }
    }
    return new BytesExpressionBuilder(bytesExpr)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'fromHex':
        return new FromEncodingBuilder(sourceLocation, hexToUint8Array, BytesEncoding.base16, 'fromHex')
      case 'fromBase32':
        return new FromEncodingBuilder(sourceLocation, base32ToUint8Array, BytesEncoding.base32, 'fromBase32')
      case 'fromBase64':
        return new FromEncodingBuilder(sourceLocation, base64ToUint8Array, BytesEncoding.base64, 'fromBase64')
    }
    return super.memberAccess(name, sourceLocation)
  }
}

class FromEncodingBuilder extends FunctionBuilder {
  constructor(
    sourceLocation: SourceLocation,
    private decodeLiteral: (value: string) => Uint8Array,
    private encoding: BytesEncoding,
    private functionName: string,
  ) {
    super(sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [valueBuilder],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      genericTypeArgs: 0,
      funcName: this.functionName,
      argSpec: (a) => [a.required(stringPType)],
    })

    const value = requireStringConstant(valueBuilder)

    return new BytesExpressionBuilder(
      nodeFactory.bytesConstant({
        value: wrapInCodeError(() => this.decodeLiteral(value.value), value.sourceLocation),
        encoding: this.encoding,
        sourceLocation,
      }),
    )
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
      case 'bitwiseAnd':
        return new BitwiseOpFunctionBuilder(this._expr, BytesBinaryOperator.bitAnd)
      case 'bitwiseOr':
        return new BitwiseOpFunctionBuilder(this._expr, BytesBinaryOperator.bitOr)
      case 'bitwiseXor':
        return new BitwiseOpFunctionBuilder(this._expr, BytesBinaryOperator.bitXor)
      case 'toString':
        return new ToStringBuilder(this._expr)
      case 'concat':
        return new ConcatExpressionBuilder(this._expr)
      case 'at':
        return new AtFunctionBuilder(
          this._expr,
          bytesPType,
          requireExpressionOfType(this.memberAccess('length', sourceLocation), uint64PType),
        )
      case 'slice':
        return new SliceFunctionBuilder(this._expr, bytesPType)
      case 'equals':
        return new EqualsFunctionBuilder(this._expr)
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
      wtype: wtypes.stringWType,
    })
  }
}

export class ConcatExpressionBuilder extends FunctionBuilder {
  constructor(private expr: awst.Expression) {
    super(expr.sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [other],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      funcName: 'concat',
      genericTypeArgs: 0,
      argSpec: (a) => [a.required(bytesPType)],
    })
    return new BytesExpressionBuilder(
      intrinsicFactory.bytesConcat({
        left: this.expr,
        right: other.resolve(),
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

export class BitwiseOpFunctionBuilder extends FunctionBuilder {
  constructor(
    private expr: awst.Expression,
    private op: BytesBinaryOperator,
  ) {
    super(expr.sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [other],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: enumKeyFromValue(this.op, BytesBinaryOperator),
      argSpec: (a) => [a.required(bytesPType)],
    })
    return new BytesExpressionBuilder(
      nodeFactory.bytesBinaryOperation({
        wtype: wtypes.bytesWType,
        left: this.expr,
        right: other.resolve(),
        op: this.op,
        sourceLocation,
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

class EqualsFunctionBuilder extends FunctionBuilder {
  constructor(private expr: awst.Expression) {
    super(expr.sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [right],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: 'equals',
      argSpec: (a) => [a.required(bytesPType)],
    })
    return new BooleanExpressionBuilder(
      nodeFactory.bytesComparisonExpression({
        operator: EqualityComparison.eq,
        lhs: this.expr,
        rhs: right.resolve(),
        sourceLocation,
      }),
    )
  }
}
