import { nodeFactory } from '../../../awst/node-factory'
import type {
  AppAccountStateExpression,
  AppStateExpression,
  Expression,
  FieldExpression,
  IndexExpression,
  TupleExpression,
  VarExpression,
} from '../../../awst/nodes'
import type { PType } from '../../ptypes'
import { TuplePType } from '../../ptypes'
import { InstanceExpressionBuilder, requireLValue } from '../index'

export class StateValueExpressionBuilder extends InstanceExpressionBuilder<PType> {
  resolve(): Expression {
    if (this.ptype instanceof TuplePType) {
      return nodeFactory.aRC4Decode({
        value: this._expr,
        sourceLocation: this.sourceLocation,
        wtype: this.storageType.wtypeOrThrow,
      })
    }
    return this._expr
  }

  resolveLValue(): VarExpression | FieldExpression | IndexExpression | TupleExpression | AppStateExpression | AppAccountStateExpression {
    return requireLValue(this._expr)
  }

  constructor(
    expr: AppStateExpression | AppAccountStateExpression,
    private storageType: PType,
  ) {
    super(expr, storageType)
  }
}
