import { CodeError } from '../../../errors'
import { codeInvariant } from '../../../util'
import type { PType } from '../../ptypes'
import { accountPType, applicationPType, assetPType, bytesPType, onCompleteActionType, stringPType, uint64PType } from '../../ptypes'
import type { NodeBuilder } from '../index'
import { InstanceBuilder } from '../index'

/**
 * Given a builder, attempt to resolve it to the target type converting compatible types as possible
 *
 * @param builder
 * @param targetType
 */
export function resolveCompatBuilder(builder: NodeBuilder, targetType: PType) {
  codeInvariant(builder instanceof InstanceBuilder, `Cannot resolve ${builder.typeDescription} to a value`, builder.sourceLocation)

  if (builder.resolvableToPType(targetType)) {
    return builder.resolveToPType(targetType)
  }

  if (targetType.equals(accountPType)) {
    if (builder.resolvableToPType(bytesPType)) {
      // Account bytes should just be cast
      return builder.resolveToPType(bytesPType).reinterpretCast(accountPType)
    }
  } else if (targetType.equals(applicationPType) || targetType.equals(assetPType) || targetType.equals(onCompleteActionType)) {
    if (builder.resolvableToPType(uint64PType)) {
      return builder.resolveToPType(uint64PType).reinterpretCast(targetType)
    }
  } else if (targetType.equals(bytesPType)) {
    if (builder.resolvableToPType(stringPType)) {
      return builder.resolveToPType(stringPType).toBytes(builder.sourceLocation)
    }
  }

  throw new CodeError(`Cannot resolve ${builder.ptype} to ${targetType}`, { sourceLocation: builder.sourceLocation })
}

export function resolveCompatExpression(builder: NodeBuilder, targetType: PType) {
  return resolveCompatBuilder(builder, targetType).resolve()
}
