import { nodeFactory } from '../awst/node-factory'
import { ARC4ABIMethodConfig } from '../awst/nodes'
import type { SourceLocation } from '../awst/source-location'
import { wtypes } from '../awst/wtypes'
import { CodeError } from '../errors'
import { codeInvariant, invariant } from '../util'
import { AwstBuildContext } from './context/awst-build-context'
import type { FunctionPType, PType } from './ptypes'
import {
  accountPType,
  applicationPType,
  ArrayPType,
  assetPType,
  biguintPType,
  boolPType,
  BytesPType,
  FixedArrayPType,
  ImmutableObjectPType,
  MutableObjectPType,
  MutableTuplePType,
  ReadonlyArrayPType,
  ReadonlyTuplePType,
  stringPType,
  TransientType,
  uint64PType,
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

export function arc4ConfigFromType(functionType: FunctionPType, sourceLocation: SourceLocation) {
  codeInvariant(
    functionType.declaredIn,
    `${functionType.name} does not appear to be a contract method. Ensure you are calling a function defined on a contract class eg. abiCall<typeof YourContract.prototype.yourMethod>`,
    sourceLocation,
  )

  const contractType = AwstBuildContext.current.getContractTypeByName(functionType.declaredIn)
  invariant(contractType, `${functionType.declaredIn} has not been visited`)

  const arc4Config = AwstBuildContext.current.getArc4Config(contractType, functionType.name)
  codeInvariant(
    arc4Config instanceof ARC4ABIMethodConfig,
    `${functionType.name} is not an ABI method. Only ABI compatible methods can be called with this helper.`,
    sourceLocation,
  )
  const methodSelector = buildArc4MethodConstant(functionType, arc4Config, sourceLocation)
  return {
    arc4Config,
    methodSelector,
  }
}

/**
 * Generate a methodConstant node for the given function, making use of the ARC4ABIMethodConfig
 * @param functionType The function ptype
 * @param arc4Config ARC4 method config
 * @param sourceLocation The source location of the code generating the constant,
 */
export function buildArc4MethodConstant(functionType: FunctionPType, arc4Config: ARC4ABIMethodConfig, sourceLocation: SourceLocation) {
  const methodSignature = nodeFactory.methodSignature({
    name: arc4Config.name,
    argTypes: functionType.parameters.map(([_, ptype]) => ptype.wtypeOrThrow),
    returnType: functionType.returnType.wtypeOrThrow,
    resourceEncoding: arc4Config.resourceEncoding,
    sourceLocation,
  })
  return nodeFactory.methodConstant({
    value: methodSignature,
    wtype: new wtypes.BytesWType({ length: 4n }),
    sourceLocation,
  })
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
