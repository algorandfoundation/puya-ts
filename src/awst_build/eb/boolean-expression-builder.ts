import { awst } from '../../awst'
import { BuilderBinaryOp, BuilderComparisonOp, InstanceBuilder, InstanceExpressionBuilder } from './index'
import * as ptypes from '../ptypes'
import { SourceLocation } from '../../awst/source-location'
import { Expression, NumericComparison } from '../../awst/nodes'
import { intrinsicFactory } from '../../awst/intrinsic-factory'
import { boolPType } from '../ptypes'
import { nodeFactory } from '../../awst/node-factory'
import { codeInvariant, tryConvertEnum } from '../../util'

export class BooleanExpressionBuilder extends InstanceExpressionBuilder {
  get ptype(): ptypes.PType {
    return ptypes.boolPType
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
