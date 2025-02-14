import { invariant } from '../../../util'
import { numberPType, uint64PType } from '../../ptypes'
import type { InstanceBuilder } from '../index'
import { BigIntLiteralExpressionBuilder } from '../literal/big-int-literal-expression-builder'

export function getBigIntOrUint64Expr(builder: InstanceBuilder) {
  if (builder.ptype.equals(numberPType)) {
    invariant(builder instanceof BigIntLiteralExpressionBuilder, 'Builder for number type must be BigIntLiteral', builder.sourceLocation)
    return builder.value
  } else {
    invariant(builder.ptype.equals(uint64PType), 'Builder must be uint64 if not number', builder.sourceLocation)
    return builder.resolve()
  }
}
