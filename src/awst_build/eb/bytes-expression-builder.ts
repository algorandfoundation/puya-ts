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
  NumericComparison,
} from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'
import { wrapInCodeError } from '../../errors'
import { logger } from '../../logger'
import {
  base32ToUint8Array,
  base64ToUint8Array,
  codeInvariant,
  enumKeyFromValue,
  hexToUint8Array,
  invariant,
  uint8ArrayToUtf8,
  utf8ToUint8Array,
} from '../../util'
import type { PType, PTypeOrClass } from '../ptypes'
import {
  ArrayLiteralPType,
  bigIntPType,
  biguintPType,
  boolPType,
  BytesFunction,
  BytesGeneric,
  BytesPType,
  bytesPType,
  numberPType,
  NumericLiteralPType,
  stringPType,
  TransientType,
  uint64PType,
} from '../ptypes'
import { instanceEb } from '../type-registry'
import { BooleanExpressionBuilder } from './boolean-expression-builder'
import type { BuilderComparisonOp, InstanceBuilder, NodeBuilder } from './index'
import { BuilderUnaryOp, FunctionBuilder, InstanceExpressionBuilder } from './index'
import { NumericLiteralExpressionBuilder } from './literal/numeric-literal-expression-builder'
import { AtFunctionBuilder } from './shared/at-function-builder'
import { SliceFunctionBuilder } from './shared/slice-function-builder'
import { StringExpressionBuilder } from './string-expression-builder'
import { isStaticallyIterable, StaticIterator } from './traits/static-iterator'
import { UInt64ExpressionBuilder } from './uint64-expression-builder'
import { requireBooleanConstant, requireExpressionOfType, requireIntegerConstant, requireStringConstant } from './util'
import { parseFunctionArgs } from './util/arg-parsing'
import { compareBytes } from './util/compare-bytes'

export class BytesFunctionBuilder extends FunctionBuilder {
  readonly ptype = BytesFunction

  taggedTemplate(
    head: string,
    spans: ReadonlyArray<readonly [InstanceBuilder, string]>,
    typeArgs: ReadonlyArray<PType>,
    sourceLocation: SourceLocation,
  ): InstanceBuilder {
    const exprType = BytesGeneric.parameterise(typeArgs)

    let result: awst.Expression = nodeFactory.bytesConstant({
      sourceLocation,
      encoding: BytesEncoding.utf8,
      value: utf8ToUint8Array(head),
    })
    for (const [value, joiningText] of spans) {
      const valueBytes = value.ptype?.equals(stringPType) ? value.resolve() : value.toBytes(sourceLocation).resolve()
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

    const bytesBuilder = new BytesExpressionBuilder(result, bytesPType)
    return exprType.length === null ? bytesBuilder : bytesToFixed(bytesBuilder, exprType, sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [initialValue],
      ptypes: [len],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      callLocation: sourceLocation,
      funcName: 'Bytes',
      argSpec: (a) => [a.optional(numberPType, bigIntPType, uint64PType, biguintPType, stringPType, bytesPType, ArrayLiteralPType)],
    })
    const exprType = BytesGeneric.parameterise([len])
    const empty = new BytesExpressionBuilder(
      nodeFactory.bytesConstant({
        sourceLocation,
        value: new Uint8Array(Number(exprType.length)),
        wtype: exprType.wtype,
      }),
      exprType,
    )

    let bytesBuilder: InstanceBuilder

    if (!initialValue) {
      bytesBuilder = empty
    } else if (initialValue.ptype instanceof TransientType) {
      logger.error(initialValue.sourceLocation, initialValue.ptype.expressionMessage)
      bytesBuilder = empty
    } else if (initialValue.ptype.equals(uint64PType)) {
      bytesBuilder = initialValue.toBytes(sourceLocation)
    } else if (initialValue.ptype.equals(biguintPType)) {
      bytesBuilder = initialValue.toBytes(sourceLocation)
    } else if (initialValue.ptype.equals(stringPType)) {
      bytesBuilder = initialValue.toBytes(sourceLocation)
    } else if (initialValue.ptype.equals(bytesPType)) {
      return initialValue
    } else {
      if (isStaticallyIterable(initialValue)) {
        const bytes: number[] = []
        for (const item of initialValue[StaticIterator]()) {
          const byte = item.resolveToPType(uint64PType).resolve()
          if (byte instanceof IntegerConstant && byte.value < 256n) {
            bytes.push(Number(byte.value))
          } else {
            logger.error(item.sourceLocation, 'A compile time constant value between 0 and 255 is expected here')
            break
          }
        }
        bytesBuilder = new BytesExpressionBuilder(
          nodeFactory.bytesConstant({
            value: Uint8Array.from(bytes),
            sourceLocation: initialValue.sourceLocation,
            wtype: exprType.wtype,
          }),
          exprType,
        )
      } else {
        logger.error(initialValue.sourceLocation, 'Only array literals or tuples are supported here')
        bytesBuilder = empty
      }
    }

    return exprType.length === null ? bytesBuilder : bytesToFixed(bytesBuilder, exprType, sourceLocation)
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
      ptypes: [len],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      genericTypeArgs: 1,
      funcName: this.functionName,
      argSpec: (a) => [a.required(stringPType)],
    })
    const exprType = BytesGeneric.parameterise([len])

    const encodedValue = requireStringConstant(valueBuilder)

    const value = wrapInCodeError(() => this.decodeLiteral(encodedValue.value), encodedValue.sourceLocation)

    if (exprType.length !== null && value.length !== Number(exprType.length)) {
      logger.error(sourceLocation, `Expected decoded bytes value of length ${exprType.length}, received ${value.length}`)
    }

    return new BytesExpressionBuilder(
      nodeFactory.bytesConstant({
        value: value,
        encoding: this.encoding,
        sourceLocation,
        wtype: exprType.wtype,
      }),
      exprType,
    )
  }
}

export class BytesExpressionBuilder extends InstanceExpressionBuilder<BytesPType> {
  constructor(expr: Expression, ptype: PType) {
    invariant(ptype instanceof BytesPType, 'ptype must be BytesPType')
    invariant(expr.wtype.equals(ptype.wtype), 'Expr wtype must match ptype.wtype')
    super(expr, ptype)
  }
  prefixUnaryOp(op: BuilderUnaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    switch (op) {
      case BuilderUnaryOp.bit_inv:
        logger.error(
          sourceLocation,
          `The '~' ${this.typeDescription} operator coerces the target value to a number type. Use {bytes expression}.bitwiseInvert() instead`,
        )
        return new NumericLiteralExpressionBuilder(0n, new NumericLiteralPType({ literalValue: 0n }), sourceLocation)
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
        return new BytesInvertBuilder(this)
      case 'bitwiseAnd':
        return new BitwiseOpFunctionBuilder(this, BytesBinaryOperator.bitAnd)
      case 'bitwiseOr':
        return new BitwiseOpFunctionBuilder(this, BytesBinaryOperator.bitOr)
      case 'bitwiseXor':
        return new BitwiseOpFunctionBuilder(this, BytesBinaryOperator.bitXor)
      case 'toString':
        return new ToStringBuilder(this)
      case 'concat':
        return new ConcatFunctionBuilder(this)
      case 'toFixed':
        return new ToFixedLengthFunctionBuilder(this)
      case 'at':
        return new AtFunctionBuilder(
          this._expr,
          bytesPType,
          requireExpressionOfType(this.memberAccess('length', sourceLocation), uint64PType),
          sourceLocation,
        )
      case 'slice':
        return new SliceFunctionBuilder(this._expr, bytesPType)
      case 'equals':
        return new EqualsFunctionBuilder(this._expr)
    }
    return super.memberAccess(name, sourceLocation)
  }
  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    let compareType = this.ptype
    if (!compareType.equals(other.ptype)) {
      compareType = bytesPType
    }
    return compareBytes(
      requireExpressionOfType(this, compareType),
      requireExpressionOfType(other, compareType),
      op,
      sourceLocation,
      this.typeDescription,
    )
  }
  boolEval(sourceLocation: SourceLocation, negate: boolean): awst.Expression {
    return new UInt64ExpressionBuilder(
      intrinsicFactory.bytesLen({
        value: this._expr,
        sourceLocation,
      }),
    ).boolEval(sourceLocation, negate)
  }

  toBytes(): InstanceBuilder {
    return this
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

  resolvableToPType(ptype: PTypeOrClass): ptype is BytesPType {
    if (ptype instanceof BytesPType) {
      return this.ptype.length === ptype.length || ptype.length === null
    }
    return false
  }
  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    if (this.ptype.equalsOrInstanceOf(ptype)) return this
    if (this.resolvableToPType(ptype)) {
      return new BytesExpressionBuilder(
        nodeFactory.reinterpretCast({ expr: this.resolve(), wtype: ptype.wtypeOrThrow, sourceLocation: this.sourceLocation }),
        ptype,
      )
    }

    return super.resolveToPType(ptype)
  }
}

export class ConcatFunctionBuilder extends FunctionBuilder {
  constructor(private builder: BytesExpressionBuilder) {
    super(builder.sourceLocation)
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
        left: requireExpressionOfType(this.builder, bytesPType),
        right: requireExpressionOfType(other, bytesPType),
        sourceLocation: sourceLocation,
      }),
      bytesPType,
    )
  }
}

export function bytesToFixed(builder: InstanceBuilder, fixedType: BytesPType, sourceLocation: SourceLocation): InstanceBuilder {
  invariant(fixedType.length !== null, 'Should only be called for bytes with a fixed length', sourceLocation)
  const expr = builder.resolve()
  if (expr instanceof BytesConstant) {
    codeInvariant(
      expr.value.length === Number(fixedType.length),
      `Invalid bytes constant length of ${expr.value.length}, expected ${fixedType.length}`,
      builder.sourceLocation,
    )
    return new BytesExpressionBuilder(
      nodeFactory.bytesConstant({
        ...expr,
        wtype: fixedType.wtype,
      }),
      fixedType,
    )
  }

  const single = builder.singleEvaluation()
  return new BytesExpressionBuilder(
    nodeFactory.checkedMaybe({
      comment: `Length must be ${fixedType.length}`,
      expr: nodeFactory.tupleExpression({
        items: [
          nodeFactory.reinterpretCast({
            expr: single.resolve(),
            wtype: fixedType.wtype,
            sourceLocation,
          }),
          nodeFactory.numericComparisonExpression({
            sourceLocation,
            operator: NumericComparison.eq,
            lhs: intrinsicFactory.bytesLen({
              value: single.resolve(),
              sourceLocation,
            }),
            rhs: nodeFactory.uInt64Constant({
              value: fixedType.length,
              sourceLocation,
            }),
          }),
        ],
        sourceLocation,
      }),
    }),
    fixedType,
  )
}

export class ToFixedLengthFunctionBuilder extends FunctionBuilder {
  constructor(private builder: BytesExpressionBuilder) {
    super(builder.sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [{ length, checked }],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      funcName: 'toFixed',
      genericTypeArgs: 1,
      argSpec: (a) => [
        a.obj({
          length: a.required(NumericLiteralPType),
          checked: a.optional(boolPType),
        }),
      ],
    })
    const sizeConst = requireIntegerConstant(length)
    const assertLength = checked === undefined ? true : requireBooleanConstant(checked)
    const ptype = new BytesPType({ length: sizeConst.value })

    if (assertLength) {
      return bytesToFixed(this.builder, ptype, sourceLocation)
    } else {
      return instanceEb(
        nodeFactory.reinterpretCast({
          expr: this.builder.resolve(),
          wtype: ptype.wtype,
          sourceLocation,
        }),
        ptype,
      )
    }
  }
}

export class BytesInvertBuilder extends FunctionBuilder {
  constructor(private builder: BytesExpressionBuilder) {
    super(builder.sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    parseFunctionArgs({ args, typeArgs, genericTypeArgs: 0, callLocation: sourceLocation, funcName: 'bitwiseInvert', argSpec: (a) => [] })
    return new BytesExpressionBuilder(
      nodeFactory.bytesUnaryOperation({
        wtype: this.builder.ptype.wtype,
        expr: this.builder.resolve(),
        op: BytesUnaryOperator.bitInvert,
        sourceLocation,
      }),
      this.builder.ptype,
    )
  }
}

export class BitwiseOpFunctionBuilder extends FunctionBuilder {
  constructor(
    private left: BytesExpressionBuilder,
    private op: BytesBinaryOperator,
  ) {
    super(left.sourceLocation)
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
      argSpec: (a) => [a.required(this.left.ptype, bytesPType)],
    })

    const exprType = this.left.ptype.equals(other.ptype) ? this.left.ptype : bytesPType

    return new BytesExpressionBuilder(
      nodeFactory.bytesBinaryOperation({
        // Maintain fixed length type if both operands match
        wtype: exprType.wtype,
        left: requireExpressionOfType(this.left, exprType),
        right: requireExpressionOfType(other, exprType),
        op: this.op,
        sourceLocation,
      }),
      exprType,
    )
  }
}

export class ToStringBuilder extends FunctionBuilder {
  constructor(private builder: BytesExpressionBuilder) {
    super(builder.sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    parseFunctionArgs({ args, typeArgs, genericTypeArgs: 0, callLocation: sourceLocation, funcName: 'toString', argSpec: (a) => [] })
    return new StringExpressionBuilder(
      nodeFactory.reinterpretCast({
        wtype: wtypes.stringWType,
        expr: this.builder.resolve(),
        sourceLocation,
      }),
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
