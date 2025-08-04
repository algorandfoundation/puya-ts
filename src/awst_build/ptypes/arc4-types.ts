import type { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'
import { Constants } from '../../constants'
import { codeInvariant, invariant } from '../../util'
import { GenericPType, PType } from './base'
import {
  accountPType,
  applicationItxnType,
  ArrayPType,
  biguintPType,
  boolPType,
  bytesPType,
  compiledContractType,
  ContractClassPType,
  ImmutableObjectPType,
  LibClassType,
  LibFunctionType,
  MutableObjectPType,
  MutableTuplePType,
  NumericLiteralPType,
  ReadonlyArrayPType,
  ReadonlyTuplePType,
  stringPType,
  uint64PType,
  voidPType,
} from './index'
import type { PTypeVisitor } from './visitor'

export const ByteClass = new LibClassType({
  name: 'Byte',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})
export const UintN8Class = new LibClassType({
  name: 'Uint8',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})
export const UintN16Class = new LibClassType({
  name: 'Uint16',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})
export const UintN32Class = new LibClassType({
  name: 'Uint32',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})
export const UintN64Class = new LibClassType({
  name: 'Uint64',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})
export const UintN128Class = new LibClassType({
  name: 'Uint128',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})
export const UintN256Class = new LibClassType({
  name: 'Uint256',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})
export abstract class ARC4EncodedType extends PType {
  abstract readonly wtype: wtypes.ARC4Type
  abstract readonly nativeType: PType | undefined
  abstract readonly abiTypeSignature: string

  protected static buildAbiTupleSignature(types: ARC4EncodedType[]): string {
    return `(${types.map((t) => t.abiTypeSignature).join(',')})`
  }
}

export abstract class ARC4ArrayType extends ARC4EncodedType {
  readonly elementType: ARC4EncodedType
  constructor({ elementType }: { elementType: ARC4EncodedType }) {
    super()
    this.elementType = elementType
  }
}

export class ARC4InstanceType extends ARC4EncodedType {
  readonly [PType.IdSymbol] = 'ARC4InstanceType'
  readonly wtype: wtypes.ARC4Type
  readonly name: string
  readonly module = Constants.moduleNames.algoTs.arc4.encodedTypes
  readonly singleton = false
  readonly nativeType: PType

  readonly abiTypeSignature: string
  constructor({ wtype, nativeType, name, abiName }: { wtype: wtypes.ARC4Type; name: string; nativeType: PType; abiName: string }) {
    super()
    this.wtype = wtype
    this.name = name
    this.nativeType = nativeType
    this.abiTypeSignature = abiName
  }

  accept<T>(visitor: PTypeVisitor<T>): T {
    return visitor.visitARC4InstanceType(this)
  }
}

export const ARC4BoolClass = new LibClassType({
  name: 'Bool',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})

export const ARC4StrClass = new LibClassType({
  name: 'Str',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})

export const arc4BooleanType = new ARC4InstanceType({
  name: 'Bool',
  wtype: wtypes.arc4BooleanWType,
  nativeType: boolPType,
  abiName: 'bool',
})

export const arc4StringType = new ARC4InstanceType({
  name: 'Str',
  wtype: wtypes.arc4StringAliasWType,
  nativeType: stringPType,
  abiName: 'string',
})

export class ARC4StructClass extends PType {
  readonly [PType.IdSymbol] = 'ARC4StructClass'
  readonly name: string
  readonly module: string
  readonly singleton = true
  readonly instanceType: ARC4StructType
  readonly sourceLocation: SourceLocation | undefined
  readonly wtype = undefined
  constructor({
    name,
    module,
    instanceType,
    sourceLocation,
  }: {
    name: string
    module: string
    instanceType: ARC4StructType
    sourceLocation?: SourceLocation
  }) {
    super()
    this.name = name
    this.module = module
    this.sourceLocation = sourceLocation
    this.instanceType = instanceType
  }

  static fromStructType(ptype: ARC4StructType) {
    return new ARC4StructClass({
      ...ptype,
      instanceType: ptype,
    })
  }

  accept<T>(visitor: PTypeVisitor<T>): T {
    return visitor.visitARC4StructClass(this)
  }
}

export class ARC4StructType extends ARC4EncodedType {
  readonly [PType.IdSymbol] = 'ARC4StructType'
  readonly name: string
  readonly module: string
  readonly description: string | undefined
  readonly singleton = false
  readonly fields: Record<string, ARC4EncodedType>
  readonly sourceLocation: SourceLocation | undefined
  readonly frozen: boolean

  readonly abiTypeSignature: string
  constructor({
    name,
    frozen,
    module,
    fields,
    description,
    sourceLocation,
  }: {
    name: string
    module: string
    frozen: boolean
    description: string | undefined
    fields: Record<string, ARC4EncodedType>
    sourceLocation?: SourceLocation
  }) {
    super()
    this.name = name
    this.module = module
    this.frozen = frozen
    this.fields = fields
    this.description = description
    this.sourceLocation = sourceLocation

    this.abiTypeSignature = ARC4EncodedType.buildAbiTupleSignature(Object.values(fields))
  }

  get nativeType(): MutableObjectPType {
    return new MutableObjectPType({ properties: this.fields })
  }

  get wtype(): wtypes.ARC4Struct {
    return new wtypes.ARC4Struct({
      name: this.name,
      fields: Object.fromEntries(Object.entries(this.fields).map(([f, t]) => [f, t.wtype])),
      sourceLocation: this.sourceLocation,
      desc: this.description ?? null,
      frozen: this.frozen,
    })
  }

  accept<T>(visitor: PTypeVisitor<T>): T {
    return visitor.visitARC4StructType(this)
  }
}

export const arc4StructBaseType = new ARC4StructType({
  name: 'StructBase',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
  fields: {},
  description: undefined,
  frozen: false,
})

export const Arc4TupleGeneric = new GenericPType({
  name: 'Tuple',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
  parameterise([tupleType, ...rest]: readonly PType[]) {
    codeInvariant(tupleType && !rest.length, `${this.name} expects 1 generic parameter`)
    codeInvariant(
      tupleType instanceof ReadonlyTuplePType || tupleType instanceof MutableTuplePType,
      `${this.name} generic parameter must be a native tuple type`,
    )
    const encodedTypes = tupleType.items.map((itemType, index) => {
      codeInvariant(itemType instanceof ARC4EncodedType, `Item ${index} of ARC4 Tuple must be an ARC4 encoded type`)
      return itemType
    })
    return new ARC4TupleType({
      types: encodedTypes,
    })
  },
})

export class ARC4TupleType extends ARC4EncodedType {
  readonly [PType.IdSymbol] = 'ARC4TupleType'
  readonly name: string
  readonly module = Constants.moduleNames.algoTs.arc4.encodedTypes
  readonly singleton = false
  readonly items: ARC4EncodedType[]
  readonly sourceLocation: SourceLocation | undefined

  readonly nativeType: ReadonlyTuplePType
  readonly abiTypeSignature: string

  constructor({ types, sourceLocation }: { types: ARC4EncodedType[]; sourceLocation?: SourceLocation }) {
    super()
    this.items = types
    this.name = `Tuple<${this.items.map((i) => i.name).join(',')}>`
    this.sourceLocation = sourceLocation
    this.nativeType = new ReadonlyTuplePType({ items: this.items })

    this.abiTypeSignature = ARC4EncodedType.buildAbiTupleSignature(types)
  }

  get wtype(): wtypes.ARC4Tuple {
    return new wtypes.ARC4Tuple({
      types: this.items.map((t) => t.wtype),
      sourceLocation: this.sourceLocation,
      immutable: false,
    })
  }

  accept<T>(visitor: PTypeVisitor<T>): T {
    return visitor.visitARC4TupleType(this)
  }
}
export const UintNGeneric = new GenericPType({
  name: 'Uint',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
  parameterise(typeArgs: readonly PType[]): UintNType {
    codeInvariant(typeArgs.length === 1, 'UintNType type expects exactly one type parameter')
    const [size] = typeArgs
    codeInvariant(
      size instanceof NumericLiteralPType && size.literalValue,
      `Generic type param for UintNType must be a literal number. Inferred type is ${size.name}`,
    )

    return new UintNType({ n: size.literalValue })
  },
})
export class UintNType extends ARC4EncodedType {
  readonly [PType.IdSymbol] = 'UintNType'
  readonly module = Constants.moduleNames.algoTs.arc4.encodedTypes
  readonly n: bigint
  readonly name: string
  readonly singleton = false
  readonly wtype: wtypes.ARC4UIntN
  readonly abiTypeSignature: string

  get nativeType() {
    return this.n <= 64n ? uint64PType : biguintPType
  }

  constructor({ n, wtype, name }: { n: bigint; wtype?: wtypes.ARC4UIntN; name?: string }) {
    super()
    codeInvariant(n >= 8n && n <= 512n && n % 8n === 0n, 'n must be between 8 and 512, and a multiple of 8')
    this.n = n

    this.name = name ?? `Uint<${n}>`
    this.wtype = wtype ?? new wtypes.ARC4UIntN({ n: this.n })
    this.abiTypeSignature = wtype?.arc4Alias ?? `uint${n}`
  }

  accept<T>(visitor: PTypeVisitor<T>): T {
    return visitor.visitUintNType(this)
  }
}
export const arc4Uint64 = new UintNType({ n: 64n })
export const UFixedNxMGeneric = new GenericPType({
  name: 'UFixed',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
  parameterise(typeArgs: readonly PType[]) {
    codeInvariant(typeArgs.length === 2, `${this.name} expects exactly 2 generic type parameters`)
    const [n, m] = typeArgs
    codeInvariant(
      n instanceof NumericLiteralPType && n.literalValue,
      `Generic type param 'N' for ${this.name}  must be a literal number. Inferred type is ${n.name}`,
    )
    codeInvariant(
      m instanceof NumericLiteralPType && m.literalValue,
      `Generic type param 'M' for UintNType must be a literal number. Inferred type is ${m.name}`,
    )
    return new UFixedNxMType({
      n: n.literalValue,
      m: m.literalValue,
    })
  },
})
export class UFixedNxMType extends ARC4EncodedType {
  readonly [PType.IdSymbol] = 'UFixedNxMType'
  readonly module = Constants.moduleNames.algoTs.arc4.encodedTypes
  readonly n: bigint
  readonly m: bigint
  readonly name: string
  readonly singleton = false
  readonly wtype: wtypes.ARC4UFixedNxM
  readonly abiTypeSignature: string

  get nativeType() {
    return this.n <= 64n ? uint64PType : biguintPType
  }

  constructor({ n, m }: { n: bigint; m: bigint }) {
    super()
    codeInvariant(n >= 8n && n <= 512n && n % 8n === 0n, 'n must be between 8 and 512, and a multiple of 8')
    codeInvariant(m >= 1n && m <= 160n, 'm must be between 1 and 160')
    this.n = n
    this.m = m

    this.name = `${UFixedNxMGeneric.name}<${n}, ${m}>`
    this.wtype = new wtypes.ARC4UFixedNxM({ n: this.n, m: this.m })
    this.abiTypeSignature = `ufixed${n}x${m}`
  }

  accept<T>(visitor: PTypeVisitor<T>): T {
    return visitor.visitUFixedNxMType(this)
  }
}

export const arc4ByteAlias = new UintNType({ n: 8n, wtype: wtypes.arc4ByteAliasWType, name: 'Byte' })

export const DynamicArrayGeneric = new GenericPType({
  name: 'DynamicArray',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
  parameterise: (typeArgs: readonly PType[]): DynamicArrayType => {
    codeInvariant(typeArgs.length === 1, 'DynamicArray type expects exactly one type parameter')
    const [elementType] = typeArgs
    codeInvariant(
      elementType instanceof ARC4EncodedType,
      `Generic type param for DynamicArray must be an ARC4 encoded type. Inferred type is ${elementType.name}`,
    )

    return new DynamicArrayType({ elementType: elementType })
  },
})
export class DynamicArrayType extends ARC4ArrayType {
  readonly [PType.IdSymbol] = 'DynamicArrayType'
  readonly module = Constants.moduleNames.algoTs.arc4.encodedTypes

  readonly immutable: boolean
  readonly name: string
  readonly singleton = false
  readonly sourceLocation: SourceLocation | undefined
  readonly nativeType: PType
  readonly wtype: wtypes.ARC4DynamicArray
  readonly abiTypeSignature: string

  constructor({
    elementType,
    nativeType,
    sourceLocation,
    name,
    immutable,
  }: {
    elementType: ARC4EncodedType
    sourceLocation?: SourceLocation
    name?: string
    immutable?: boolean
    nativeType?: PType
  }) {
    super({
      elementType,
    })
    this.immutable = immutable ?? false
    this.nativeType = nativeType ?? new ArrayPType({ elementType })
    this.name = name ?? `DynamicArray<${elementType}>`
    this.sourceLocation = sourceLocation
    this.wtype = new wtypes.ARC4DynamicArray({
      elementType: this.elementType.wtype,
      sourceLocation: this.sourceLocation,
      immutable: this.immutable,
    })
    this.abiTypeSignature = `${this.elementType.abiTypeSignature}[]`
  }

  accept<T>(visitor: PTypeVisitor<T>): T {
    return visitor.visitDynamicArrayType(this)
  }
}

export const StaticArrayGeneric = new GenericPType({
  name: 'StaticArray',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
  parameterise: (typeArgs: readonly PType[]): StaticArrayType => {
    codeInvariant(typeArgs.length === 2, 'StaticArray type expects exactly one type parameters')
    const [elementType, arraySize] = typeArgs
    codeInvariant(
      elementType instanceof ARC4EncodedType,
      `Element type generic type param for StaticArray must be an ARC4 encoded type. Inferred type is ${elementType.name}`,
    )
    codeInvariant(
      arraySize instanceof NumericLiteralPType,
      `Array size generic type param for StaticArray must be a literal number. Inferred type is ${arraySize.name}`,
    )

    return new StaticArrayType({ arraySize: arraySize.literalValue, elementType })
  },
})
export class StaticArrayType extends ARC4ArrayType {
  readonly [PType.IdSymbol] = 'StaticArrayType'
  readonly module = Constants.moduleNames.algoTs.arc4.encodedTypes
  readonly arraySize: bigint
  readonly immutable: boolean
  readonly name: string
  readonly singleton = false
  readonly sourceLocation: SourceLocation | undefined
  readonly wtype: wtypes.ARC4StaticArray
  readonly nativeType: PType

  readonly abiTypeSignature: string
  constructor({
    elementType,
    arraySize,
    sourceLocation,
    wtype,
    name,
    immutable,
    nativeType,
    arc4Alias,
  }: {
    immutable?: boolean
    elementType: ARC4EncodedType
    arraySize: bigint
    sourceLocation?: SourceLocation
    wtype?: wtypes.ARC4StaticArray
    name?: string
    nativeType?: PType
    arc4Alias?: string
  }) {
    codeInvariant(arraySize >= 0, 'StaticArray length must be greater than or equal to 0')
    super({ elementType })
    this.immutable = immutable ?? false
    this.arraySize = arraySize
    this.name = name ?? `StaticArray<${elementType}, ${arraySize}>`
    this.sourceLocation = sourceLocation
    this.nativeType = nativeType ?? (this.immutable ? new ReadonlyArrayPType({ elementType }) : new ArrayPType({ elementType }))
    this.wtype =
      wtype ??
      new wtypes.ARC4StaticArray({
        elementType: this.elementType.wtype,
        arraySize: this.arraySize,
        immutable: this.immutable,
      })

    this.abiTypeSignature = arc4Alias ?? `${this.elementType.abiTypeSignature}[${this.arraySize}]`
  }

  accept<T>(visitor: PTypeVisitor<T>): T {
    return visitor.visitStaticArrayType(this)
  }
}
export const arc4AddressAlias = new StaticArrayType({
  arraySize: BigInt(Constants.algo.addressLength),
  elementType: arc4ByteAlias,
  wtype: wtypes.arc4AddressAliasWType,
  nativeType: accountPType,
  immutable: true,
  arc4Alias: 'address',
  name: 'Address',
})

export const AddressClass = new LibClassType({
  name: 'Address',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})

export const StaticBytesGeneric = new GenericPType({
  name: 'StaticBytes',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
  parameterise: (typeArgs: readonly PType[]): StaticBytesType => {
    codeInvariant(typeArgs.length === 1, 'StaticBytes type expects exactly one type parameter')
    const [length] = typeArgs

    codeInvariant(
      length instanceof NumericLiteralPType,
      `Length generic type param for StaticBytes must be a literal number. Inferred type is ${length.name}`,
    )
    return new StaticBytesType({
      length: length.literalValue,
    })
  },
})
export class StaticBytesType extends StaticArrayType {
  constructor({ length }: { length: bigint }) {
    codeInvariant(length >= 0, 'StaticBytes length must be greater than or equal to 0')
    super({
      name: `StaticBytes<${length}>`,
      immutable: true,
      elementType: arc4ByteAlias,
      arraySize: length,
      nativeType: bytesPType,
    })
  }
}
export const DynamicBytesConstructor = new LibClassType({
  name: 'DynamicBytes',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})
export const DynamicBytesType = new DynamicArrayType({
  name: `DynamicBytes`,
  immutable: true,
  elementType: arc4ByteAlias,
  nativeType: bytesPType,
})

export const interpretAsArc4Function = new LibFunctionType({
  name: 'interpretAsArc4',
  module: Constants.moduleNames.algoTs.arc4.index,
})

export const encodeArc4Function = new LibFunctionType({
  name: 'encodeArc4',
  module: Constants.moduleNames.algoTs.arc4.index,
})
export const arc4EncodedLengthFunction = new LibFunctionType({
  name: 'arc4EncodedLength',
  module: Constants.moduleNames.algoTs.arc4.index,
})

export const decodeArc4Function = new LibFunctionType({
  name: 'decodeArc4',
  module: Constants.moduleNames.algoTs.arc4.index,
})

export const methodSelectorFunction = new LibFunctionType({
  name: 'methodSelector',
  module: Constants.moduleNames.algoTs.arc4.index,
})

export const abiCallFunction = new LibFunctionType({
  name: 'abiCall',
  module: Constants.moduleNames.algoTs.arc4.c2c,
})
export const compileArc4Function = new LibFunctionType({
  name: 'compileArc4',
  module: Constants.moduleNames.algoTs.arc4.c2c,
})

export const ContractProxyGeneric = new GenericPType({
  name: 'ContractProxy',
  module: Constants.moduleNames.algoTs.arc4.c2c,
  parameterise(args: readonly PType[]) {
    invariant(args.length === 1, 'ContractProxy expects exactly 1 type arg')
    const [typeArg] = args
    invariant(typeArg instanceof ContractClassPType && typeArg.isARC4, 'Contract Proxy generic type arg must extend arc4 Contract type')
    return new ContractProxyType({ contractType: typeArg })
  },
})

export class ContractProxyType extends PType {
  readonly [PType.IdSymbol] = 'ContractProxyType'
  readonly name: string
  readonly module = Constants.moduleNames.algoTs.arc4.c2c
  readonly wtype: wtypes.WTuple
  readonly singleton = false
  readonly contractType: ContractClassPType
  constructor({ contractType }: { contractType: ContractClassPType }) {
    super()
    this.name = `ContractProxy<${contractType.name}>`

    this.wtype = compiledContractType.wtype
    this.contractType = contractType
  }

  accept<T>(visitor: PTypeVisitor<T>): T {
    return visitor.visitContractProxyType(this)
  }
}

export const TypedApplicationCallResponseGeneric = new GenericPType({
  name: 'TypedApplicationCallResponse',
  module: Constants.moduleNames.algoTs.arc4.c2c,
  parameterise(args: readonly PType[]) {
    invariant(args.length === 1, 'TypedApplicationCallResponse expects exactly 1 type arg')
    const [typeArg] = args
    return new TypedApplicationCallResponseType({ returnValue: typeArg })
  },
})

export class TypedApplicationCallResponseType extends ImmutableObjectPType {
  readonly name: string
  readonly module = Constants.moduleNames.algoTs.arc4.c2c
  readonly singleton = false
  readonly returnValue: PType

  constructor({ returnValue }: { returnValue: PType }) {
    super({
      properties: returnValue.equals(voidPType)
        ? { itxn: applicationItxnType }
        : {
            itxn: applicationItxnType,
            returnValue,
          },
    })
    this.name = `TypedApplicationCallResponseType<${returnValue.name}>`
    this.returnValue = returnValue
  }
}
