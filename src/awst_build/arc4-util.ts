import type { SourceLocation } from '../awst/source-location'
import { CodeError } from '../errors'
import { logger } from '../logger'
import type { PType } from './ptypes'
import {
  accountPType,
  applicationPType,
  ArrayPType,
  assetPType,
  biguintPType,
  boolPType,
  bytesPType,
  GroupTransactionPType,
  NativeNumericType,
  numberPType,
  ObjectPType,
  stringPType,
  TuplePType,
  uint64PType,
  voidPType,
} from './ptypes'
import {
  arc4BooleanType,
  ARC4EncodedType,
  arc4StringType,
  ARC4StructType,
  ARC4TupleType,
  DynamicArrayType,
  DynamicBytesType,
  UintNType,
} from './ptypes/arc4-types'

export function ptypeToArc4PType(ptype: PType, sourceLocation: SourceLocation): PType {
  if (ptype instanceof ARC4EncodedType) return ptype
  if (ptype instanceof GroupTransactionPType) return ptype
  if (ptype.equals(applicationPType) || ptype.equals(accountPType) || ptype.equals(assetPType)) return ptype
  if (ptype.equals(voidPType)) return voidPType
  if (isArc4EncodableType(ptype)) {
    return ptypeToArc4EncodedType(ptype, sourceLocation)
  }
  logger.error(sourceLocation, `Unsupported type used in ABI method: ${ptype}`)
  return ptype
}

export function isArc4EncodableType(ptype: PType): boolean {
  if (ptype instanceof ARC4EncodedType) return true
  if (ptype.equals(boolPType)) return true
  if (ptype.equals(uint64PType)) return true
  if (ptype.equals(biguintPType)) return true
  if (ptype.equals(bytesPType)) return true
  if (ptype.equals(stringPType)) return true
  if (ptype instanceof TuplePType) return ptype.items.every((i) => isArc4EncodableType(i))
  if (ptype instanceof ObjectPType) return ptype.orderedProperties().every(([, pt]) => isArc4EncodableType(pt))
  if (ptype instanceof ArrayPType) return isArc4EncodableType(ptype.itemType)
  return false
}
export function ptypeToArc4EncodedType(ptype: TuplePType, sourceLocation: SourceLocation): ARC4TupleType
export function ptypeToArc4EncodedType(ptype: ObjectPType, sourceLocation: SourceLocation): ARC4StructType
export function ptypeToArc4EncodedType(ptype: ArrayPType, sourceLocation: SourceLocation): DynamicArrayType
export function ptypeToArc4EncodedType(ptype: PType, sourceLocation: SourceLocation): ARC4EncodedType
export function ptypeToArc4EncodedType(ptype: PType, sourceLocation: SourceLocation): ARC4EncodedType {
  if (ptype instanceof ARC4EncodedType) return ptype
  if (ptype.equals(boolPType)) return arc4BooleanType
  if (ptype.equals(uint64PType)) return new UintNType({ n: 64n })
  if (ptype.equals(biguintPType)) return new UintNType({ n: 512n })
  if (ptype.equals(bytesPType)) return DynamicBytesType
  if (ptype.equals(stringPType)) return arc4StringType
  if (ptype instanceof NativeNumericType) {
    throw new CodeError(numberPType.expressionMessage, { sourceLocation })
  }
  if (ptype instanceof ArrayPType)
    return new DynamicArrayType({
      elementType: ptypeToArc4EncodedType(ptype.itemType, sourceLocation),
      immutable: true,
    })

  if (ptype instanceof TuplePType) return new ARC4TupleType({ types: ptype.items.map((i) => ptypeToArc4EncodedType(i, sourceLocation)) })

  if (ptype instanceof ObjectPType)
    return new ARC4StructType({
      name: ptype.name,
      module: ptype.module,
      description: ptype.description,
      fields: Object.fromEntries(ptype.orderedProperties().map(([p, pt]) => [p, ptypeToArc4EncodedType(pt, sourceLocation)])),
      frozen: true,
    })

  throw new CodeError(`${ptype} cannot be encoded to an ARC4 type`, { sourceLocation })
}
