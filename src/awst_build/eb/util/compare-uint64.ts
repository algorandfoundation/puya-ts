import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import { NumericComparison } from '../../../awst/nodes'
import type { SourceLocation } from '../../../awst/source-location'
import { logger } from '../../../logger'
import { tryConvertEnum } from '../../../util'
import { BooleanExpressionBuilder } from '../boolean-expression-builder'
import { BuilderComparisonOp } from '../index'

export function compareUint64(
  left: Expression,
  right: Expression,
  op: BuilderComparisonOp,
  sourceLocation: SourceLocation,
  typeDescription: string,
) {
  const numComOp = tryConvertEnum(op, BuilderComparisonOp, NumericComparison)
  if (numComOp === undefined) {
    logger.error(sourceLocation, `${typeDescription} does not support the '${op}' operator`)
  }
  return new BooleanExpressionBuilder(
    nodeFactory.numericComparisonExpression({
      sourceLocation,
      operator: numComOp ?? NumericComparison.eq,
      lhs: left,
      rhs: right,
    }),
  )
}
