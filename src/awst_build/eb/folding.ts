import { BuilderBinaryOp, BuilderComparisonOp, InstanceBuilder } from './index'
import { BigIntLiteralExpressionBuilder } from './literal/big-int-literal-expression-builder'
import { SourceLocation } from '../../awst/source-location'
import { BooleanExpressionBuilder } from './boolean-expression-builder'
import { nodeFactory } from '../../awst/node-factory'
import { CodeError } from '../../errors'

const binaryOpFolding: Record<BuilderBinaryOp, undefined | ((left: bigint, right: bigint) => bigint)> = {
  [BuilderBinaryOp.div]: (l, r) => l / r,
  [BuilderBinaryOp.add]: (l, r) => l + r,
  [BuilderBinaryOp.sub]: (l, r) => l - r,
  [BuilderBinaryOp.mult]: (l, r) => l * r,
  [BuilderBinaryOp.floorDiv]: (l, r) => l / r,
  [BuilderBinaryOp.mod]: (l, r) => l % r,
  [BuilderBinaryOp.pow]: (l, r) => l ** r,
  [BuilderBinaryOp.matMult]: undefined,
  [BuilderBinaryOp.lshift]: (l, r) => {
    return l << r
  },
  [BuilderBinaryOp.rshift]: (l, r) => l >> r,
  [BuilderBinaryOp.bitOr]: (l, r) => l | r,
  [BuilderBinaryOp.bitXor]: (l, r) => l ^ r,
  [BuilderBinaryOp.bitAnd]: (l, r) => l & r,
  [BuilderBinaryOp.comma]: (l, r) => r,
}

const comparisonOpFolding: Record<BuilderComparisonOp, undefined | ((left: bigint, right: bigint) => boolean)> = {
  [BuilderComparisonOp.eq]: (l, r) => l === r,
  [BuilderComparisonOp.ne]: (l, r) => l === r,
  [BuilderComparisonOp.lt]: (l, r) => l === r,
  [BuilderComparisonOp.lte]: (l, r) => l === r,
  [BuilderComparisonOp.gt]: (l, r) => l === r,
  [BuilderComparisonOp.gte]: (l, r) => l === r,
}

export function foldBinaryOp(
  left: BigIntLiteralExpressionBuilder,
  right: BigIntLiteralExpressionBuilder,
  op: BuilderBinaryOp,
  sourceLocation: SourceLocation,
): InstanceBuilder {
  const result = binaryOpFolding[op]?.(left.value, right.value)
  // TODO: Check ptypes of left and right
  switch (typeof result) {
    case 'bigint':
      return new BigIntLiteralExpressionBuilder(
        result,
        left.ptype,
        SourceLocation.fromLocations(sourceLocation, left.sourceLocation, right.sourceLocation),
      )
    default:
      throw new CodeError(`${op} is not supported`, { sourceLocation })
  }
}

export function foldComparisonOp(
  left: BigIntLiteralExpressionBuilder,
  right: BigIntLiteralExpressionBuilder,
  op: BuilderComparisonOp,
  sourceLocation: SourceLocation,
): InstanceBuilder {
  const result = comparisonOpFolding[op]?.(left.value, right.value)
  // TODO: Check ptypes of left and right
  switch (typeof result) {
    case 'boolean':
      return new BooleanExpressionBuilder(
        nodeFactory.boolConstant({
          value: result,
          sourceLocation: SourceLocation.fromLocations(sourceLocation, left.sourceLocation, right.sourceLocation),
        }),
      )
    default:
      throw new CodeError(`${op} is not supported`, { sourceLocation })
  }
}
