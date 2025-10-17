import { nodeFactory } from '../awst/node-factory'
import type { ARC4ABIMethodConfig } from '../awst/nodes'
import type { SourceLocation } from '../awst/source-location'
import { wtypes } from '../awst/wtypes'
import { CodeError } from '../errors'
import { codeInvariant } from '../util'
import type { FunctionPType, PType } from './ptypes'
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

/**
 * For a given ptype, return the equivalent ABI compatible type - or error if there is no compatible type
 * @param ptype The type of the parameter
 * @param direction The direction of the parameter (in for method args, out for method returns)
 * @param sourceLocation The location of the method or parameter, for use in error metadata
 */
export function ptypeToAbiPType(ptype: PType, direction: 'in' | 'out', sourceLocation: SourceLocation): PType {
  if (ptype instanceof ARC4EncodedType) return ptype
  if (ptype instanceof GroupTransactionPType) {
    codeInvariant(direction === 'in', `${ptype.name} cannot be used as an ABI return type`, sourceLocation)
    return ptype
  }
  if (ptype.equals(applicationPType) || ptype.equals(accountPType) || ptype.equals(assetPType)) {
    codeInvariant(direction === 'in', `${ptype.name} cannot be used as an ABI return type`, sourceLocation)
    return ptype
  }
  if (ptype.equals(voidPType)) return voidPType
  if (isArc4EncodableType(ptype)) {
    return ptypeToArc4EncodedType(ptype, sourceLocation)
  }
  throw new CodeError(`${ptype} cannot be used as an ABI ${direction === 'in' ? 'param' : 'return'} type`, { sourceLocation })
}

/**
 * Generate a methodConstant node for the given function, making use of the ARC4ABIMethodConfig
 * @param functionType The function ptype
 * @param arc4Config ARC4 method config
 * @param sourceLocation The source location of the code generating the constant,
 */
export function buildArc4MethodConstant(functionType: FunctionPType, arc4Config: ARC4ABIMethodConfig, sourceLocation: SourceLocation) {
  const params = functionType.parameters.map(([_, ptype]) => getABITypeName(ptype, 'in', sourceLocation)).join(',')
  const returnType = getABITypeName(functionType.returnType, 'out', sourceLocation)
  return nodeFactory.methodConstant({
    value: `${arc4Config.name}(${params})${returnType}`,
    wtype: wtypes.bytesWType,
    sourceLocation,
  })
}

/**
 * Get the ARC4 type name for a ptype, or throw if the ptype is not usable in an ABI method.
 * @param ptype The ptype of the parameter
 * @param direction The direction of the parameter (in for method args, out for method returns)
 * @param sourceLocation The location of the method or parameter, for use in error metadata
 */
export function getABITypeName(ptype: PType, direction: 'in' | 'out', sourceLocation: SourceLocation): string {
  const arc4Type = ptypeToAbiPType(ptype, direction, sourceLocation)
  if (arc4Type.wtype instanceof wtypes.ARC4Type || arc4Type.wtype instanceof wtypes.WGroupTransaction) {
    return arc4Type.wtype.arc4Alias
  }
  return arc4Type.wtypeOrThrow.name
}

/**
 * Is the given type an ARC4 encoded type, or can it be encoded to one
 * @param ptype The type to check
 */
export function isArc4EncodableType(ptype: PType): boolean {
  if (ptype instanceof ARC4EncodedType) return true
  if (ptype.equals(boolPType)) return true
  if (ptype.equals(uint64PType)) return true
  if (ptype.equals(biguintPType)) return true
  if (ptype.equals(bytesPType)) return true
  if (ptype.equals(stringPType)) return true
  if (ptype instanceof TuplePType) return ptype.items.every((i) => isArc4EncodableType(i))
  if (ptype instanceof ObjectPType) return ptype.orderedProperties().every(([, pt]) => isArc4EncodableType(pt))
  if (ptype instanceof ArrayPType) return isArc4EncodableType(ptype.elementType)
  return false
}

/**
 * For a given type, return the arc4 encoded version of that type
 * @param ptype The type to be encoded
 * @param sourceLocation The source location triggering the conversion
 */
export function ptypeToArc4EncodedType(ptype: TuplePType, sourceLocation: SourceLocation): ARC4TupleType
export function ptypeToArc4EncodedType(ptype: ObjectPType, sourceLocation: SourceLocation): ARC4StructType
export function ptypeToArc4EncodedType(ptype: ArrayPType, sourceLocation: SourceLocation): DynamicArrayType
export function ptypeToArc4EncodedType<T extends ARC4EncodedType>(ptype: T, sourceLocation: SourceLocation): T
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
      elementType: ptypeToArc4EncodedType(ptype.elementType, sourceLocation),
      immutable: true,
    })

  if (ptype instanceof TuplePType) return new ARC4TupleType({ types: ptype.items.map((i) => ptypeToArc4EncodedType(i, sourceLocation)) })

  if (ptype instanceof ObjectPType)
    return new ARC4StructType({
      name: ptype.alias?.name ?? ptype.name,
      module: ptype.module,
      description: ptype.description,
      fields: Object.fromEntries(ptype.orderedProperties().map(([p, pt]) => [p, ptypeToArc4EncodedType(pt, sourceLocation)])),
      frozen: true,
    })

  throw new CodeError(`${ptype} cannot be encoded to an ARC4 type`, { sourceLocation })
}
