import { awst } from '../../awst'
import { intrinsicFactory } from '../../awst/intrinsic-factory'
import { nodeFactory } from '../../awst/node-factory'
import type { Expression } from '../../awst/nodes'
import { BytesBinaryOperator, BytesEncoding, EqualityComparison } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'
import { NotSupported } from '../../errors'
import { tryConvertEnum, utf8ToUint8Array } from '../../util'
import type { InstanceType, PType, PTypeOrClass } from '../ptypes'
import { boolPType, bytesPType, stringPType } from '../ptypes'
import { instanceEb } from '../type-registry'
import type { InstanceBuilder, NodeBuilder } from './index'
import { BuilderBinaryOp, BuilderComparisonOp, FunctionBuilder, InstanceExpressionBuilder } from './index'
import { UInt64ExpressionBuilder } from './uint64-expression-builder'
import { requireExpressionOfType } from './util'
import { parseFunctionArgs } from './util/arg-parsing'

export class StringFunctionBuilder extends FunctionBuilder {
  taggedTemplate(head: string, spans: ReadonlyArray<readonly [InstanceBuilder, string]>, sourceLocation: SourceLocation): InstanceBuilder {
    let result: awst.Expression = nodeFactory.stringConstant({
      sourceLocation,
      value: head,
    })
    for (const [value, joiningText] of spans) {
      const valueStr = value.toString(sourceLocation)
      result = nodeFactory.bytesBinaryOperation({
        left: result,
        right: valueStr,
        op: BytesBinaryOperator.add,
        sourceLocation,
        wtype: wtypes.stringWType,
      })
      if (joiningText) {
        result = nodeFactory.bytesBinaryOperation({
          left: result,
          right: nodeFactory.stringConstant({
            sourceLocation,
            value: joiningText,
          }),
          op: BytesBinaryOperator.add,
          sourceLocation,
          wtype: wtypes.stringWType,
        })
      }
    }
    return new StringExpressionBuilder(result)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [value],
    } = parseFunctionArgs({
      args,
      typeArgs,
      callLocation: sourceLocation,
      funcName: 'String',
      genericTypeArgs: 0,
      argSpec: (a) => [a.optional(bytesPType)],
    })

    if (!value) {
      return new StringExpressionBuilder(
        nodeFactory.stringConstant({
          sourceLocation,
          value: '',
        }),
      )
    }

    return new StringExpressionBuilder(
      nodeFactory.reinterpretCast({
        expr: value.resolve(),
        sourceLocation,
        wtype: wtypes.stringWType,
      }),
    )
  }
}

export class StringExpressionBuilder extends InstanceExpressionBuilder<InstanceType> {
  constructor(expr: Expression) {
    super(expr, stringPType)
  }

  resolvableToPType(ptype: PTypeOrClass): boolean {
    return ptype.equals(bytesPType) || super.resolvableToPType(ptype)
  }

  resolveToPType(ptype: PTypeOrClass): InstanceBuilder {
    if (ptype.equals(bytesPType)) {
      return instanceEb(this.toBytes(this.sourceLocation), bytesPType)
    }
    return super.resolveToPType(ptype)
  }

  boolEval(sourceLocation: SourceLocation, negate = false): Expression {
    return new UInt64ExpressionBuilder(
      intrinsicFactory.bytesLen({
        value: this._expr,
        sourceLocation,
      }),
    ).boolEval(sourceLocation, negate)
  }

  memberAccess(name: string, sourceLocation: SourceLocation): NodeBuilder {
    switch (name) {
      case 'concat':
        return new ConcatExpressionBuilder(this._expr)
    }
    return super.memberAccess(name, sourceLocation)
  }
  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    const otherExpr = requireExpressionOfType(other, stringPType)
    const numComOp = tryConvertEnum(op, BuilderComparisonOp, EqualityComparison)
    if (numComOp === undefined) {
      throw new NotSupported(`Numeric comparison operator ${op}`, {
        sourceLocation,
      })
    }
    return instanceEb(
      nodeFactory.bytesComparisonExpression({
        lhs: this._expr,
        rhs: otherExpr,
        operator: numComOp,
        sourceLocation,
      }),
      boolPType,
    )
  }

  binaryOp(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    switch (op) {
      case BuilderBinaryOp.add:
        return new StringExpressionBuilder(
          intrinsicFactory.bytesConcat({
            left: this.resolve(),
            right: requireExpressionOfType(other, stringPType),
            sourceLocation,
          }),
        )
    }
    return super.binaryOp(other, op, sourceLocation)
  }

  augmentedAssignment(other: InstanceBuilder, op: BuilderBinaryOp, sourceLocation: SourceLocation): InstanceBuilder {
    const newValue = this.binaryOp(other, op, sourceLocation)
    return new StringExpressionBuilder(
      nodeFactory.assignmentExpression({
        target: this.resolveLValue(),
        sourceLocation,
        value: newValue.resolve(),
      }),
    )
  }

  toBytes(sourceLocation: SourceLocation): awst.Expression {
    if (this._expr instanceof awst.StringConstant) {
      return nodeFactory.bytesConstant({
        value: utf8ToUint8Array(this._expr.value),
        encoding: BytesEncoding.utf8,
        sourceLocation: this._expr.sourceLocation,
      })
    }
    return nodeFactory.reinterpretCast({
      expr: this._expr,
      sourceLocation,
      wtype: wtypes.bytesWType,
    })
  }

  toString(): Expression {
    return this.resolve()
  }
}

export class ConcatExpressionBuilder extends FunctionBuilder {
  constructor(private expr: awst.Expression) {
    super(expr.sourceLocation)
  }

  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const { args: others } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 0,
      callLocation: sourceLocation,
      funcName: 'concat',
      argSpec: (a) => args.map((_) => a.required(stringPType)),
    })

    return new StringExpressionBuilder(
      others.reduce(
        (acc, cur) =>
          intrinsicFactory.bytesConcat({
            left: acc,
            right: cur.resolve(),
            sourceLocation: sourceLocation,
          }),
        this.expr,
      ),
    )
  }
}
