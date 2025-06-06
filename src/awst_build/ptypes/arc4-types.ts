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
  LibClassType,
  LibFunctionType,
  NumericLiteralPType,
  ObjectPType,
  stringPType,
  TuplePType,
  uint64PType,
  voidPType,
} from './index'
import ARC4StaticArray = wtypes.ARC4StaticArray
import WTuple = wtypes.WTuple

export const UintNClass = new LibClassType({
  name: 'UintN',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})

export const ByteClass = new LibClassType({
  name: 'Byte',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})
export const UintN8Class = new LibClassType({
  name: 'UintN8',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})
export const UintN16Class = new LibClassType({
  name: 'UintN16',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})
export const UintN32Class = new LibClassType({
  name: 'UintN32',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})
export const UintN64Class = new LibClassType({
  name: 'UintN64',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})
export const UintN128Class = new LibClassType({
  name: 'UintN128',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})
export const UintN256Class = new LibClassType({
  name: 'UintN256',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})
export abstract class ARC4EncodedType extends PType {
  abstract readonly wtype: wtypes.ARC4Type
  abstract readonly nativeType: PType | undefined
  abstract readonly fixedBitSize: bigint | null

  get fixedByteSize(): bigint | null {
    return this.fixedBitSize === null ? null : ARC4EncodedType.bitsToBytes(this.fixedBitSize)
  }

  /**
   * Calculate fixed the number of bits required to store a sequence of ARC4 types using ARC4's bit-packing technique for consecutive booleans.
   *
   * Returns `null` if the sequence contains a dynamically sized type
   * @param types The sequence of types being encoded
   */
  protected static calculateFixedBitSize(types: ARC4EncodedType[]): bigint | null {
    return types.reduce((acc: bigint | null, cur) => {
      if (acc === null || cur.fixedBitSize === null) return null

      if (cur.fixedBitSize === 1n) {
        return acc + cur.fixedBitSize
      } else {
        return this.roundBitsUpToNearestByte(acc) + this.roundBitsUpToNearestByte(cur.fixedBitSize)
      }
    }, 0n)
  }

  /**
   * Get the number of bytes required to represent n bits
   * @param n The number of bits which need representing
   */
  protected static bitsToBytes(n: bigint): bigint {
    return (n + 7n) / 8n
  }

  protected static roundBitsUpToNearestByte(bits: bigint): bigint {
    return this.bitsToBytes(bits) * 8n
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
  readonly wtype: wtypes.ARC4Type
  readonly name: string
  readonly module = Constants.moduleNames.algoTs.arc4.encodedTypes
  readonly singleton = false
  readonly nativeType: PType
  readonly fixedBitSize: bigint | null
  constructor({
    wtype,
    nativeType,
    name,
    fixedBitSize,
  }: {
    wtype: wtypes.ARC4Type
    name: string
    nativeType: PType
    fixedBitSize: bigint | null
  }) {
    super()
    this.wtype = wtype
    this.name = name
    this.nativeType = nativeType
    this.fixedBitSize = fixedBitSize
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
  fixedBitSize: 1n,
})

export const arc4StringType = new ARC4InstanceType({
  name: 'Str',
  wtype: wtypes.arc4StringAliasWType,
  nativeType: stringPType,
  fixedBitSize: null,
})

export class ARC4StructClass extends PType {
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
}

export class ARC4StructType extends ARC4EncodedType {
  readonly name: string
  readonly module: string
  readonly description: string | undefined
  readonly singleton = false
  readonly fields: Record<string, ARC4EncodedType>
  readonly sourceLocation: SourceLocation | undefined
  readonly frozen: boolean
  readonly fixedBitSize: bigint | null
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
    this.fixedBitSize = ARC4EncodedType.calculateFixedBitSize(Object.values(fields))
  }

  get nativeType(): ObjectPType {
    return ObjectPType.anonymous(this.fields)
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

  get signature(): string {
    return `${this.name}${this.wtype.arc4Name}`
  }
}

export const arc4StructBaseType = new ARC4StructType({
  name: 'StructBase',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
  fields: {},
  description: undefined,
  frozen: false,
})

export const Arc4TupleClass = new LibClassType({
  name: 'Tuple',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})

export const Arc4TupleGeneric = new GenericPType({
  name: 'Tuple',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
  parameterise(ptypes: PType[]) {
    codeInvariant(ptypes.length, `${this.name} expects 1 generic parameter`)
    codeInvariant(ptypes[0] instanceof TuplePType, `${this.name} generic parameter must be a native tuple type`)
    const encodedTypes = ptypes[0].items.map((itemType, index) => {
      codeInvariant(itemType instanceof ARC4EncodedType, `Item ${index} of ARC4 Tuple must be an ARC4 encoded type`)
      return itemType
    })
    return new ARC4TupleType({
      types: encodedTypes,
    })
  },
})

export class ARC4TupleType extends ARC4EncodedType {
  readonly name = 'Tuple'
  readonly module = Constants.moduleNames.algoTs.arc4.encodedTypes
  readonly singleton = false
  readonly items: ARC4EncodedType[]
  readonly sourceLocation: SourceLocation | undefined
  readonly fixedBitSize: bigint | null
  readonly nativeType: TuplePType

  constructor({ types, sourceLocation }: { types: ARC4EncodedType[]; sourceLocation?: SourceLocation }) {
    super()
    this.items = types
    this.sourceLocation = sourceLocation
    this.nativeType = new TuplePType({ items: this.items })
    this.fixedBitSize = ARC4EncodedType.calculateFixedBitSize(types)
  }

  get wtype(): wtypes.ARC4Tuple {
    return new wtypes.ARC4Tuple({
      types: this.items.map((t) => t.wtype),
      sourceLocation: this.sourceLocation,
    })
  }
}
export const UintNGeneric = new GenericPType({
  name: 'UintN',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
  parameterise(typeArgs: PType[]): UintNType {
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
  readonly module = Constants.moduleNames.algoTs.arc4.encodedTypes
  readonly n: bigint
  readonly name: string
  readonly singleton = false
  readonly wtype: wtypes.ARC4UIntN

  get fixedBitSize() {
    return this.n
  }

  get nativeType() {
    return this.n <= 64n ? uint64PType : biguintPType
  }

  constructor({ n, wtype, name }: { n: bigint; wtype?: wtypes.ARC4UIntN; name?: string }) {
    super()
    codeInvariant(n >= 8n && n <= 512n && n % 8n === 0n, 'n must be between 8 and 512, and a multiple of 8')
    this.n = n
    this.name = name ?? `UintN<${n}>`
    this.wtype = wtype ?? new wtypes.ARC4UIntN({ n: this.n })
  }
}
export const UFixedNxMClass = new LibClassType({
  name: 'UFixedNxM',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})
export const UFixedNxMGeneric = new GenericPType({
  name: UFixedNxMClass.name,
  module: UFixedNxMClass.module,
  parameterise(typeArgs: PType[]) {
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
  readonly module = Constants.moduleNames.algoTs.arc4.encodedTypes
  readonly n: bigint
  readonly m: bigint
  readonly name: string
  readonly singleton = false
  readonly wtype: wtypes.ARC4UFixedNxM

  get fixedBitSize() {
    return this.n
  }

  get nativeType() {
    return this.n <= 64n ? uint64PType : biguintPType
  }

  constructor({ n, m }: { n: bigint; m: bigint }) {
    super()
    codeInvariant(n >= 8n && n <= 512n && n % 8n === 0n, 'n must be between 8 and 512, and a multiple of 8')
    codeInvariant(m >= 1n && m <= 160n, 'm must be between 1 and 160')
    this.n = n
    this.m = m
    this.name = `${UFixedNxMClass.name}<${n}, ${m}>`
    this.wtype = new wtypes.ARC4UFixedNxM({ n: this.n, m: this.m })
  }
}

export const arc4ByteAlias = new UintNType({ n: 8n, wtype: wtypes.arc4ByteAliasWType, name: 'Byte' })

export const DynamicArrayConstructor = new LibClassType({
  name: 'DynamicArray',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})
export const DynamicArrayGeneric = new GenericPType({
  name: 'DynamicArray',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
  parameterise: (typeArgs: PType[]): DynamicArrayType => {
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
  readonly module = Constants.moduleNames.algoTs.arc4.encodedTypes

  readonly immutable: boolean
  readonly name: string
  readonly singleton = false
  readonly sourceLocation: SourceLocation | undefined
  readonly nativeType: PType
  readonly wtype: wtypes.ARC4DynamicArray
  readonly fixedBitSize = null

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
      nativeType: this.nativeType.wtype,
    })
  }
}
export const StaticArrayConstructor = new LibClassType({
  name: 'StaticArray',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})
export const StaticArrayGeneric = new GenericPType({
  name: 'StaticArray',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
  parameterise: (typeArgs: PType[]): StaticArrayType => {
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
  readonly module = Constants.moduleNames.algoTs.arc4.encodedTypes
  readonly arraySize: bigint
  readonly immutable: boolean
  readonly name: string
  readonly singleton = false
  readonly sourceLocation: SourceLocation | undefined
  readonly wtype: wtypes.ARC4StaticArray
  readonly nativeType: PType
  readonly fixedBitSize: bigint | null
  constructor({
    elementType,
    arraySize,
    sourceLocation,
    wtype,
    name,
    immutable,
    nativeType,
  }: {
    immutable?: boolean
    elementType: ARC4EncodedType
    arraySize: bigint
    sourceLocation?: SourceLocation
    wtype?: ARC4StaticArray
    name?: string
    nativeType?: PType
  }) {
    codeInvariant(arraySize >= 0, 'StaticArray length must be greater than or equal to 0')
    super({ elementType })
    this.immutable = immutable ?? false
    this.arraySize = arraySize
    this.name = name ?? `StaticArray<${elementType}, ${arraySize}>`
    this.sourceLocation = sourceLocation
    this.nativeType = nativeType ?? new TuplePType({ items: new Array(Number(arraySize)).fill(elementType) })
    this.wtype =
      wtype ??
      new wtypes.ARC4StaticArray({
        elementType: this.elementType.wtype,
        arraySize: this.arraySize,
        immutable: this.immutable,
        nativeType: nativeType?.wtype,
      })
    this.fixedBitSize = ARC4EncodedType.calculateFixedBitSize(new Array(Number(arraySize)).fill(elementType))
  }
}
export const arc4AddressAlias = new StaticArrayType({
  arraySize: BigInt(Constants.algo.addressLength),
  elementType: arc4ByteAlias,
  wtype: wtypes.arc4AddressAliasWType,
  nativeType: accountPType,
  immutable: true,
  name: 'Address',
})

export const AddressClass = new LibClassType({
  name: 'Address',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
})

export const StaticBytesGeneric = new GenericPType({
  name: 'StaticBytes',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
  parameterise: (typeArgs: PType[]): StaticBytesType => {
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
export const StaticBytesConstructor = new LibClassType({
  name: 'StaticBytes',
  module: Constants.moduleNames.algoTs.arc4.encodedTypes,
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
  parameterise(args: PType[]) {
    invariant(args.length === 1, 'ContractProxy expects exactly 1 type arg')
    const [typeArg] = args
    invariant(typeArg instanceof ContractClassPType && typeArg.isARC4, 'Contract Proxy generic type arg must extend arc4 Contract type')
    return new ContractProxyType({ contractType: typeArg })
  },
})

export class ContractProxyType extends PType {
  readonly name: string
  readonly module = Constants.moduleNames.algoTs.arc4.c2c
  readonly wtype: WTuple
  readonly singleton = false
  readonly contractType: ContractClassPType
  constructor({ contractType }: { contractType: ContractClassPType }) {
    super()
    this.name = `ContractProxy<${contractType.name}>`

    this.wtype = compiledContractType.wtype
    this.contractType = contractType
  }
}

export const TypedApplicationCallResponseGeneric = new GenericPType({
  name: 'TypedApplicationCallResponse',
  module: Constants.moduleNames.algoTs.arc4.c2c,
  parameterise(args: PType[]) {
    invariant(args.length === 1, 'TypedApplicationCallResponse expects exactly 1 type arg')
    const [typeArg] = args
    return new TypedApplicationCallResponseType({ returnValue: typeArg })
  },
})

export class TypedApplicationCallResponseType extends ObjectPType {
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
