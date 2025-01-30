import { nodeFactory } from '../../../../awst/node-factory'
import type { SourceLocation } from '../../../../awst/source-location'
import { uint64PType } from '../../../ptypes'
import { instanceEb } from '../../../type-registry'
import type { InstanceBuilder } from '../../index'

export function arrayLength(array: InstanceBuilder, sourceLocation: SourceLocation) {
  return instanceEb(
    nodeFactory.arrayLength({
      array: array.resolve(),
      sourceLocation,
    }),
    uint64PType,
  )
}
