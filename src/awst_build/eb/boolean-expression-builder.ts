import type { awst } from '../../awst'
import { intrinsicFactory } from '../../awst/intrinsic-factory'
import { nodeFactory } from '../../awst/node-factory'
import type { Expression } from '../../awst/nodes'
import { EqualityComparison, NumericComparison } from '../../awst/nodes'
import type { SourceLocation } from '../../awst/source-location'
import { codeInvariant, tryConvertEnum } from '../../util'
import type { InstanceType, PType } from '../ptypes'
import { boolPType, BytesPType, bytesPType, stringPType } from '../ptypes'
import { instanceEb } from '../type-registry'
import type { InstanceBuilder, NodeBuilder } from './index'
import { BuilderComparisonOp, FunctionBuilder, InstanceExpressionBuilder } from './index'
import { parseFunctionArgs } from './util/arg-parsing'

export class BooleanFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<NodeBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    const {
      args: [value],
    } = parseFunctionArgs({
      args,
      typeArgs,
      genericTypeArgs: 1,
      callLocation: sourceLocation,
      funcName: 'Boolean',
      argSpec: (a) => [a.optional()],
    })
    if (!value) {
      return new BooleanExpressionBuilder(nodeFactory.boolConstant({ value: false, sourceLocation }))
    }

    if (value.ptype.equals(boolPType)) {
      return value
    }
    if (value.ptype.equals(bytesPType)) {
      return new BooleanExpressionBuilder(
        nodeFactory.bytesComparisonExpression({
          sourceLocation,
          operator: EqualityComparison.ne,
          lhs: value.resolve(),
          rhs: nodeFactory.bytesConstant({ value: new Uint8Array(), sourceLocation }),
        }),
      )
    } else if (value.ptype.equals(stringPType)) {
      return new BooleanExpressionBuilder(
        nodeFactory.bytesComparisonExpression({
          sourceLocation,
          operator: EqualityComparison.ne,
          lhs: value.toBytes(sourceLocation).resolve(),
          rhs: nodeFactory.bytesConstant({ value: new Uint8Array(), sourceLocation }),
        }),
      )
    } else {
      return new BooleanExpressionBuilder(
        nodeFactory.not({
          sourceLocation,
          expr: nodeFactory.not({
            sourceLocation,
            expr: value.boolEval(sourceLocation),
          }),
        }),
      )
    }
  }
}

export class BooleanExpressionBuilder extends InstanceExpressionBuilder<InstanceType> {
  constructor(expr: Expression) {
    super(expr, boolPType)
  }

  boolEval(sourceLocation: SourceLocation, negate: boolean): awst.Expression {
    if (negate) {
      return nodeFactory.not({ sourceLocation, expr: this._expr })
    }
    return this._expr
  }

  toBytes(sourceLocation: SourceLocation): InstanceBuilder {
    return instanceEb(
      intrinsicFactory.itob({
        value: this._expr,
        sourceLocation,
      }),
      new BytesPType({ length: 8n }),
    )
  }

  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    const operator = tryConvertEnum(op, BuilderComparisonOp, NumericComparison)
    codeInvariant(operator, `${op} is not supported on ${this.typeDescription}`, sourceLocation)
    return new BooleanExpressionBuilder(
      nodeFactory.numericComparisonExpression({
        operator,
        lhs: this.resolve(),
        rhs: other.resolveToPType(boolPType).resolve(),
        sourceLocation,
      }),
    )
  }
}
