import { nodeFactory } from '../../../awst/node-factory'
import type { Expression } from '../../../awst/nodes'
import { UInt64BinaryOperator } from '../../../awst/nodes'
import { logger } from '../../../logger'
import type { InstanceBuilder } from '../index'
import { getBigIntOrUint64Expr } from './get-bigint-or-uint64-expr'

export function translateNegativeIndex(arrayLength: Expression | bigint, index: InstanceBuilder) {
  const indexParam = getBigIntOrUint64Expr(index)

  if (typeof indexParam === 'bigint') {
    if (typeof arrayLength === 'bigint') {
      let indexValue = indexParam < 0 ? arrayLength + indexParam : indexParam
      if (indexValue < 0n || indexValue >= arrayLength) {
        logger.error(index.sourceLocation, 'Index access out of bounds')
        indexValue = 0n
      }
      return nodeFactory.uInt64Constant({
        value: indexValue,
        sourceLocation: index.sourceLocation,
      })
    } else {
      return nodeFactory.uInt64BinaryOperation({
        op: UInt64BinaryOperator.sub,
        left: arrayLength,
        right: nodeFactory.uInt64Constant({
          value: indexParam * -1n,
          sourceLocation: index.sourceLocation,
        }),
        sourceLocation: index.sourceLocation,
      })
    }
  } else {
    return indexParam
  }
}
