import type { SourceLocation } from '../../awst/source-location'
import type { ARC4WType } from '../../awst/wtypes'
import {
  arc4BooleanWType,
  arc4ByteAliasWType,
  ARC4DynamicArrayWType,
  ARC4StaticArrayWType,
  arc4StringAliasWType,
  ARC4StructWType,
  ARC4TupleWType,
  ARC4UIntNWType,
} from '../../awst/wtypes'
import { Constants } from '../../constants'
import { codeInvariant, zipStrict } from '../../util'
import { PType } from './base'
import { LibFunctionType, NumericLiteralPType } from './index'

export const UintNConstructor = new LibFunctionType({
  name: 'UintN',
  module: Constants.arc4EncodedTypesModuleName,
})
export abstract class ARC4EncodedType extends PType {
  abstract readonly wtype: ARC4WType
}

export class ARC4InstanceType extends ARC4EncodedType {
  readonly wtype: ARC4WType
  readonly name: string
  readonly module = Constants.arc4ModuleName
  readonly singleton = false
  constructor({ wtype, name }: { wtype: ARC4WType; name: string }) {
    super()
    this.wtype = wtype
    this.name = name
  }
}

export const ARC4BooleanType = new ARC4InstanceType({
  name: 'ARC4Boolean',
  wtype: arc4BooleanWType,
})

export const ARC4StringType = new ARC4InstanceType({
  name: 'ARC4String',
  wtype: arc4StringAliasWType,
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

  get wtype(): ARC4StructWType {
    return new ARC4StructWType({
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

export class ARC4TupleType extends ARC4EncodedType {
  readonly name = 'Tuple'
  readonly module = Constants.arc4ModuleName
  readonly singleton = false
  readonly types: ARC4EncodedType[]
  readonly sourceLocation: SourceLocation | undefined
  constructor({ types, sourceLocation }: { types: ARC4EncodedType[]; sourceLocation?: SourceLocation }) {
    super()
    this.types = types
    this.sourceLocation = sourceLocation
  }

  get wtype(): ARC4TupleWType {
    return new ARC4TupleWType({
      types: this.types.map((t) => t.wtype),
      sourceLocation: this.sourceLocation,
    })
  }

  equals(other: PType): boolean {
    return (
      other instanceof ARC4TupleType &&
      this.types.length === other.types.length &&
      zipStrict(this.types, other.types).every(([a, b]) => a.equals(b))
    )
  }
}

export class UintNType extends ARC4EncodedType {
  static baseFullName = `${Constants.arc4EncodedTypesModuleName}::UintN`
  readonly module = Constants.arc4EncodedTypesModuleName
  readonly n: bigint
  readonly name: string
  readonly singleton = false

  readonly wtype: ARC4UIntNWType

  constructor({ n, wtype }: { n: bigint; wtype?: ARC4UIntNWType }) {
    super()
    codeInvariant(n >= 8n && n <= 512n && n % 8n === 0n, 'n must be between 8 and 512, and a multiple of 8')
    this.n = n
    this.name = `UIntN<${n}>`
    this.wtype = wtype ?? new ARC4UIntNWType({ n: this.n })
  }

  static parameterise(typeArgs: PType[]): UintNType {
    codeInvariant(typeArgs.length === 1, 'UintNType type expects exactly one type parameter')
    const [size] = typeArgs
    codeInvariant(
      size instanceof NumericLiteralPType && size.literalValue,
      `Generic type param for UintNType must be a literal number. Inferred type is ${size.name}`,
    )

    return new UintNType({ n: size.literalValue })
  }

  getGenericArgs(): PType[] {
    return [new NumericLiteralPType({ literalValue: this.n })]
  }
}

export const arc4ByteAlias = new UintNType({ n: 8n, wtype: arc4ByteAliasWType })

export const DynamicArrayConstructor = new LibFunctionType({
  name: 'DynamicArray',
  module: Constants.arc4EncodedTypesModuleName,
})
export class DynamicArrayType extends ARC4EncodedType {
  static baseFullName = `${Constants.arc4EncodedTypesModuleName}::DynamicArray`
  readonly module = Constants.arc4EncodedTypesModuleName
  readonly elementType: ARC4EncodedType
  readonly name: string
  readonly singleton = false
  readonly sourceLocation: SourceLocation | undefined

  get wtype(): ARC4DynamicArrayWType {
    return new ARC4DynamicArrayWType({ elementType: this.elementType.wtype, sourceLocation: this.sourceLocation })
  }

  constructor({ elementType, sourceLocation }: { elementType: ARC4EncodedType; sourceLocation?: SourceLocation }) {
    super()
    this.elementType = elementType
    this.name = `DynamicArray<${elementType}>`
    this.sourceLocation = sourceLocation
  }

  static parameterise(typeArgs: PType[]): DynamicArrayType {
    codeInvariant(typeArgs.length === 1, 'DynamicArray type expects exactly one type parameter')
    const [elementType] = typeArgs
    codeInvariant(
      elementType instanceof ARC4EncodedType,
      `Generic type param for DynamicArray must be an ARC4 encoded type. Inferred type is ${elementType.name}`,
    )

    return new DynamicArrayType({ elementType: elementType })
  }

  getGenericArgs(): PType[] {
    return [this.elementType]
  }
}
export const StaticArrayConstructor = new LibFunctionType({
  name: 'StaticArray',
  module: Constants.arc4EncodedTypesModuleName,
})
export class StaticArrayType extends ARC4EncodedType {
  static baseFullName = `${Constants.arc4EncodedTypesModuleName}::StaticArray`
  readonly module = Constants.arc4EncodedTypesModuleName
  readonly elementType: ARC4EncodedType
  readonly arraySize: bigint
  readonly name: string
  readonly singleton = false
  readonly sourceLocation: SourceLocation | undefined
  get wtype(): ARC4StaticArrayWType {
    return new ARC4StaticArrayWType({ elementType: this.elementType.wtype, arraySize: this.arraySize })
  }

  constructor({
    elementType,
    arraySize,
    sourceLocation,
  }: {
    elementType: ARC4EncodedType
    arraySize: bigint
    sourceLocation?: SourceLocation
  }) {
    super()
    this.elementType = elementType
    this.arraySize = arraySize
    this.name = `StaticArray<${elementType}>`
    this.sourceLocation = sourceLocation
  }

  static parameterise(typeArgs: PType[]): StaticArrayType {
    codeInvariant(typeArgs.length === 2, 'StaticArray type expects exactly one type parameters')
    const [elementType, arraySize] = typeArgs
    codeInvariant(
      elementType instanceof ARC4EncodedType,
      `Element type generic type param for DynamicArray must be an ARC4 encoded type. Inferred type is ${elementType.name}`,
    )
    codeInvariant(
      arraySize instanceof NumericLiteralPType,
      `Array size generic type param for StaticArray must be a literal number. Inferred type is ${arraySize.name}`,
    )

    return new StaticArrayType({ arraySize: arraySize.literalValue, elementType })
  }

  getGenericArgs(): PType[] {
    return [this.elementType, new NumericLiteralPType({ literalValue: this.arraySize })]
  }
}
