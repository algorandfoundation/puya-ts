import { awst, wtypes } from '../../awst'
import {
  BuilderComparisonOp,
  BuilderUnaryOp,
  FunctionBuilder,
  InstanceBuilder,
  InstanceExpressionBuilder,
  LiteralExpressionBuilder,
  NodeBuilder,
  ParameterlessFunctionBuilder,
} from './index'
import { SourceLocation } from '../../awst/source-location'
import { nodeFactory } from '../../awst/node-factory'
import { CodeError, wrapInCodeError } from '../../errors'
import { UInt64ExpressionBuilder } from './uint64-expression-builder'
import { intrinsicFactory } from '../../awst/intrinsic-factory'
import { requireExpressionOfType, requireExpressionsOfType } from './util'
import { BytesFunction, bytesPType, PType, stringPType, uint64PType } from '../ptypes'
import { StringExpressionBuilder } from './string-expression-builder'
import { BoolExpressionBuilder } from './bool-expression-builder'
import { BytesBinaryOperator, BytesEncoding, BytesUnaryOperator, EqualityComparison, StringConstant } from '../../awst/nodes'
import { base32ToUint8Array, base64ToUint8Array, hexToUint8Array, utf8ToUint8Array } from '../../util'
import { ScalarLiteralExpressionBuilder } from './scalar-literal-expression-builder'
import { logger } from '../../logger'

export class BytesFunctionBuilder extends FunctionBuilder {
  get ptype(): PType | undefined {
    return BytesFunction
  }

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
    if (args.length === 0) {
      return new BytesExpressionBuilder(
        nodeFactory.bytesConstant({
          sourceLocation,
          value: new Uint8Array(),
        }),
      )
    }

    const [arg0, ...rest] = args
    if (rest.length) {
      throw CodeError.unexpectedUnhandledArgs({ sourceLocation })
    }
    if (arg0 instanceof LiteralExpressionBuilder) {
      return arg0.resolveToPType(bytesPType, sourceLocation)
    } else {
      if (arg0.ptype?.equals(stringPType)) {
        return new BytesExpressionBuilder(arg0.toBytes(sourceLocation))
      }
      throw CodeError.unexpectedUnhandledArgs({ sourceLocation })
    }
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

const builderCompareToBytesCompare: Record<BuilderComparisonOp, EqualityComparison | undefined> = {
  [BuilderComparisonOp.ne]: EqualityComparison.ne,
  [BuilderComparisonOp.eq]: EqualityComparison.eq,
  [BuilderComparisonOp.lt]: undefined,
  [BuilderComparisonOp.lte]: undefined,
  [BuilderComparisonOp.gt]: undefined,
  [BuilderComparisonOp.gte]: undefined,
}

export class BytesExpressionBuilder extends InstanceExpressionBuilder {
  get ptype() {
    return bytesPType
  }
  prefixUnaryOp(op: BuilderUnaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    switch (op) {
      case BuilderUnaryOp.bit_inv:
        logger.error(
          sourceLocation,
          `The '~' ${this.typeDescription} operator coerces the target value to a number type. Use {bytes expression}.bitwiseInvert() instead`,
        )
        return new ScalarLiteralExpressionBuilder(0n, sourceLocation)
      case BuilderUnaryOp.log_not:
        return new BoolExpressionBuilder(
          nodeFactory.not({
            expr: this.boolEval(sourceLocation),
            sourceLocation,
            wtype: wtypes.boolWType,
          }),
        )
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
    const equalityOp = builderCompareToBytesCompare[op]
    if (equalityOp) {
      return new BoolExpressionBuilder(
        nodeFactory.bytesComparisonExpression({
          sourceLocation,
          operator: equalityOp,
          wtype: wtypes.boolWType,
          lhs: this._expr,
          rhs: requireExpressionOfType(other, bytesPType, sourceLocation),
        }),
      )
    }
    return super.compare(other, op, sourceLocation)
  }
  boolEval(sourceLocation: SourceLocation): awst.Expression {
    return nodeFactory.bytesComparisonExpression({
      lhs: this._expr,
      rhs: nodeFactory.bytesConstant({ value: new Uint8Array(), sourceLocation }),
      sourceLocation,
      wtype: wtypes.boolWType,
      operator: EqualityComparison.ne,
    })
  }

  toBytes(): awst.Expression {
    return this.resolve()
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
