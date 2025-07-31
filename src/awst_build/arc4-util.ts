import type { ResourceEncoding } from '../awst'
import { nodeFactory } from '../awst/node-factory'
import type { ARC4ABIMethodConfig } from '../awst/nodes'
import type { SourceLocation } from '../awst/source-location'
import { wtypes } from '../awst/wtypes'
import { CodeError } from '../errors'
import { codeInvariant, invariant } from '../util'
import type { ABICompatiblePType, FunctionPType, PType } from './ptypes'
import {
  ABICompatibleInstanceType,
  accountPType,
  applicationPType,
  ArrayPType,
  assetPType,
  biguintPType,
  boolPType,
  BytesPType,
  FixedArrayPType,
  GroupTransactionPType,
  ImmutableObjectPType,
  MutableObjectPType,
  MutableTuplePType,
  ReadonlyArrayPType,
  ReadonlyTuplePType,
  stringPType,
  TransientType,
  uint64PType,
  voidPType,
} from './ptypes'
import {
  arc4AddressAlias,
  arc4BooleanType,
  ARC4EncodedType,
  arc4StringType,
  ARC4StructType,
  ARC4TupleType,
  arc4Uint64,
  DynamicArrayType,
  DynamicBytesType,
  StaticArrayType,
  StaticBytesType,
  UintNType,
} from './ptypes/arc4-types'

/**
 * For a given ptype, return the equivalent ABI compatible type - or error if there is no compatible type
 * @param ptype The type of the parameter
 * @param direction The direction of the parameter (in for method args, out for method returns)
 * @param resourceEncoding The encoding strategy for the foreign resource types (App, Asset, Account)
 * @param sourceLocation The location of the method or parameter, for use in error metadata
 */
export function ptypeToAbiPType(
  ptype: PType,
  direction: 'in' | 'out',
  resourceEncoding: ResourceEncoding,
  sourceLocation: SourceLocation,
): ABICompatiblePType {
  if (ptype instanceof ARC4EncodedType) return ptype
  if (ptype instanceof GroupTransactionPType) {
    codeInvariant(direction === 'in', `${ptype.name} cannot be used as an ABI return type`, sourceLocation)
    return ptype
  }
  if (ptype.equalsOneOf(applicationPType, assetPType)) {
    invariant(ptype instanceof ABICompatibleInstanceType, 'application and asset are all ABICompatibleInstanceType')
    if (resourceEncoding === 'foreign_index' && direction === 'in') {
      return ptype
    }
    return arc4Uint64
  }
  if (ptype.equals(accountPType)) {
    invariant(ptype instanceof ABICompatibleInstanceType, 'account is ABICompatibleInstanceType')
    if (resourceEncoding === 'foreign_index' && direction === 'in') {
      return ptype
    }
    return arc4AddressAlias
  }
  if (ptype.equals(voidPType)) {
    codeInvariant(direction === 'out', `${ptype.name} cannot be used as an ABI param type`, sourceLocation)
    return voidPType
  }
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
  const params = functionType.parameters
    .map(([_, ptype]) => getABITypeName(ptype, 'in', arc4Config.resourceEncoding, sourceLocation))
    .join(',')
  const returnType = getABITypeName(functionType.returnType, 'out', arc4Config.resourceEncoding, sourceLocation)
  return nodeFactory.methodConstant({
    value: `${arc4Config.name}(${params})${returnType}`,
    wtype: new wtypes.BytesWType({ length: 4n }),
    sourceLocation,
  })
}

/**
 * Get the ARC4 type name for a ptype, or throw if the ptype is not usable in an ABI method.
 * @param ptype The ptype of the parameter
 * @param direction The direction of the parameter (in for method args, out for method returns)
 * @param resourceEncoding The encoding strategy for the foreign resource types (App, Asset, Account)
 * @param sourceLocation The location of the method or parameter, for use in error metadata
 */
export function getABITypeName(
  ptype: PType,
  direction: 'in' | 'out',
  resourceEncoding: ResourceEncoding,
  sourceLocation: SourceLocation,
): string {
  return ptypeToAbiPType(ptype, direction, resourceEncoding, sourceLocation).abiTypeSignature
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
  if (ptype instanceof BytesPType) return true
  if (ptype.equals(stringPType)) return true
  if (ptype.equals(assetPType)) return true
  if (ptype.equals(applicationPType)) return true
  if (ptype.equals(accountPType)) return true
  if (ptype instanceof ReadonlyTuplePType) return ptype.items.every((i) => isArc4EncodableType(i))
  if (ptype instanceof MutableTuplePType) return ptype.items.every((i) => isArc4EncodableType(i))
  if (ptype instanceof ImmutableObjectPType) return ptype.orderedProperties().every(([, pt]) => isArc4EncodableType(pt))
  if (ptype instanceof MutableObjectPType) return ptype.orderedProperties().every(([, pt]) => isArc4EncodableType(pt))
  if (ptype instanceof ArrayPType || ptype instanceof FixedArrayPType || ptype instanceof ReadonlyArrayPType)
    return isArc4EncodableType(ptype.elementType)
  return false
}

/**
 * For a given type, return the arc4 encoded version of that type
 * @param ptype The type to be encoded
 * @param sourceLocation The source location triggering the conversion
 */
export function ptypeToArc4EncodedType(ptype: ReadonlyTuplePType, sourceLocation: SourceLocation): ARC4TupleType
export function ptypeToArc4EncodedType(ptype: MutableTuplePType, sourceLocation: SourceLocation): ARC4TupleType
export function ptypeToArc4EncodedType(ptype: ImmutableObjectPType, sourceLocation: SourceLocation): ARC4StructType
export function ptypeToArc4EncodedType(ptype: ArrayPType, sourceLocation: SourceLocation): DynamicArrayType
export function ptypeToArc4EncodedType(ptype: ReadonlyArrayPType, sourceLocation: SourceLocation): DynamicArrayType
export function ptypeToArc4EncodedType(ptype: FixedArrayPType, sourceLocation: SourceLocation): StaticArrayType
export function ptypeToArc4EncodedType<T extends ARC4EncodedType>(ptype: T, sourceLocation: SourceLocation): T
export function ptypeToArc4EncodedType(ptype: PType, sourceLocation: SourceLocation): ARC4EncodedType
export function ptypeToArc4EncodedType(ptype: PType, sourceLocation: SourceLocation): ARC4EncodedType {
  if (ptype instanceof ARC4EncodedType) return ptype
  if (ptype.equals(boolPType)) return arc4BooleanType
  if (ptype.equals(uint64PType)) return new UintNType({ n: 64n })
  if (ptype.equals(biguintPType)) return new UintNType({ n: 512n })
  if (ptype instanceof BytesPType) return ptype.length === null ? DynamicBytesType : new StaticBytesType({ length: ptype.length })
  if (ptype.equals(stringPType)) return arc4StringType
  if (ptype.equals(assetPType)) return arc4Uint64
  if (ptype.equals(applicationPType)) return arc4Uint64
  if (ptype.equals(accountPType)) return arc4AddressAlias
  if (ptype instanceof TransientType) {
    throw new CodeError(ptype.expressionMessage, { sourceLocation })
  }
  if (ptype instanceof ArrayPType)
    return new DynamicArrayType({
      elementType: ptypeToArc4EncodedType(ptype.elementType, sourceLocation),
      immutable: false,
    })
  if (ptype instanceof ReadonlyArrayPType)
    return new DynamicArrayType({
      elementType: ptypeToArc4EncodedType(ptype.elementType, sourceLocation),
      immutable: true,
    })
  if (ptype instanceof FixedArrayPType)
    return new StaticArrayType({
      elementType: ptypeToArc4EncodedType(ptype.elementType, sourceLocation),
      arraySize: ptype.arraySize,
      immutable: false,
    })

  if (ptype instanceof ReadonlyTuplePType)
    return new ARC4TupleType({ types: ptype.items.map((i) => ptypeToArc4EncodedType(i, sourceLocation)) })
  if (ptype instanceof MutableTuplePType)
    return new ARC4TupleType({ types: ptype.items.map((i) => ptypeToArc4EncodedType(i, sourceLocation)) })

  if (ptype instanceof ImmutableObjectPType)
    return new ARC4StructType({
      name: ptype.alias?.name ?? ptype.name,
      module: ptype.module,
      description: ptype.description,
      fields: Object.fromEntries(ptype.orderedProperties().map(([p, pt]) => [p, ptypeToArc4EncodedType(pt, sourceLocation)])),
      frozen: true,
    })
  if (ptype instanceof MutableObjectPType)
    return new ARC4StructType({
      name: ptype.alias?.name ?? ptype.name,
      module: ptype.module,
      description: ptype.description,
      fields: Object.fromEntries(ptype.orderedProperties().map(([p, pt]) => [p, ptypeToArc4EncodedType(pt, sourceLocation)])),
      frozen: false,
    })

  throw new CodeError(`${ptype} cannot be encoded to an ARC4 type`, { sourceLocation })
}
