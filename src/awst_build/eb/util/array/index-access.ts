import { nodeFactory } from '../../../../awst/node-factory'
import { IntegerConstant } from '../../../../awst/nodes'
import type { SourceLocation } from '../../../../awst/source-location'
import { logger } from '../../../../logger'
import { uint64PType } from '../../../ptypes'
import { StaticArrayType } from '../../../ptypes/arc4-types'
import { instanceEb } from '../../../type-registry'
import type { InstanceBuilder } from '../../index'
import { type NodeBuilder } from '../../index'
import { requireExpressionOfType } from '../index'
import { arrayElementType } from './common'

export function indexAccess(target: InstanceBuilder, index: InstanceBuilder, sourceLocation: SourceLocation): NodeBuilder {
  const indexExpr = requireExpressionOfType(index, uint64PType)
  if (indexExpr instanceof IntegerConstant && target.ptype instanceof StaticArrayType && indexExpr.value >= target.ptype.arraySize) {
    logger.error(index.sourceLocation, 'Index access out of bounds')
  }

  const elementType = arrayElementType(target.ptype, sourceLocation)
  return instanceEb(
    nodeFactory.indexExpression({
      base: target.resolve(),
      sourceLocation: sourceLocation,
      index: indexExpr,
      wtype: elementType.wtypeOrThrow,
    }),
    elementType,
  )
}
