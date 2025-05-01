import {
  accountPType,
  applicationPType,
  ArrayPType,
  assetPType,
  boolPType,
  bytesPType,
  IterableIteratorType,
  MutableArrayType,
  ObjectPType,
  stringPType,
  TuplePType,
  Uint64EnumMemberType,
  uint64PType,
  UnionPType,
} from '.'
import type { SourceLocation } from '../../awst/source-location'
import { CodeError } from '../../errors'
import { codeInvariant, instanceOfAny } from '../../util'
import { ARC4EncodedType, DynamicArrayType, StaticArrayType } from './arc4-types'
import type { PType } from './base'

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

export function isPersistableStackType(ptype: PType): boolean {
  return (
    ptype.equals(boolPType) ||
    ptype.equals(uint64PType) ||
    ptype.equals(stringPType) ||
    ptype.equals(bytesPType) ||
    ptype.equals(accountPType) ||
    ptype.equals(assetPType) ||
    ptype.equals(applicationPType) ||
    ptype instanceof ARC4EncodedType ||
    instanceOfAny(ptype, TuplePType, ObjectPType, ArrayPType, Uint64EnumMemberType)
  )
}
