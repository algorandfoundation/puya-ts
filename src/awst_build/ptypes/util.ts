import type { SourceLocation } from '../../awst/source-location'
import { CodeError } from '../../errors'
import { codeInvariant } from '../../util'
import { DynamicArrayType, StaticArrayType } from './arc4-types'
import type { PType } from './base'
import { ArrayPType, IterableIteratorType, MutableArrayType, TuplePType, UnionPType } from './index'

export const getSequenceItemType = (sequence: PType, sequenceLocation: SourceLocation) => {
  if (sequence instanceof IterableIteratorType) return sequence.itemType
  if (sequence instanceof ArrayPType) return sequence.elementType
  if (sequence instanceof MutableArrayType) return sequence.elementType
  if (sequence instanceof TuplePType) {
    codeInvariant(
      sequence.items.every((i) => i.equals(sequence.items[0])),
      `Tuples are only iterable if all item types are the same type. Item type is ${UnionPType.fromTypes(sequence.items)}`,
      sequenceLocation,
    )
    return sequence.items[0]
  }
  if (sequence instanceof DynamicArrayType || sequence instanceof StaticArrayType) {
    return sequence.elementType
  }
  throw new CodeError(`Target is not iterable: ${sequence}`, { sourceLocation: sequenceLocation })
}

export const ptypeIn = (target: PType, ...ptypes: [PType, ...PType[]]): boolean => {
  return ptypes.some((t) => t.equals(target))
}
