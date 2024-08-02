import { BuilderBinaryOp, BuilderComparisonOp } from './index'
import type { SourceLocation } from '../../awst/source-location'
import { nodeFactory } from '../../awst/node-factory'
import { CodeError } from '../../errors'
import type { Expression } from '../../awst/nodes'

const binaryOpFolding: Record<BuilderBinaryOp, undefined | ((left: bigint, right: bigint) => bigint)> = {
  [BuilderBinaryOp.div]: (l, r) => l / r,
  [BuilderBinaryOp.add]: (l, r) => l + r,
  [BuilderBinaryOp.sub]: (l, r) => l - r,
  [BuilderBinaryOp.mult]: (l, r) => l * r,
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
  [BuilderComparisonOp.ne]: (l, r) => l !== r,
  [BuilderComparisonOp.lt]: (l, r) => l < r,
  [BuilderComparisonOp.lte]: (l, r) => l <= r,
  [BuilderComparisonOp.gt]: (l, r) => l > r,
  [BuilderComparisonOp.gte]: (l, r) => l >= r,
}

export function foldBinaryOp(left: bigint, right: bigint, op: BuilderBinaryOp, sourceLocation: SourceLocation): bigint {
  const result = binaryOpFolding[op]?.(left, right)
  switch (typeof result) {
    case 'bigint':
      return result
    default:
      throw new CodeError(`${op} is not supported`, { sourceLocation })
  }
}

export function foldComparisonOp(left: bigint, right: bigint, op: BuilderComparisonOp, sourceLocation: SourceLocation): Expression {
  const result = comparisonOpFolding[op]?.(left, right)
  switch (typeof result) {
    case 'boolean':
      return nodeFactory.boolConstant({
        value: result,
        sourceLocation: sourceLocation,
      })
    default:
      throw new CodeError(`${op} is not supported`, { sourceLocation })
  }
}
