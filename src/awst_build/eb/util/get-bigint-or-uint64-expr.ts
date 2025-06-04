import { invariant } from '../../../util'
import { numberPType, uint64PType } from '../../ptypes'
import type { InstanceBuilder } from '../index'
import { NumericLiteralExpressionBuilder } from '../literal/numeric-literal-expression-builder'

export function getBigIntOrUint64Expr(builder: InstanceBuilder) {
  if (builder.ptype.equals(numberPType)) {
    invariant(
      builder instanceof NumericLiteralExpressionBuilder,
      'Builder for number type must be NumericLiteralExpressionBuilder',
      builder.sourceLocation,
    )
    return builder.value
  } else {
    invariant(builder.ptype.equals(uint64PType), 'Builder must be uint64 if not number', builder.sourceLocation)
    return builder.resolve()
  }
}
