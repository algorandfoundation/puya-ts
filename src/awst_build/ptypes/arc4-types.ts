import type { SourceLocation } from '../../awst/source-location'
import type { ARC4Type } from '../../awst/wtypes'
import { ARC4DynamicArray, ARC4StaticArray, ARC4UIntN } from '../../awst/wtypes'
import { Constants } from '../../constants'
import { codeInvariant } from '../../util'
import { PType } from './base'
import { LibFunctionType, NumericLiteralPType } from './index'

export const UintNConstructor = new LibFunctionType({
  name: 'UintN',
  module: Constants.arc4EncodedTypesModuleName,
})
export abstract class ARC4EncodedType extends PType {
  abstract get wtype(): ARC4Type
}

export class UintNType extends ARC4EncodedType {
  static baseFullName = `${Constants.arc4EncodedTypesModuleName}::UintN`
  readonly module = Constants.arc4EncodedTypesModuleName
  readonly n: bigint
  readonly name: string
  readonly singleton = false

  get wtype(): ARC4UIntN {
    return new ARC4UIntN({ n: this.n })
  }

  constructor({ n }: { n: bigint }) {
    super()
    codeInvariant(n >= 8n && n <= 512n && n % 8n === 0n, 'n must be between 8 and 512, and a multiple of 8')
    this.n = n
    this.name = `UIntN<${n}>`
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

  get wtype(): ARC4DynamicArray {
    return new ARC4DynamicArray({ elementType: this.elementType.wtype, sourceLocation: this.sourceLocation })
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
  get wtype(): ARC4StaticArray {
    return new ARC4StaticArray({ elementType: this.elementType.wtype, arraySize: this.arraySize })
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
