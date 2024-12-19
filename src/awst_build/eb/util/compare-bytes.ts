import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import { EqualityComparison } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { logger } from '../../../logger'
import { BooleanExpressionBuilder } from '../boolean-expression-builder'
import { BuilderComparisonOp } from '../index'

const builderCompareToBytesCompare: Record<BuilderComparisonOp, EqualityComparison | undefined> = {
  [BuilderComparisonOp.ne]: EqualityComparison.ne,
  [BuilderComparisonOp.eq]: EqualityComparison.eq,
  [BuilderComparisonOp.lt]: undefined,
  [BuilderComparisonOp.lte]: undefined,
  [BuilderComparisonOp.gt]: undefined,
  [BuilderComparisonOp.gte]: undefined,
}

export function compareBytes(
  left: Expression,
  right: Expression,
  op: BuilderComparisonOp,
  sourceLocation: SourceLocation,
  typeDescription: string,
) {
  const equalityOp = builderCompareToBytesCompare[op]
  if (equalityOp === undefined) {
    logger.error(sourceLocation, `${typeDescription} does not support the '${op}' operator`)
  }
  return new BooleanExpressionBuilder(
    nodeFactory.bytesComparisonExpression({
      sourceLocation,
      operator: equalityOp ?? EqualityComparison.eq,
      lhs: left,
      rhs: right,
    }),
  )
}
