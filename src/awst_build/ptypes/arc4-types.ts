import type { SourceLocation } from '../../awst/source-location'
import { wtypes } from '../../awst/wtypes'
import { Constants } from '../../constants'
import { codeInvariant, zipStrict } from '../../util'
import { GenericPType, PType } from './base'
import { biguintPType, boolPType, LibClassType, NumericLiteralPType, ObjectPType, stringPType, TuplePType, uint64PType } from './index'
import ARC4StaticArray = wtypes.ARC4StaticArray

export const UintNClass = new LibClassType({
  name: 'UintN',
  module: Constants.arc4EncodedTypesModuleName,
})

export const ByteClass = new LibClassType({
  name: 'Byte',
  module: Constants.arc4EncodedTypesModuleName,
})
export abstract class ARC4EncodedType extends PType {
  abstract readonly wtype: wtypes.ARC4Type
  abstract readonly nativeType: PType | undefined
}

export class ARC4InstanceType extends ARC4EncodedType {
  readonly wtype: wtypes.ARC4Type
  readonly name: string
  readonly module = Constants.arc4EncodedTypesModuleName
  readonly singleton = false
  readonly nativeType: PType
  constructor({ wtype, nativeType, name }: { wtype: wtypes.ARC4Type; name: string; nativeType: PType }) {
    super()
    this.wtype = wtype
    this.name = name
    this.nativeType = nativeType
  }
}

export const ARC4BoolClass = new LibClassType({
  name: 'Bool',
  module: Constants.arc4EncodedTypesModuleName,
})

export const ARC4StrClass = new LibClassType({
  name: 'Str',
  module: Constants.arc4EncodedTypesModuleName,
})

export const ARC4BooleanType = new ARC4InstanceType({
  name: 'Bool',
  wtype: wtypes.arc4BooleanWType,
  nativeType: boolPType,
})

export const ARC4StringType = new ARC4InstanceType({
  name: 'Str',
  wtype: wtypes.arc4StringAliasWType,
  nativeType: stringPType,
})

export class ARC4StructType extends ARC4EncodedType {
  readonly name: string
  readonly module: string
  readonly singleton = false
  readonly fields: Record<string, ARC4EncodedType>
  readonly sourceLocation: SourceLocation | undefined
  constructor({
    name,
    module,
    fields,
    sourceLocation,
  }: {
    name: string
    module: string
    fields: Record<string, ARC4EncodedType>
    sourceLocation?: SourceLocation
  }) {
    super()
    this.name = name
    this.module = module
    this.fields = fields
    this.sourceLocation = sourceLocation
  }

  get nativeType(): ObjectPType {
    return ObjectPType.anonymous(this.fields)
  }

  get wtype(): wtypes.ARC4Struct {
    return new wtypes.ARC4Struct({
      name: this.name,
      fields: Object.fromEntries(Object.entries(this.fields).map(([f, t]) => [f, t.wtype])),
      sourceLocation: this.sourceLocation,
    })
  }

  equals(other: PType): boolean {
    if (!(other instanceof ARC4StructType)) return false
    const thisProps = Object.entries(this.fields)
    const otherProps = Object.entries(other.fields)
    return (
      this.name === other.name &&
      thisProps.length === otherProps.length &&
      zipStrict(thisProps, otherProps).every(
        ([[left_prop, left_type], [right_prop, right_type]]) => left_prop === right_prop && left_type.equals(right_type),
      )
    )
  }
}

export const Arc4TupleClass = new LibClassType({
  name: 'Tuple',
  module: Constants.arc4EncodedTypesModuleName,
})

export const Arc4TupleGeneric = new GenericPType({
  name: 'Tuple',
  module: Constants.arc4EncodedTypesModuleName,
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
  readonly module = Constants.arc4EncodedTypesModuleName
  readonly singleton = false
  readonly items: ARC4EncodedType[]
  readonly sourceLocation: SourceLocation | undefined

  readonly nativeType: TuplePType

  constructor({ types, sourceLocation }: { types: ARC4EncodedType[]; sourceLocation?: SourceLocation }) {
    super()
    this.items = types
    this.sourceLocation = sourceLocation
    this.nativeType = new TuplePType({ items: this.items })
  }

  get wtype(): wtypes.ARC4Tuple {
    return new wtypes.ARC4Tuple({
      types: this.items.map((t) => t.wtype),
      sourceLocation: this.sourceLocation,
    })
  }

  equals(other: PType): boolean {
    return (
      other instanceof ARC4TupleType &&
      this.items.length === other.items.length &&
      zipStrict(this.items, other.items).every(([a, b]) => a.equals(b))
    )
  }
}
export const UintNGeneric = new GenericPType({
  name: 'UintN',
  module: Constants.arc4EncodedTypesModuleName,
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
  readonly module = Constants.arc4EncodedTypesModuleName
  readonly n: bigint
  readonly name: string
  readonly singleton = false
  readonly wtype: wtypes.ARC4UIntN

  get nativeType() {
    return this.n <= 64n ? uint64PType : biguintPType
  }

  constructor({ n, wtype, name }: { n: bigint; wtype?: wtypes.ARC4UIntN; name?: string }) {
    super()
    codeInvariant(n >= 8n && n <= 512n && n % 8n === 0n, 'n must be between 8 and 512, and a multiple of 8')
    this.n = n
    this.name = name ?? `UIntN<${n}>`
    this.wtype = wtype ?? new wtypes.ARC4UIntN({ n: this.n })
  }
}
export const UFixedNxMClass = new LibClassType({
  name: 'UFixedNxM',
  module: Constants.arc4EncodedTypesModuleName,
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
  readonly module = Constants.arc4EncodedTypesModuleName
  readonly n: bigint
  readonly m: bigint
  readonly name: string
  readonly singleton = false
  readonly wtype: wtypes.ARC4UFixedNxM

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
  module: Constants.arc4EncodedTypesModuleName,
})
export const DynamicArrayGeneric = new GenericPType({
  name: 'DynamicArray',
  module: Constants.arc4EncodedTypesModuleName,
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
export class DynamicArrayType extends ARC4EncodedType {
  readonly module = Constants.arc4EncodedTypesModuleName
  readonly elementType: ARC4EncodedType
  readonly immutable: boolean
  readonly name: string
  readonly singleton = false
  readonly sourceLocation: SourceLocation | undefined
  readonly nativeType = undefined

  get wtype(): wtypes.ARC4DynamicArray {
    return new wtypes.ARC4DynamicArray({
      elementType: this.elementType.wtype,
      sourceLocation: this.sourceLocation,
      immutable: this.immutable,
    })
  }

  constructor({ elementType, sourceLocation }: { elementType: ARC4EncodedType; sourceLocation?: SourceLocation }) {
    super()
    this.immutable = false
    this.elementType = elementType
    this.name = `DynamicArray<${elementType}>`
    this.sourceLocation = sourceLocation
  }
}
export const StaticArrayConstructor = new LibClassType({
  name: 'StaticArray',
  module: Constants.arc4EncodedTypesModuleName,
})
export const StaticArrayGeneric = new GenericPType({
  name: 'StaticArray',
  module: Constants.arc4EncodedTypesModuleName,
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
export class StaticArrayType extends ARC4EncodedType {
  static baseFullName = `${Constants.arc4EncodedTypesModuleName}::StaticArray`
  readonly module = Constants.arc4EncodedTypesModuleName
  readonly elementType: ARC4EncodedType
  readonly arraySize: bigint
  readonly immutable: boolean
  readonly name: string
  readonly singleton = false
  readonly sourceLocation: SourceLocation | undefined
  readonly wtype: wtypes.ARC4StaticArray
  readonly nativeType = undefined

  constructor({
    elementType,
    arraySize,
    sourceLocation,
    wtype,
    name,
    immutable,
  }: {
    immutable?: boolean
    elementType: ARC4EncodedType
    arraySize: bigint
    sourceLocation?: SourceLocation
    wtype?: ARC4StaticArray
    name?: string
  }) {
    super()
    this.immutable = immutable ?? false
    this.elementType = elementType
    this.arraySize = arraySize
    this.name = name ?? `StaticArray<${elementType}>`
    this.sourceLocation = sourceLocation
    this.wtype =
      wtype ?? new wtypes.ARC4StaticArray({ elementType: this.elementType.wtype, arraySize: this.arraySize, immutable: this.immutable })
  }
}
export const arc4AddressAlias = new StaticArrayType({
  arraySize: BigInt(Constants.encodedAddressLength),
  elementType: arc4ByteAlias,
  wtype: wtypes.arc4AddressAliasWType,
  immutable: true,
  name: 'Address',
})

export const AddressClass = new LibClassType({
  name: 'Address',
  module: Constants.arc4EncodedTypesModuleName,
})
