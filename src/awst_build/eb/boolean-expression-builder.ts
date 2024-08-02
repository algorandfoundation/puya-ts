import type { awst } from '../../awst'
import type { InstanceBuilder, NodeBuilder } from './index'
import { BuilderComparisonOp, FunctionBuilder, InstanceExpressionBuilder } from './index'
import type { SourceLocation } from '../../awst/source-location'
import type { Expression } from '../../awst/nodes'
import { EqualityComparison, NumericComparison } from '../../awst/nodes'
import { intrinsicFactory } from '../../awst/intrinsic-factory'
import type { PType } from '../ptypes'
import { boolPType, bytesPType, stringPType } from '../ptypes'
import { nodeFactory } from '../../awst/node-factory'
import { codeInvariant, tryConvertEnum } from '../../util'
import { CodeError } from '../../errors'
import type { InstanceType } from '../ptypes'

export class BooleanFunctionBuilder extends FunctionBuilder {
  call(args: ReadonlyArray<InstanceBuilder>, typeArgs: ReadonlyArray<PType>, sourceLocation: SourceLocation): NodeBuilder {
    if (typeArgs.length) throw CodeError.unexpectedTypeArgs({ sourceLocation })
    if (args.length !== 1) throw CodeError.unexpectedUnhandledArgs({ sourceLocation })

    const [value] = args
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
          lhs: value.toBytes(sourceLocation),
          rhs: nodeFactory.bytesConstant({ value: new Uint8Array(), sourceLocation }),
        }),
      )
    } else {
      // TODO: See if there's a better way to do this. boolEval only returns a truthy/falsy value
      // Whilst 1 and 5 for example are both truthy, they are not equal
      // and we expect Boolean(1) to equal Boolean(5)
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

  toBytes(sourceLocation: SourceLocation): Expression {
    return intrinsicFactory.itob({
      value: this._expr,
      sourceLocation,
    })
  }

  compare(other: InstanceBuilder, op: BuilderComparisonOp, sourceLocation: SourceLocation): InstanceBuilder {
    const operator = tryConvertEnum(op, BuilderComparisonOp, NumericComparison)
    codeInvariant(operator, `${op} is not supported on ${this.typeDescription}`, sourceLocation)
    return new BooleanExpressionBuilder(
      nodeFactory.numericComparisonExpression({
        operator,
        lhs: this.resolve(),
        rhs: other.resolveToPType(boolPType, sourceLocation).resolve(),
        sourceLocation,
      }),
    )
  }
}
