import { awst, wtypes } from '../../awst'
import { BuilderComparisonOp, FunctionBuilder, InstanceBuilder, InstanceExpressionBuilder, NodeBuilder } from './index'
import { SourceLocation } from '../../awst/source-location'
import { nodeFactory } from '../../awst/node-factory'
import { CodeError } from '../../errors'
import { UInt64ExpressionBuilder } from './uint64-expression-builder'
import { intrinsicFactory } from '../../awst/intrinsic-factory'
import { requireExpressionOfType, requireExpressionsOfType } from './util'
import { BytesFunction, bytesPType, PType, stringPType, uint64PType } from '../ptypes'
import { StringExpressionBuilder } from './string-expression-builder'
import { BoolExpressionBuilder } from './bool-expression-builder'
import { BytesBinaryOperator, BytesEncoding, EqualityComparison } from '../../awst/nodes'
import { codeInvariant, utf8ToUint8Array } from '../../util'

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
    // const [arg0] = args
    // if (arg0 instanceof Literal && arg0.value instanceof Uint8Array) {
    //   return new BytesExpressionBuilder(
    //     nodeFactory.bytesConstant({
    //       sourceLocation,
    //       value: arg0.value,
    //     }),
    //   )
    // }
    throw CodeError.unexpectedUnhandledArgs({ sourceLocation })
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
  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'length':
        return new UInt64ExpressionBuilder(
          intrinsicFactory.bytesLen({
            value: this._expr,
            sourceLocation,
          }),
        )
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

export class ToStringBuilder extends FunctionBuilder {
  constructor(private expr: awst.Expression) {
    super(expr.sourceLocation)
  }

  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): InstanceBuilder {
    codeInvariant(args.length === 0, 'bytes.toString expects no args', sourceLocation)
    return new StringExpressionBuilder(
      nodeFactory.reinterpretCast({
        wtype: wtypes.stringWType,
        expr: this.expr,
        sourceLocation,
      }),
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
