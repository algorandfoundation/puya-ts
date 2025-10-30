import { nodeFactory } from '../../../../awst/node-factory'
import type { SourceLocation } from '../../../../awst/source-location'
import { uint64PType } from '../../../ptypes'
import { instanceEb } from '../../../type-registry'
import type { InstanceBuilder } from '../../index'
import { isStaticallyIterable, StaticIterator } from '../../traits/static-iterator'

export function arrayLength(array: InstanceBuilder, sourceLocation: SourceLocation) {
  if (isStaticallyIterable(array)) {
    return instanceEb(
      nodeFactory.uInt64Constant({
        value: BigInt(array[StaticIterator]().length),
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
