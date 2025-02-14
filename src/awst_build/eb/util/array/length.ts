import { nodeFactory } from '../../../../awst/node-factory'
import type { SourceLocation } from '../../../../awst/source-location'
import { ArrayLiteralPType, TuplePType, uint64PType } from '../../../ptypes'
import { instanceEb } from '../../../type-registry'
import type { InstanceBuilder } from '../../index'

export function arrayLength(array: InstanceBuilder, sourceLocation: SourceLocation) {
  if (array.ptype instanceof ArrayLiteralPType || array.ptype instanceof TuplePType) {
    return instanceEb(
      nodeFactory.uInt64Constant({
        value: BigInt(array.ptype.items.length),
        sourceLocation,
      }),
      uint64PType,
    )
  }

  return instanceEb(
    nodeFactory.arrayLength({
      array: array.resolve(),
      sourceLocation,
    }),
    uint64PType,
  )
}
