import type { ARC32StructDef } from '../awst/models'
import type { SourceLocation } from '../awst/source-location'
import { CodeError } from '../errors'
import { logger } from '../logger'
import type { FunctionPType, PType } from './ptypes'
import {
  accountPType,
  applicationPType,
  assetPType,
  boolPType,
  bytesPType,
  GroupTransactionPType,
  ObjectPType,
  stringPType,
  TuplePType,
  uint64PType,
  voidPType,
} from './ptypes'
import {
  ARC4BooleanType,
  arc4ByteAlias,
  ARC4EncodedType,
  ARC4StringType,
  ARC4StructType,
  ARC4TupleType,
  DynamicArrayType,
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
  if (ptype.equals(bytesPType)) return true
  if (ptype.equals(stringPType)) return true
  if (ptype instanceof TuplePType) return ptype.items.every((i) => isArc4EncodableType(i))
  if (ptype instanceof ObjectPType) return ptype.orderedProperties().every(([, pt]) => isArc4EncodableType(pt))

  return false
}
export function ptypeToArc4EncodedType(ptype: PType, sourceLocation: SourceLocation): ARC4EncodedType {
  if (ptype instanceof ARC4EncodedType) return ptype
  if (ptype.equals(boolPType)) return ARC4BooleanType
  if (ptype.equals(uint64PType)) return new UintNType({ n: 64n })
  if (ptype.equals(bytesPType)) return new DynamicArrayType({ elementType: arc4ByteAlias })
  if (ptype.equals(stringPType)) return ARC4StringType
  if (ptype instanceof TuplePType) return new ARC4TupleType({ types: ptype.items.map((i) => ptypeToArc4EncodedType(i, sourceLocation)) })
  if (ptype instanceof ObjectPType)
    return new ARC4StructType({
      name: ptype.name,
      module: ptype.module,
      description: ptype.description,
      fields: Object.fromEntries(ptype.orderedProperties().map(([p, pt]) => [p, ptypeToArc4EncodedType(pt, sourceLocation)])),
    })

  throw new CodeError(`${ptype} cannot be encoded to an ARC4 type`, { sourceLocation })
}

export function getFunctionTypes(ptype: FunctionPType, sourceLocation: SourceLocation): Record<string, PType> {
  const result: Record<string, PType> = {}
  for (const [param, paramType] of ptype.parameters) {
    result[param] = paramType
  }
  if ('output' in result) {
    logger.error(sourceLocation, 'for compatibility with ARC-32, ARC-4 methods cannot have an argument named output')
  }

  result['output'] = ptype.returnType

  return result
}

export function getArc4StructDef(ptype: ARC4StructType): ARC32StructDef {
  return {
    name: ptype.name,
    elements: Object.entries(ptype.fields).map(([f, t]) => [f, t.wtype.arc4Name]),
  }
}
